"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Target, Crown, CameraIcon, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const features = [
  {
    icon: Target,
    title: "Professional Curriculum",
    description:
      "16+ carefully designed modules covering everything from posture to runway technique.",
  },
  {
    icon: Crown,
    title: "Expert Coaches",
    description:
      "Learn from industry professionals with years of experience in fashion and modeling.",
  },
  {
    icon: CameraIcon,
    title: "Real Opportunities",
    description:
      "Portfolio building, professional photoshoots, and real industry connections.",
  },
];

const plans = [
  {
    title: "E-Book Access",
    price: "Start Learning",
    description: "Get the complete modeling curriculum e-book for self-paced learning.",
    features: ["Full curriculum e-book", "Self-paced learning", "Digital materials"],
  },
  {
    title: "Group Class",
    price: "Most Popular",
    description: "Join our 16-session modeling program with live studio training.",
    features: [
      "16 live sessions",
      "Studio training",
      "Attendance tracking",
      "Coach guidance",
    ],
    highlighted: true,
  },
  {
    title: "Private Class",
    price: "Premium",
    description: "One-on-one coaching tailored to your goals and schedule.",
    features: [
      "Personal coaching",
      "Flexible schedule",
      "Custom curriculum",
      "Priority support",
    ],
  },
];

const testimonials = [
  {
    quote:
      "TMA completely transformed my confidence. I walked into the academy shy and unsure, and walked out ready for the runway.",
    name: "Aisyah Rahma",
    title: "Batch 3 Graduate",
  },
  {
    quote:
      "The coaches are incredible. They don't just teach you poses — they teach you how to carry yourself with grace and purpose.",
    name: "Dina Maharani",
    title: "Batch 5 Graduate",
  },
  {
    quote:
      "After completing the program, I booked my first editorial shoot within two weeks. TMA gave me the tools I needed.",
    name: "Putri Azzahra",
    title: "Batch 4 Graduate",
  },
];

export default function HomePage() {
  const [siteStats, setSiteStats] = useState({ totalStudios: 0, totalModules: 0, totalMembers: 0, activeBatches: 0 });

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(data => {
      if (data && !data.error) setSiteStats(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 h-full w-full z-0 opacity-40">
          <div className="relative h-full overflow-hidden border-r border-white/5">
            <Image
              src="/images/tma-magazine.jpg"
              alt="TMA Model"
              fill
              className="object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
          <div className="relative h-full overflow-hidden border-r border-white/5">
            <Image
              src="/images/tma-sunglasses.jpg"
              alt="TMA Model"
              fill
              className="object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
          <div className="relative h-full overflow-hidden border-r border-white/5 hidden lg:block">
            <Image
              src="/images/tma-group.jpg"
              alt="TMA Group"
              fill
              className="object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="relative h-full overflow-hidden hidden lg:block">
            <Image
              src="/images/tma-rose.jpg"
              alt="TMA Model"
              fill
              className="object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <h2 className="text-xs md:text-sm uppercase tracking-[0.4em] text-zinc-400 font-bold">
              Tiffanny Models Academy
            </h2>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-8 leading-tight">
            Elevate your <br />
            <span className="italic text-zinc-500">presence.</span>
          </h1>
          <div className="w-16 h-[1px] bg-red-500/60 mx-auto mb-8" />
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light mb-12 max-w-2xl mx-auto">
            The premier modeling academy in Indonesia. Master the runway, perfect
            your editorial poses, and build a professional portfolio that demands
            attention.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group transition-all"
            >
              Apply for Next Batch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://www.instagram.com/tiffannymodelsacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4" /> Follow Our Journey
            </a>
          </div>
        </motion.div>
      </section>

      {/* Why TMA Section */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              Built for <span className="italic text-zinc-500">excellence.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors duration-500">
                  <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute -inset-4 border border-white/10" />
            <Image
              src="/images/tma-magazine.jpg"
              alt="Magazine Cover"
              width={600}
              height={800}
              className="w-full h-[600px] object-cover grayscale"
            />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-md border border-white/10">
              <p className="font-serif italic text-xl">
                &quot;Hijab doesn&apos;t cover beauty, it redefines what beauty is.&quot;
              </p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-4">
                — Founder: Nadira Tiffanny
              </p>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="w-12 h-[2px] bg-red-500 mb-8" />
            <h2 className="text-3xl md:text-5xl font-serif mb-8">
              More than just <span className="italic text-zinc-500">walking.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
              <p>
                Tiffanny Models Academy (TMA) is not just about teaching you how
                to walk. It&apos;s about building confidence, character, and the
                professional mindset required in the modern fashion industry.
              </p>
              <p>
                Our curriculum covers everything from basic catwalk mechanics and
                photo posing to personal branding and runway makeup.
              </p>
              <p>
                We believe every aspiring model deserves the right foundation to
                shine, whether on the runway, in editorial magazines, or in
                commercial campaigns.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/10">
              <div>
                <p className="text-4xl font-serif mb-2">{siteStats.totalStudios || 0}</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Active Branches
                </p>
              </div>
              <div>
                <p className="text-4xl font-serif mb-2">{siteStats.totalModules || 0}+</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Training Modules
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs / Plans Section */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Programs
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              Choose your <span className="italic text-zinc-500">path.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.title}
                variants={fadeInUp}
                className={`group border p-8 transition-all duration-500 hover:border-red-500/50 ${
                  plan.highlighted
                    ? "border-white/20 bg-zinc-950"
                    : "border-white/10 bg-black"
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest text-red-500 mb-2">
                  {plan.price}
                </p>
                <h3 className="font-serif text-2xl mb-4">{plan.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-400 font-light"
                    >
                      <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 text-xs uppercase tracking-widest font-bold transition-all ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              What our graduates <span className="italic text-zinc-500">say.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                className="border border-white/10 p-8 bg-black/50"
              >
                <Quote className="w-8 h-8 text-red-500/40 mb-6" />
                <p className="font-serif italic text-lg leading-relaxed text-zinc-300 mb-8">
                  &quot;{t.quote}&quot;
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    {t.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-[1px] bg-red-500/60 mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Ready to start your <span className="italic text-zinc-500">journey?</span>
          </h2>
          <p className="text-sm text-zinc-400 font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Join hundreds of aspiring models who have transformed their careers
            through Tiffanny Models Academy.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold group transition-all"
          >
            Join Academy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
