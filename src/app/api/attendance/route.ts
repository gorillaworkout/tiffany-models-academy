export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');
    const jadwalId = searchParams.get('jadwalId');
    const batchId = searchParams.get('batchId');

    if (memberId && jadwalId) {
      // Check if a specific member already checked in for a specific class
      const rows = await d1Query('SELECT * FROM absensi WHERE member_id = ? AND jadwal_id = ?', [parseInt(memberId), jadwalId]);
      return NextResponse.json({ hasCheckedIn: rows.length > 0 });
    }

    if (memberId && batchId) {
      // Fetch all attendance records for a student in a specific batch
      const rows = await d1Query(`
        SELECT a.id, a.jadwal_id, a.status, a.check_in_time 
        FROM absensi a 
        INNER JOIN jadwal j ON a.jadwal_id = j.id 
        WHERE a.member_id = ? AND j.batch_id = ?
      `, [parseInt(memberId), batchId]);
      return NextResponse.json(rows);
    }
    
    if (batchId && !memberId) {
       // Fetch attendance summary for a batch for admin view
       const summary = await d1Query(`
         SELECT j.id as jadwalId, j.session, j.title, j.date, 
                (SELECT COUNT(*) FROM absensi a WHERE a.jadwal_id = j.id AND a.status = 'hadir') as present,
                (SELECT COUNT(*) FROM member m WHERE m.batch_id = j.batch_id AND m.status = 'approved' AND m.role = 'student') as total
         FROM jadwal j
         WHERE j.batch_id = ? AND j.is_configured = 1
         ORDER BY j.session ASC
       `, [batchId]);

       // For sessions with absentees, fetch names of who didn't attend
       const enriched = await Promise.all((summary || []).map(async (s: any) => {
         if (s.present < s.total && s.present > 0) {
           const absentees = await d1Query(`
             SELECT m.nama_lengkap as name FROM member m 
             WHERE m.batch_id = ? AND m.status = 'approved' AND m.role = 'student'
             AND m.id NOT IN (SELECT a.member_id FROM absensi a WHERE a.jadwal_id = ? AND a.status = 'hadir')
           `, [batchId, s.jadwalId]);
           return { ...s, absentees: (absentees || []).map((a: any) => a.name) };
         }
         return { ...s, absentees: [] };
       }));
       
       return NextResponse.json(enriched);
    }
    
    if (jadwalId) {
        // Detailed attendance list for a specific session
        const details = await d1Query(`
            SELECT m.id as memberId, m.nama_lengkap as name, a.status, a.check_in_time as time
            FROM member m
            LEFT JOIN absensi a ON m.id = a.member_id AND a.jadwal_id = ?
            WHERE m.batch_id = (SELECT batch_id FROM jadwal WHERE id = ?) AND m.status = 'approved' AND m.role = 'student'
        `, [jadwalId, jadwalId]);
        return NextResponse.json(details);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { memberId, jadwalId, status, lat, lon } = data;

    if (!memberId || !jadwalId || !status) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if already checked in
    const existing = await d1Query('SELECT id FROM absensi WHERE member_id = ? AND jadwal_id = ?', [parseInt(memberId), jadwalId]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Already checked in!" }, { status: 400 });
    }

    const id = Date.now().toString();
    await d1Query(`
      INSERT INTO absensi (id, member_id, jadwal_id, status, lat, lon)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, parseInt(memberId), jadwalId, status, lat ? String(lat) : null, lon ? String(lon) : null]);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
