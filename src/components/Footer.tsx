"use client";

import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* About TMA */}
          <div>
            <h3 className="font-serif italic text-2xl mb-4">TMA</h3>
            <div className="w-8 h-[2px] bg-red-500 mb-6" />
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Tiffanny Models Academy is Indonesia&apos;s premier modeling
              academy, empowering aspiring models with professional training,
              confidence building, and real industry connections.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">
              Connect
            </h4>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/tiffannymodelsacademy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors font-light"
              >
                <Camera className="w-4 h-4 text-red-500" />
                @tiffannymodelsacademy
              </a>
              <a
                href="https://wa.me/6285133524900"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors font-light"
              >
                <MessageCircle className="w-4 h-4 text-red-500" />
                +62 851-3352-4900
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            © {new Date().getFullYear()} Tiffanny Models Academy. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Member Login
            </Link>
            <Link
              href="/register"
              className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Join Academy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
