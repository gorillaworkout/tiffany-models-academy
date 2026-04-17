export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');
    const today = searchParams.get('today');

    const upcoming = searchParams.get('upcoming');

    // Return next 5 upcoming configured sessions across ALL batches (date > today)
    if (upcoming === 'true') {
      const todayStr = new Date().toISOString().split('T')[0];
      const rows = await d1Query(
        `SELECT j.id, j.batch_id as batchId, j.session, j.title, j.description, j.date, j.time, j.start_time as startTime, j.end_time as endTime, j.studio, j.trainer, j.outfit, j.props, j.is_configured as isConfigured,
                b.name as batchName, b.studio_id as batchLocation
         FROM jadwal j
         LEFT JOIN batch b ON j.batch_id = b.id
         WHERE j.date > ? AND j.is_configured = 1
         ORDER BY j.date ASC, j.start_time ASC
         LIMIT 5`,
        [todayStr]
      );
      return NextResponse.json(rows);
    }

    // Return today's configured sessions across ALL batches
    if (today === 'true') {
      const todayStr = new Date().toISOString().split('T')[0];
      const rows = await d1Query(
        `SELECT j.id, j.batch_id as batchId, j.session, j.title, j.description, j.date, j.time, j.start_time as startTime, j.end_time as endTime, j.studio, j.trainer, j.outfit, j.props, j.is_configured as isConfigured,
                b.name as batchName,
                s.lat as studioLat, s.lon as studioLon
         FROM jadwal j
         LEFT JOIN batch b ON j.batch_id = b.id
         LEFT JOIN studio s ON j.studio = s.id
         WHERE j.date = ? AND j.is_configured = 1
         ORDER BY j.start_time ASC, j.time ASC`,
        [todayStr]
      );
      return NextResponse.json(rows);
    }

    if (!batchId) {
      return NextResponse.json({ error: "Missing batchId parameter" }, { status: 400 });
    }

    const rows = await d1Query(
      `SELECT j.id, j.batch_id as batchId, j.session, j.title, j.description, j.date, j.time, j.start_time as startTime, j.end_time as endTime, j.studio, j.trainer, j.outfit, j.props, j.is_configured as isConfigured,
              s.lat as studioLat, s.lon as studioLon
       FROM jadwal j
       LEFT JOIN studio s ON j.studio = s.id
       WHERE j.batch_id = ? ORDER BY j.session ASC`, 
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
      const startTime = slot.startTime || "";
      const endTime = slot.endTime || "";
      const time = startTime && endTime ? `${startTime} - ${endTime}` : (slot.time || "");
      await d1Query(`
        INSERT INTO jadwal (id, batch_id, session, title, description, date, time, start_time, end_time, studio, trainer, outfit, props, is_configured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, 
        batchId, 
        slot.session, 
        slot.title || "TBA", 
        slot.description || "", 
        slot.date || "", 
        time, 
        startTime, 
        endTime, 
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
