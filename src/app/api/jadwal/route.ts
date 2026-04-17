export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: "Missing batchId parameter" }, { status: 400 });
    }

    const rows = await d1Query(
      'SELECT id, batch_id as batchId, session, title, date, time, studio, trainer, outfit, props, is_configured as isConfigured FROM jadwal WHERE batch_id = ? ORDER BY session ASC', 
      [batchId]
    );

    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { slots, batchId } = data; // Array of 16 slots

    if (!batchId || !slots || !Array.isArray(slots)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Since we're saving all 16 slots at once for a batch, we can just delete old and insert new
    await d1Query('DELETE FROM jadwal WHERE batch_id = ?', [batchId]);

    // Sequential inserts are fine for this small amount (16 rows)
    for (const slot of slots) {
      const id = `${batchId}-s${slot.session}`;
      await d1Query(`
        INSERT INTO jadwal (id, batch_id, session, title, date, time, studio, trainer, outfit, props, is_configured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, 
        batchId, 
        slot.session, 
        slot.title || "TBA", 
        slot.date || "", 
        slot.time || "", 
        slot.studio || "", 
        slot.trainer || "", 
        slot.outfit || "", 
        slot.props || "", 
        slot.isConfigured ? 1 : 0
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
