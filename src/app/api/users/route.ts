export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    const rows = await d1Query('SELECT id, batch_id, nama_lengkap as name, email, no_whatsapp as whatsapp, role, status, tinggi_badan as height, berat_badan as weight, instagram as ig FROM member');
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
