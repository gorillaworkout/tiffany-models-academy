export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stats = searchParams.get('stats');

    if (stats === 'true') {
      const activeModels = await d1Query(`SELECT COUNT(*) as count FROM member WHERE status = 'approved' AND role = 'student'`);
      const pendingApprovals = await d1Query(`SELECT COUNT(*) as count FROM member WHERE status = 'pending'`);
      const branchesCount = await d1Query(`SELECT COUNT(*) as count FROM studio`);
      const publishedModules = await d1Query(`SELECT COUNT(*) as count FROM jadwal WHERE is_configured = 1`);

      return NextResponse.json({
        activeModels: activeModels[0]?.count || 0,
        pendingApprovals: pendingApprovals[0]?.count || 0,
        branchesCount: branchesCount[0]?.count || 0,
        publishedModules: publishedModules[0]?.count || 0,
      });
    }

    const rows = await d1Query(`SELECT 
      m.id, 
      m.batch_id, 
      m.nama_lengkap as name, 
      m.email, 
      m.no_whatsapp as whatsapp, 
      m.role, 
      m.status, 
      m.tinggi_badan as height, 
      m.berat_badan as weight, 
      m.instagram as ig,
      (
        SELECT COUNT(*) FROM absensi a WHERE a.member_id = m.id AND a.status = 'hadir'
      ) as attended_count,
      16 as total_sessions
    FROM member m`);
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (data.action === 'approve') {
       await d1Query("UPDATE member SET status = 'approved' WHERE id = ?", [data.id]);
    } else if (data.action === 'reject') {
       await d1Query("UPDATE member SET status = 'rejected' WHERE id = ?", [data.id]);
    } else if (data.action === 'delete') {
       await d1Query("DELETE FROM member WHERE id = ?", [data.id]);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
