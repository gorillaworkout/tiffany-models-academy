"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Sparkles, Shield, Palette, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const values = [
  {
    icon: Sparkles,
    title: "Confidence",
    description:
      "We build unshakeable confidence that radiates both on and off the runway. Every student learns to own their presence.",
  },
  {
    icon: Shield,
    title: "Discipline",
    description:
      "The fashion industry demands discipline. We instill professionalism, punctuality, and dedication in every aspect of training.",
  },
  {
    icon: Palette,
    title: "Creativity",
    description:
      "Beyond technique, we nurture artistic expression. Each model develops their unique style and creative voice.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We settle for nothing less than excellence. Our curriculum, coaches, and standards reflect the highest quality.",
  },
];

const team = [
  {
    name: "Nadira Tiffanny",
    role: "Founder & Lead Coach",
    initials: "NT",
  },
  {
    name: "Coach Sarah",
    role: "Runway & Posing Instructor",
    initials: "CS",
  },
  {
    name: "Coach Maya",
    role: "Editorial & Branding Coach",
    initials: "CM",
  },
];

const STAT_LABELS = [
  { key: "totalMembers", label: "Active Models", suffix: "+" },
  { key: "activeBatches", label: "Active Batches", suffix: "" },
  { key: "cities", label: "Cities", suffix: "" },
  { key: "totalModules", label: "Training Modules", suffix: "+" },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  const [siteStats, setSiteStats] = useState<any>({});

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(data => {
      if (data && !data.error) setSiteStats(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/tma-group.jpg"
            alt="Grup model Tiffanny Models Academy - akademi model profesional terbaik di Jakarta dan Bandung"
            fill
            className="object-cover grayscale opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center px-6"
        >
          <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
            Our Story
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6">
            About Us
          </h1>
          <div className="w-16 h-[2px] bg-red-500 mx-auto" />
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              The Beginning
            </p>
            <h2 className="text-3xl md:text-5xl font-serif mb-8">
              A vision for <span className="italic text-zinc-500">empowerment.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
              <p>
                Tiffanny Models Academy is a professional modeling school dedicated to developing confidence, elegance, and personal growth in every student. More than teaching catwalk and posing techniques, Tiffanny Models Academy provides a supportive learning environment where aspiring models can build communication skills, professionalism, self-confidence, and strong character. Tiffanny Models Academy is committed to shaping empowered individuals who are prepared to grow with grace, purpose, and excellence.
              </p>
              <p>
                What started as a passion for fashion and empowerment has grown
                into one of Indonesia&apos;s most respected modeling academies, with
                studios in Jakarta Selatan and Bintaro serving hundreds of aspiring
                models.
              </p>
              <p>
                Our approach goes beyond traditional modeling training. We believe
                in nurturing the whole person — building character, discipline, and
                a professional mindset that serves our students throughout their
                careers and lives.
              </p>
            </div>
            {/* Secondary image */}
            <div className="relative mt-10 overflow-hidden border border-white/10">
              <Image
                src="/images/tma-rose.jpg"
                alt="Nadira Tiffanny - Founder Tiffanny Models Academy, portrait elegan dengan bunga mawar"
                width={600}
                height={700}
                className="w-full h-[500px] object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <div className="border border-white/10 p-8 bg-black/50">
              <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
                Our Mission
              </p>
              <p className="font-serif italic text-xl leading-relaxed text-zinc-300">
                &quot;To empower aspiring models with professional training, unwavering
                confidence, and real industry connections — creating not just
                models, but role models.&quot;
              </p>
            </div>
            <div className="border border-white/10 p-8 bg-black/50">
              <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
                Our Vision
              </p>
              <p className="font-serif italic text-xl leading-relaxed text-zinc-300">
                &quot;To be Indonesia&apos;s premier modeling academy, recognized for
                producing confident, professional, and industry-ready talent that
                redefines beauty standards.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 md:px-12 bg-black border-t border-white/5 relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/tma-hijab-fashion.jpg"
            alt=""
            fill
            className="object-cover grayscale opacity-[0.04]"
            sizes="100vw"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Our Values
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              What we stand <span className="italic text-zinc-500">for.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((val) => (
              <motion.div
                key={val.title}
                variants={fadeInUp}
                className="group text-center p-8 border border-white/5 hover:border-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 mx-auto mb-6 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors duration-500">
                  <val.icon className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-lg mb-3">{val.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
              Our Team
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              The people behind <span className="italic text-zinc-500">TMA.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-red-500/30 transition-colors duration-500">
                  <span className="font-serif text-3xl text-zinc-600 group-hover:text-zinc-400 transition-colors duration-500">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-serif text-lg mb-1">{member.name}</h3>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Academy Stats */}
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
              By the Numbers
            </p>
            <h2 className="text-3xl md:text-5xl font-serif">
              Our impact in <span className="italic text-zinc-500">numbers.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STAT_LABELS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center p-8 border border-white/5"
              >
                <p className="text-4xl md:text-5xl font-serif mb-3">
                  <AnimatedCounter value={siteStats[stat.key] || 0} suffix={stat.suffix} />
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
