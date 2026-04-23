export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { memberId, ukuran_heels, ukuran_baju } = data;

    if (!memberId) {
      return NextResponse.json({ success: false, error: "Member ID required." }, { status: 400 });
    }

    if (!ukuran_heels && !ukuran_baju) {
      return NextResponse.json({ success: false, error: "Please fill in at least one field." }, { status: 400 });
    }

    await d1Query(
      `UPDATE member SET ukuran_heels = ?, ukuran_baju = ? WHERE id = ?`,
      [ukuran_heels || null, ukuran_baju || null, memberId]
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
