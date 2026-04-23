export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return NextResponse.json({ error: "Missing packageId parameter" }, { status: 400 });
    }

    const rows = await d1Query(
      `SELECT id, package_id as packageId, session, title, description, created_at as createdAt
       FROM ebook_modules
       WHERE package_id = ?
       ORDER BY session ASC`,
      [packageId]
    );

    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { packageId, modules } = data;

    if (!packageId || !modules || !Array.isArray(modules)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Delete existing modules for this package and re-insert
    await d1Query('DELETE FROM ebook_modules WHERE package_id = ?', [packageId]);

    for (const mod of modules) {
      const id = `${packageId}-s${mod.session}`;
      await d1Query(
        `INSERT INTO ebook_modules (id, package_id, session, title, description)
         VALUES (?, ?, ?, ?, ?)`,
        [id, packageId, mod.session, mod.title || "TBA", mod.description || ""]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
