export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { d1Query } from "@/lib/d1";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const rows = await d1Query(
      "SELECT * FROM vpc_registrations ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows }, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !["pending", "confirmed", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid id or status" },
        { status: 400, headers: corsHeaders() }
      );
    }

    await d1Query("UPDATE vpc_registrations SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    await d1Query("DELETE FROM vpc_registrations WHERE id = ?", [id]);
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
