export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

// POST: Change password (authenticated user)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, currentPassword, newPassword } = data;

    if (!userId || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password minimal 6 karakter." }, { status: 400 });
    }

    // Verify current password
    const users = await d1Query('SELECT id, password FROM member WHERE id = ?', [parseInt(userId)]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });
    }

    if (users[0].password !== currentPassword) {
      return NextResponse.json({ success: false, error: "Password lama salah." }, { status: 401 });
    }

    // Update password
    await d1Query('UPDATE member SET password = ? WHERE id = ?', [newPassword, parseInt(userId)]);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
