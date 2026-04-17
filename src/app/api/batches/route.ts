export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    const rows = await d1Query(`
      SELECT 
        b.id, 
        b.name, 
        b.studio_id as branch, 
        b.coach_id as coachId,
        b.status, 
        b.max_students as maxStudents,
        (SELECT COUNT(id) FROM member WHERE batch_id = b.id AND status = 'approved' AND role = 'student') as totalStudents
      FROM batch b
    `);
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || Date.now().toString();
    
    const existing = await d1Query('SELECT id FROM batch WHERE id = ?', [id]);
    
    if (existing && existing.length > 0) {
      await d1Query('UPDATE batch SET name = ?, studio_id = ?, coach_id = ?, status = ?, max_students = ? WHERE id = ?', 
        [data.name, data.branch, data.coachId || '', data.status, parseInt(data.maxStudents), id]);
    } else {
      await d1Query('INSERT INTO batch (id, name, studio_id, coach_id, status, max_students) VALUES (?, ?, ?, ?, ?, ?)', 
        [id, data.name, data.branch, data.coachId || '', data.status, parseInt(data.maxStudents)]);
    }
    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await d1Query('DELETE FROM batch WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
