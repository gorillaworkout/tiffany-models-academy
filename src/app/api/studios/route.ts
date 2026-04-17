export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    const rows = await d1Query('SELECT id, name, lat, lon FROM studio');
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || data.name;
    // Check if exists
    const existing = await d1Query('SELECT id FROM studio WHERE id = ?', [id]);
    if (existing && existing.length > 0) {
      await d1Query('UPDATE studio SET name = ?, lat = ?, lon = ? WHERE id = ?', [data.name, String(data.lat), String(data.lon), id]);
    } else {
      await d1Query('INSERT INTO studio (id, name, lat, lon) VALUES (?, ?, ?, ?)', [id, data.name, String(data.lat), String(data.lon)]);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await d1Query('DELETE FROM studio WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
