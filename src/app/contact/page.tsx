"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Mail, Camera, Send } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    lines: ["Jakarta & Bandung", "Indonesia"],
    href: null,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: ["+62 851-3352-4900"],
    href: "https://wa.me/6285133524900",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["tiffannymodelsacademy@gmail.com"],
    href: "mailto:tiffannymodelsacademy@gmail.com",
  },
  {
    icon: Camera,
    title: "Instagram",
    lines: ["@tiffannymodelsacademy"],
    href: "https://www.instagram.com/tiffannymodelsacademy/",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    await new Promise((res) => setTimeout(res, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-6xl mx-auto text-center"
        >
          <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
            Contact
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6">
            Get in Touch
          </h1>
          <div className="w-16 h-[2px] bg-red-500 mx-auto mb-6" />
          <p className="text-sm text-zinc-400 font-light max-w-xl mx-auto">
            Have questions about our programs? Ready to start your modeling
            journey? We&apos;d love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactInfo.map((info) => {
            const Wrapper = info.href ? "a" : "div";
            const wrapperProps = info.href
              ? {
                  href: info.href,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : {};
            return (
              <motion.div key={info.title} variants={fadeInUp}>
                <Wrapper
                  {...wrapperProps}
                  className="block border border-white/10 p-8 text-center hover:border-red-500/30 transition-all duration-500 group h-full"
                >
                  <div className="w-12 h-12 mx-auto mb-4 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors duration-500">
                    <info.icon className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
                    {info.title}
                  </h3>
                  {info.lines.map((line) => (
                    <p
                      key={line}
                      className="text-sm text-zinc-300 font-light break-all"
                    >
                      {line}
                    </p>
                  ))}
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Send a Message
            </p>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              Let&apos;s <span className="italic text-zinc-500">talk.</span>
            </h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
              Whether you&apos;re interested in joining the academy, looking for
              collaboration opportunities, or simply want to learn more about what
              we do — fill out the form and we&apos;ll get back to you within 24
              hours.
            </p>
            <div className="w-12 h-[2px] bg-red-500/40" />
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm font-light text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm font-light text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm font-light text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none transition-colors"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm font-light text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none transition-colors resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-4 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div
            variants={fadeInUp}
            className="border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <h3 className="text-xs uppercase tracking-widest text-zinc-500">
                Jakarta Studio
              </h3>
            </div>
            <p className="font-serif text-xl mb-3">Jakarta Branch</p>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Our Jakarta studio serves as the main training hub, equipped with
              professional runway space, lighting setups, and photography
              studios.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <h3 className="text-xs uppercase tracking-widest text-zinc-500">
                Bandung Studio
              </h3>
            </div>
            <p className="font-serif text-xl mb-3">Bandung Branch</p>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Our Bandung location brings TMA&apos;s world-class training to West
              Java, offering the same professional curriculum and coaching
              quality.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
