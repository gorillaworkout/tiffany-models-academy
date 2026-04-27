"use client";

import { useState } from "react";
import { ArrowLeft, Send, Clock, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STUDIOS = [
  "Studio Jakarta Selatan",
  "Studio Bintaro",
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export default function ReminderPage() {
  const [jam, setJam] = useState("10:00");
  const [studio, setStudio] = useState(STUDIOS[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [sending, setSending] = useState(false);

  const previewMessage = useCustom
    ? customMessage
    : `📚 *Reminder Class TMA!*

Halo semuanya 👋
Jangan lupa hari ini ada kelas modeling:

🕐 *Jam:* ${jam} WIB
📍 *Studio:* ${studio}

Siapkan diri kalian dan datang tepat waktu ya!
See you there! ✨

— _Tiffanny Models Academy_`;

  const handleSend = async () => {
    if (useCustom && !customMessage.trim()) {
      toast.error("Custom message cannot be empty");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jam,
          studio,
          customMessage: useCustom ? customMessage : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("✅ Reminder sent to WhatsApp group!");
      } else {
        toast.error(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Class Reminder</h1>
            <p className="text-sm text-zinc-500">
              Send reminder to WhatsApp group
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-400" />
              Compose Reminder
            </h2>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustom(false)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  !useCustom
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                Template
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  useCustom
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                Custom
              </button>
            </div>

            {!useCustom ? (
              <>
                {/* Time */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Jam Kelas
                  </label>
                  <select
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="bg-zinc-900">
                        {t} WIB
                      </option>
                    ))}
                  </select>
                </div>

                {/* Studio */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Studio
                  </label>
                  <select
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    {STUDIOS.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              /* Custom Message */
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                  Custom Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your custom message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 px-6 rounded-lg transition-all text-sm uppercase tracking-wider"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send to WhatsApp Group"}
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold text-zinc-400">Preview</h2>
            <div className="bg-[#005c4b] rounded-xl p-4 text-white text-sm whitespace-pre-wrap leading-relaxed font-light">
              {previewMessage}
            </div>
            <p className="text-xs text-zinc-600">
              * Bold text (*text*) and italic (_text_) will render in WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
