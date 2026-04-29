export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { d1Query } from "@/lib/d1";

const LIMITS = { skill: 60, speed: 60, freestyle: 60 };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    const required = ["clubName", "firstName", "lastName", "phone", "email"];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim() === "") {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    // Parse submitted category counts
    const categoryKeys = [
      "skill_7_8",
      "speed_8_9", "speed_10_12", "speed_13_15",
      "free_10_12", "free_13_15", "free_16_open",
    ];

    let totalParticipants = 0;
    const categoryValues: Record<string, string> = {};
    const parsed: Record<string, { male: number; female: number }> = {};

    for (const key of categoryKeys) {
      const val = data[key] || { male: 0, female: 0 };
      const male = Number(val.male) || 0;
      const female = Number(val.female) || 0;
      totalParticipants += male + female;
      parsed[key] = { male, female };
      categoryValues[key] = JSON.stringify({ male, female });
    }

    // Calculate new registration's section totals
    const newSkill = (parsed.skill_7_8.male + parsed.skill_7_8.female);
    const newSpeed = (parsed.speed_8_9.male + parsed.speed_8_9.female)
      + (parsed.speed_10_12.male + parsed.speed_10_12.female)
      + (parsed.speed_13_15.male + parsed.speed_13_15.female);
    const newFreestyle = (parsed.free_10_12.male + parsed.free_10_12.female)
      + (parsed.free_13_15.male + parsed.free_13_15.female)
      + (parsed.free_16_open.male + parsed.free_16_open.female);

    // Check existing CONFIRMED slots only — pending don't count toward limit
    const rows: any[] = await d1Query(
      "SELECT skill_7_8, speed_8_9, speed_10_12, speed_13_15, free_10_12, free_13_15, free_16_open FROM vpc_registrations WHERE status = 'confirmed'"
    );

    let usedSkill = 0, usedSpeed = 0, usedFreestyle = 0;
    for (const r of rows) {
      usedSkill += parseJSON(r.skill_7_8);
      usedSpeed += parseJSON(r.speed_8_9) + parseJSON(r.speed_10_12) + parseJSON(r.speed_13_15);
      usedFreestyle += parseJSON(r.free_10_12) + parseJSON(r.free_13_15) + parseJSON(r.free_16_open);
    }

    // Validate limits
    const errors: string[] = [];
    if (newSkill > 0 && usedSkill + newSkill > LIMITS.skill) {
      errors.push(`Skill Challenges: only ${Math.max(0, LIMITS.skill - usedSkill)} slots remaining`);
    }
    if (newSpeed > 0 && usedSpeed + newSpeed > LIMITS.speed) {
      errors.push(`Speedrun: only ${Math.max(0, LIMITS.speed - usedSpeed)} slots remaining`);
    }
    if (newFreestyle > 0 && usedFreestyle + newFreestyle > LIMITS.freestyle) {
      errors.push(`Freestyle: only ${Math.max(0, LIMITS.freestyle - usedFreestyle)} slots remaining`);
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: `Registration exceeds available slots:\n${errors.join("\n")}` },
        { status: 400, headers: corsHeaders() }
      );
    }

    await d1Query(
      `INSERT INTO vpc_registrations 
        (club_name, first_name, last_name, phone, email, 
         skill_7_8, speed_8_9, speed_10_12, speed_13_15,
         free_10_12, free_13_15, free_16_open,
         total_participants, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        data.clubName.trim(),
        data.firstName.trim(),
        data.lastName.trim(),
        data.phone.trim(),
        data.email.trim(),
        categoryValues["skill_7_8"],
        categoryValues["speed_8_9"],
        categoryValues["speed_10_12"],
        categoryValues["speed_13_15"],
        categoryValues["free_10_12"],
        categoryValues["free_13_15"],
        categoryValues["free_16_open"],
        totalParticipants,
        data.notes?.trim() || null,
      ]
    );

    return NextResponse.json(
      { success: true, message: "Registration submitted successfully" },
      { headers: corsHeaders() }
    );
  } catch (e: any) {
    console.error("VPC register error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
