export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const users = await d1Query('SELECT id, email, nama_lengkap as name, role, status FROM member WHERE email = ? AND password = ?', [data.email, data.password]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, error: "Email atau password salah." }, { status: 401 });
    }

    const user = users[0];
    
    if (user.status === 'pending') {
      return NextResponse.json({ success: false, error: "Akun Anda belum di-approve oleh admin. Harap tunggu atau hubungi admin." }, { status: 403 });
    }
    
    if (user.status === 'rejected') {
      return NextResponse.json({ success: false, error: "Maaf, pendaftaran Anda ditolak oleh admin." }, { status: 403 });
    }

    return NextResponse.json({ success: true, user: user });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
