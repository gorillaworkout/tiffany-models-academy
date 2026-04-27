import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { waGroups } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET all groups
export async function GET() {
  try {
    const db = getDb();
    const groups = await db.select().from(waGroups).all();
    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST create group
export async function POST(req: NextRequest) {
  try {
    const { name, groupId } = await req.json();

    if (!name?.trim() || !groupId?.trim()) {
      return NextResponse.json(
        { error: "name and groupId are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `grp-${Date.now()}`;

    await db.insert(waGroups).values({
      id,
      name: name.trim(),
      groupId: groupId.trim(),
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create group" },
      { status: 500 }
    );
  }
}

// DELETE group
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb();
    await db.delete(waGroups).where(eq(waGroups.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete group" },
      { status: 500 }
    );
  }
}
