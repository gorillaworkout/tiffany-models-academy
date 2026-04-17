export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    const rows = await d1Query('SELECT id, name FROM coach');
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (data.oldName && data.oldName !== "" && data.oldName !== data.name) {
      // Rename: delete old, insert new (id = name)
      await d1Query('DELETE FROM coach WHERE id = ?', [data.oldName]);
      await d1Query('INSERT INTO coach (id, name) VALUES (?, ?)', [data.name, data.name]);
    } else {
      // New coach
      const existing = await d1Query('SELECT id FROM coach WHERE id = ?', [data.name]);
      if (existing && existing.length > 0) {
        await d1Query('UPDATE coach SET name = ? WHERE id = ?', [data.name, data.name]);
      } else {
        await d1Query('INSERT INTO coach (id, name) VALUES (?, ?)', [data.name, data.name]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await d1Query('DELETE FROM coach WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
