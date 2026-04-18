export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');
    const batchId = searchParams.get('batchId');
    const check = searchParams.get('check');
    const fromBatchId = searchParams.get('fromBatchId');
    const toBatchId = searchParams.get('toBatchId');

    // Gap check mode
    if (check === 'true' && memberId && fromBatchId && toBatchId) {
      const todayStr = new Date().toISOString().split('T')[0];

      // Count configured sessions with date <= today for each batch (completed sessions)
      const fromCompleted = await d1Query(
        `SELECT COUNT(*) as cnt FROM jadwal WHERE batch_id = ? AND is_configured = 1 AND date IS NOT NULL AND date <= ?`,
        [fromBatchId, todayStr]
      );
      const toCompleted = await d1Query(
        `SELECT COUNT(*) as cnt FROM jadwal WHERE batch_id = ? AND is_configured = 1 AND date IS NOT NULL AND date <= ?`,
        [toBatchId, todayStr]
      );

      // Count student's attended sessions in fromBatch
      const studentAttended = await d1Query(
        `SELECT COUNT(*) as cnt FROM absensi a 
         INNER JOIN jadwal j ON a.jadwal_id = j.id 
         WHERE a.member_id = ? AND j.batch_id = ? AND a.status = 'hadir'`,
        [parseInt(memberId), fromBatchId]
      );

      const fromProgress = studentAttended[0]?.cnt || 0;
      const toProgress = toCompleted[0]?.cnt || 0;
      const gap = toProgress - fromProgress;

      // Get titles of sessions the student would miss (sessions in toBatch that are completed but student hasn't attended equivalent)
      let gapSessions: string[] = [];
      if (gap > 0) {
        // Get the completed sessions from toBatch, ordered by session number
        const toSessions = await d1Query(
          `SELECT session, title FROM jadwal WHERE batch_id = ? AND is_configured = 1 AND date IS NOT NULL AND date <= ? ORDER BY session ASC`,
          [toBatchId, todayStr]
        );
        // The gap sessions are the ones beyond what the student has completed
        if (Array.isArray(toSessions)) {
          gapSessions = toSessions.slice(fromProgress).map((s: any) => `Session ${s.session}: ${s.title}`);
        }
      }

      // Check if toBatch has room
      const capacity = await d1Query(
        `SELECT b.max_students as maxStudents, 
                (SELECT COUNT(*) FROM member WHERE batch_id = b.id AND status = 'approved' AND role = 'student') as totalStudents
         FROM batch b WHERE b.id = ?`,
        [toBatchId]
      );
      const maxStudents = capacity[0]?.maxStudents || 30;
      const totalStudents = capacity[0]?.totalStudents || 0;
      const canTransfer = totalStudents < maxStudents;

      // Get total sessions for each batch
      const fromTotal = await d1Query(
        `SELECT COUNT(*) as cnt FROM jadwal WHERE batch_id = ?`,
        [fromBatchId]
      );
      const toTotal = await d1Query(
        `SELECT COUNT(*) as cnt FROM jadwal WHERE batch_id = ?`,
        [toBatchId]
      );

      return NextResponse.json({
        fromProgress,
        fromTotal: fromTotal[0]?.cnt || 16,
        toProgress,
        toTotal: toTotal[0]?.cnt || 16,
        gap,
        gapSessions,
        canTransfer,
        totalStudents,
        maxStudents,
      });
    }

    // Get pending transfer requests for a member
    if (memberId) {
      const rows = await d1Query(
        `SELECT tr.*, 
                bf.name as fromBatchName, bt.name as toBatchName,
                sf.name as fromStudioName, st.name as toStudioName
         FROM transfer_requests tr
         LEFT JOIN batch bf ON tr.from_batch_id = bf.id
         LEFT JOIN batch bt ON tr.to_batch_id = bt.id
         LEFT JOIN studio sf ON bf.studio_id = sf.id
         LEFT JOIN studio st ON bt.studio_id = st.id
         WHERE tr.member_id = ? AND tr.status = 'pending'
         ORDER BY tr.created_at DESC`,
        [parseInt(memberId)]
      );
      return NextResponse.json(rows || []);
    }

    // Get all pending transfer requests TO a batch (for admin)
    if (batchId) {
      const rows = await d1Query(
        `SELECT tr.*, 
                m.nama_lengkap as memberName, m.email as memberEmail,
                bf.name as fromBatchName, bt.name as toBatchName,
                sf.name as fromStudioName, st.name as toStudioName
         FROM transfer_requests tr
         LEFT JOIN member m ON tr.member_id = m.id
         LEFT JOIN batch bf ON tr.from_batch_id = bf.id
         LEFT JOIN batch bt ON tr.to_batch_id = bt.id
         LEFT JOIN studio sf ON bf.studio_id = sf.id
         LEFT JOIN studio st ON bt.studio_id = st.id
         WHERE tr.to_batch_id = ? AND tr.status = 'pending'
         ORDER BY tr.created_at DESC`,
        [batchId]
      );
      return NextResponse.json(rows || []);
    }

    return NextResponse.json([]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { memberId, fromBatchId, toBatchId, reason } = await req.json();

    if (!memberId || !fromBatchId || !toBatchId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already has pending request
    const existing = await d1Query(
      `SELECT id FROM transfer_requests WHERE member_id = ? AND status = 'pending'`,
      [parseInt(memberId)]
    );
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'You already have a pending transfer request' }, { status: 400 });
    }

    // Check capacity
    const capacity = await d1Query(
      `SELECT b.max_students as maxStudents, 
              (SELECT COUNT(*) FROM member WHERE batch_id = b.id AND status = 'approved' AND role = 'student') as totalStudents
       FROM batch b WHERE b.id = ?`,
      [toBatchId]
    );
    if (capacity[0] && capacity[0].totalStudents >= capacity[0].maxStudents) {
      return NextResponse.json({ error: 'Target batch is full' }, { status: 400 });
    }

    // Calculate module gap
    const todayStr = new Date().toISOString().split('T')[0];
    const studentAttended = await d1Query(
      `SELECT COUNT(*) as cnt FROM absensi a 
       INNER JOIN jadwal j ON a.jadwal_id = j.id 
       WHERE a.member_id = ? AND j.batch_id = ? AND a.status = 'hadir'`,
      [parseInt(memberId), fromBatchId]
    );
    const toCompleted = await d1Query(
      `SELECT COUNT(*) as cnt FROM jadwal WHERE batch_id = ? AND is_configured = 1 AND date IS NOT NULL AND date <= ?`,
      [toBatchId, todayStr]
    );

    const fromProgress = studentAttended[0]?.cnt || 0;
    const toProgress = toCompleted[0]?.cnt || 0;
    const gap = toProgress - fromProgress;

    // Get gap details
    let gapSessions: string[] = [];
    if (gap > 0) {
      const toSessions = await d1Query(
        `SELECT session, title FROM jadwal WHERE batch_id = ? AND is_configured = 1 AND date IS NOT NULL AND date <= ? ORDER BY session ASC`,
        [toBatchId, todayStr]
      );
      if (Array.isArray(toSessions)) {
        gapSessions = toSessions.slice(fromProgress).map((s: any) => `Session ${s.session}: ${s.title}`);
      }
    }

    const id = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    await d1Query(
      `INSERT INTO transfer_requests (id, member_id, from_batch_id, to_batch_id, status, reason, module_gap, gap_details)
       VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [id, parseInt(memberId), fromBatchId, toBatchId, reason || '', gap, JSON.stringify({ gapSessions })]
    );

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { requestId, action } = await req.json();

    if (!requestId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get the transfer request
    const requests = await d1Query(
      `SELECT * FROM transfer_requests WHERE id = ? AND status = 'pending'`,
      [requestId]
    );
    if (!requests || requests.length === 0) {
      return NextResponse.json({ error: 'Transfer request not found or already resolved' }, { status: 404 });
    }

    const tr = requests[0] as any;
    const now = new Date().toISOString();

    if (action === 'approve') {
      // Check capacity again before approving
      const capacity = await d1Query(
        `SELECT b.max_students as maxStudents, 
                (SELECT COUNT(*) FROM member WHERE batch_id = b.id AND status = 'approved' AND role = 'student') as totalStudents
         FROM batch b WHERE b.id = ?`,
        [tr.to_batch_id]
      );
      if (capacity[0] && capacity[0].totalStudents >= capacity[0].maxStudents) {
        return NextResponse.json({ error: 'Target batch is now full' }, { status: 400 });
      }

      // Update member's batch_id
      await d1Query(
        `UPDATE member SET batch_id = ? WHERE id = ?`,
        [tr.to_batch_id, tr.member_id]
      );

      // Update transfer request status
      await d1Query(
        `UPDATE transfer_requests SET status = 'approved', resolved_at = ? WHERE id = ?`,
        [now, requestId]
      );
    } else {
      // Reject
      await d1Query(
        `UPDATE transfer_requests SET status = 'rejected', resolved_at = ? WHERE id = ?`,
        [now, requestId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
