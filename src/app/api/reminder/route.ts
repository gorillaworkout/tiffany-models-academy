import { NextRequest, NextResponse } from "next/server";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || "ZxyYUq6dXc5GP2zABegG";
const GROUP_ID = process.env.FONNTE_GROUP_ID || "120363407748334471@g.us";

export async function POST(req: NextRequest) {
  try {
    const { jam, studio, customMessage } = await req.json();

    if (!jam || !studio) {
      return NextResponse.json({ error: "jam and studio are required" }, { status: 400 });
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

    const formData = new FormData();
    formData.append("target", GROUP_ID);
    formData.append("message", message);

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.status === false) {
      return NextResponse.json({ error: result.reason || "Fonnte error", detail: result }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Reminder sent!", detail: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
