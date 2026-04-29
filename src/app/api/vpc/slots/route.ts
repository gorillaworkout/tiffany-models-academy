export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { d1Query } from "@/lib/d1";

// 60 participants per section
const LIMITS = {
  skill: 60,
  speed: 60,
  freestyle: 60,
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

function parseJSON(str: string) {
  try {
    const p = JSON.parse(str);
    return (Number(p.male) || 0) + (Number(p.female) || 0);
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    // Only count CONFIRMED registrations — slots decrease after admin approval
    const rows: any[] = await d1Query(
      "SELECT skill_7_8, speed_8_9, speed_10_12, speed_13_15, free_10_12, free_13_15, free_16_open FROM vpc_registrations WHERE status = 'confirmed'"
    );

    let skillUsed = 0;
    let speedUsed = 0;
    let freestyleUsed = 0;

    for (const r of rows) {
      skillUsed += parseJSON(r.skill_7_8);
      speedUsed += parseJSON(r.speed_8_9) + parseJSON(r.speed_10_12) + parseJSON(r.speed_13_15);
      freestyleUsed += parseJSON(r.free_10_12) + parseJSON(r.free_13_15) + parseJSON(r.free_16_open);
    }

    return NextResponse.json({
      success: true,
      slots: {
        skill:     { max: LIMITS.skill,     used: skillUsed,     remaining: Math.max(0, LIMITS.skill - skillUsed) },
        speed:     { max: LIMITS.speed,     used: speedUsed,     remaining: Math.max(0, LIMITS.speed - speedUsed) },
        freestyle: { max: LIMITS.freestyle, used: freestyleUsed, remaining: Math.max(0, LIMITS.freestyle - freestyleUsed) },
      }
    }, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
