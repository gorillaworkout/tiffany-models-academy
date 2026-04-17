export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const existing = await d1Query('SELECT id FROM member WHERE email = ?', [data.email]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, error: "Email sudah terdaftar." }, { status: 400 });
    }

    const role = data.email.toLowerCase() === 'darmawanbayu1@gmail.com' ? 'admin' : 'student';
    // Admin gets auto-approved, students are pending
    const status = role === 'admin' ? 'approved' : 'pending';

    await d1Query(`
      INSERT INTO member (batch_id, nama_lengkap, email, password, no_whatsapp, instagram, tinggi_badan, berat_badan, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.batch || 0, 
      data.fullName || data.name, 
      data.email, 
      data.password, 
      data.whatsapp || "", 
      data.instagram || "", 
      parseInt(data.height) || 0, 
      parseInt(data.weight) || 0, 
      role, 
      status
    ]);

    return NextResponse.json({ success: true, status: status });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
