import { NextRequest, NextResponse } from "next/server";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || "ZxyYUq6dXc5GP2zABegG";

export async function POST(req: NextRequest) {
  try {
    const { jam, studio, customMessage, targets } = await req.json();

    // targets is an array of WA group IDs
    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json(
        { error: "At least one target group is required" },
        { status: 400 }
      );
    }

    if (!customMessage && (!jam || !studio)) {
      return NextResponse.json(
        { error: "jam and studio are required for template mode" },
        { status: 400 }
      );
    }

    const message =
      customMessage ||
      `📚 *Reminder Class TMA!*

Halo semuanya 👋
Jangan lupa hari ini ada kelas modeling:

🕐 *Jam:* ${jam} WIB
📍 *Studio:* ${studio}

Siapkan diri kalian dan datang tepat waktu ya!
See you there! ✨

— _Tiffanny Models Academy_`;

    // Send to all selected groups
    const results = [];
    for (const target of targets) {
      const formData = new FormData();
      formData.append("target", target);
      formData.append("message", message);

      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: FONNTE_TOKEN,
        },
        body: formData,
      });

      const result = await response.json();
      results.push({ target, ...result });
    }

    const allSuccess = results.every((r) => r.status !== false);

    if (!allSuccess) {
      const failed = results.filter((r) => r.status === false);
      return NextResponse.json(
        {
          error: `Failed to send to ${failed.length} group(s)`,
          detail: results,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Reminder sent to ${targets.length} group(s)!`,
      detail: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
