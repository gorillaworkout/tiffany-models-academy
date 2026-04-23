export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    const rows = await d1Query(`
      SELECT id, name, description, module_count as moduleCount, status, created_at as createdAt
      FROM ebook_packages
      WHERE status = 'active'
      ORDER BY created_at DESC
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

    const existing = await d1Query('SELECT id FROM ebook_packages WHERE id = ?', [id]);

    if (existing && existing.length > 0) {
      await d1Query(
        'UPDATE ebook_packages SET name = ?, description = ?, module_count = ?, status = ? WHERE id = ?',
        [data.name, data.description || '', data.moduleCount || 16, data.status || 'active', id]
      );
    } else {
      await d1Query(
        'INSERT INTO ebook_packages (id, name, description, module_count, status) VALUES (?, ?, ?, ?, ?)',
        [id, data.name, data.description || '', data.moduleCount || 16, data.status || 'active']
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    // Also delete associated modules
    await d1Query('DELETE FROM ebook_modules WHERE package_id = ?', [id]);
    await d1Query('DELETE FROM ebook_packages WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
