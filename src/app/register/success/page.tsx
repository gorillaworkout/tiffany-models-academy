"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg w-full text-center relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
          <Sparkles className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          <span className="font-serif italic tracking-widest text-2xl text-zinc-500 group-hover:text-white transition-colors">
            TMA
          </span>
        </Link>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-8"
        >
          <div className="w-24 h-24 mx-auto border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-serif mb-4">
            Pendaftaran Berhasil
          </h1>
          <div className="w-12 h-[2px] bg-emerald-500 mx-auto mb-6" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 mb-10"
        >
          <p className="text-zinc-400 leading-relaxed">
            Terima kasih telah mendaftar di{" "}
            <span className="text-white font-medium">Tiffanny Models Academy</span>.
            Aplikasi kamu sudah kami terima dan sedang dalam proses verifikasi.
          </p>

          <div className="flex items-center gap-3 justify-center text-sm text-zinc-500 bg-white/[0.03] border border-white/5 py-4 px-6">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-left">
              Admin kami akan meninjau pendaftaran kamu.
              Kamu akan bisa login setelah akun disetujui.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 h-12 rounded-none border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs uppercase tracking-widest"
            >
              Kembali ke Home
            </Button>
          </Link>
          <Link href="/login">
            <Button className="w-full sm:w-auto px-8 h-12 rounded-none bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold group">
              Halaman Login
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs text-zinc-600 mt-12"
        >
          Ada pertanyaan? Hubungi kami via{" "}
          <a
            href="https://wa.me/6285133524900"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white underline underline-offset-4"
          >
            WhatsApp
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
