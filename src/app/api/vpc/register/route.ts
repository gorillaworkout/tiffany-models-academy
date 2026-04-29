export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { d1Query } from "@/lib/d1";

// CORS helper for cross-origin requests from Vata Parkour site
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

    // Calculate total participants
    const categoryKeys = [
      "skill_7_8",
      "speed_8_9",
      "speed_10_12",
      "speed_13_15",
      "free_10_12",
      "free_13_15",
      "free_16_open",
    ];

    let totalParticipants = 0;
    const categoryValues: Record<string, string> = {};

    for (const key of categoryKeys) {
      const val = data[key] || { male: 0, female: 0 };
      const male = Number(val.male) || 0;
      const female = Number(val.female) || 0;
      totalParticipants += male + female;
      categoryValues[key] = JSON.stringify({ male, female });
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
