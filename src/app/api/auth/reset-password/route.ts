export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

// POST: Admin resets a user's password
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { adminId, targetUserId, newPassword } = data;

    if (!adminId || !targetUserId || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // Verify caller is admin
    const admins = await d1Query('SELECT id, role FROM member WHERE id = ? AND role = ?', [parseInt(adminId), 'admin']);
    if (!admins || admins.length === 0) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin only." }, { status: 403 });
    }

    // Verify target user exists
    const users = await d1Query('SELECT id, nama_lengkap as name FROM member WHERE id = ?', [parseInt(targetUserId)]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });
    }

    // Reset password
    await d1Query('UPDATE member SET password = ? WHERE id = ?', [newPassword, parseInt(targetUserId)]);

    return NextResponse.json({ success: true, userName: users[0].name });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
