export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function GET() {
  try {
    // Total approved members (graduates / active models)
    const totalMembers = await d1Query(
      `SELECT COUNT(*) as count FROM member WHERE status = 'approved' AND role != 'admin'`
    );

    // Active batches (status = 'Active' or 'Registration')
    const activeBatches = await d1Query(
      `SELECT COUNT(*) as count FROM batch WHERE status IN ('Active', 'Registration')`
    );

    // Total branches/studios
    const totalStudios = await d1Query(
      `SELECT COUNT(*) as count FROM studio`
    );

    // Unique cities from studio names (approximate — count distinct studios)
    const studios = await d1Query(
      `SELECT name FROM studio`
    );

    // Total configured training modules (unique titles across all batches)
    const totalModules = await d1Query(
      `SELECT COUNT(DISTINCT title) as count FROM jadwal WHERE is_configured = 1`
    );

    // Total ebook packages
    const totalEbookPackages = await d1Query(
      `SELECT COUNT(*) as count FROM ebook_packages WHERE status = 'active'`
    );

    // Total coaches
    const totalCoaches = await d1Query(
      `SELECT COUNT(*) as count FROM coach`
    );

    return NextResponse.json({
      totalMembers: totalMembers[0]?.count || 0,
      activeBatches: activeBatches[0]?.count || 0,
      totalStudios: totalStudios[0]?.count || 0,
      cities: Array.isArray(studios) ? studios.length : 0,  // each studio is a unique location
      totalModules: totalModules[0]?.count || 0,
      totalEbookPackages: totalEbookPackages[0]?.count || 0,
      totalCoaches: totalCoaches[0]?.count || 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
