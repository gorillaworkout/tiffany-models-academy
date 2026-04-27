"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera as InstagramIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const categories = ["All", "Runway", "Editorial", "Behind the Scenes"];

const galleryImages = [
  {
    src: "/images/tma-magazine.jpg",
    alt: "Model TMA dalam pemotretan editorial majalah fashion Indonesia",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-sunglasses.jpg",
    alt: "Model Tiffanny Models Academy berpose dengan sunglasses untuk editorial fashion",
    category: "Editorial",
    span: "",
  },
  {
    src: "/images/tma-group.jpg",
    alt: "Sesi pelatihan grup model di studio Tiffanny Models Academy Jakarta",
    category: "Behind the Scenes",
    span: "",
  },
  {
    src: "/images/tma-rose.jpg",
    alt: "Model TMA portrait elegan dengan bunga mawar untuk runway fashion show",
    category: "Runway",
    span: "row-span-2",
  },
  {
    src: "/images/tma-balqis-magazine.jpg",
    alt: "Cover majalah TMA Magazine edisi Balqis Circle 4 - model profesional Indonesia",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-hijab-portrait.jpg",
    alt: "Portrait model hijab profesional dengan outfit hitam elegan - Tiffanny Models Academy",
    category: "Editorial",
    span: "",
  },
  {
    src: "/images/tma-silver-skirt.jpg",
    alt: "Model runway fashion dengan jaket kulit dan rok silver pleated - TMA fashion show",
    category: "Runway",
    span: "",
  },
  {
    src: "/images/tma-lailatusyifa-magazine.jpg",
    alt: "Cover majalah TMA Magazine edisi Lailatusyifa Circle 2 - editorial fashion Indonesia",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-hijab-fashion.jpg",
    alt: "Model hijab fashion editorial dengan outfit maroon dan vest abu-abu - TMA",
    category: "Editorial",
    span: "",
  },
  {
    src: "/images/tma-aleycia-award.jpg",
    alt: "Aleycia Benita 2nd Runner Up Teen Star Indonesia 2025 - prestasi alumni TMA",
    category: "Behind the Scenes",
    span: "",
  },
  {
    src: "/images/tma-sitting-poses.jpg",
    alt: "Pelatihan sitting poses dan teknik berpose duduk di studio Tiffanny Models Academy",
    category: "Behind the Scenes",
    span: "",
  },
  {
    src: "/images/tma-blazer-editorial.jpg",
    alt: "Editorial fashion model TMA dengan gaun putih dan blazer hitam elegan",
    category: "Editorial",
    span: "",
  },
  {
    src: "/images/tma-maudy-magazine.jpg",
    alt: "Cover majalah TMA Magazine edisi Maudy Selany Circle 4 - model profesional",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-fadia-alya.jpg",
    alt: "Fadia Alya — 25yo, 160cm, 47kg — Portfolio model profesional TMA",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-trinity-venus.jpg",
    alt: "Trinity Venus Sutrisno — 20yo, 165cm, 46kg — Portfolio model profesional TMA",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-maudy-sellany.jpg",
    alt: "Maudy Sellany — 22yo, 155cm, 44kg — Portfolio model profesional TMA",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-gabriella-ayu.jpg",
    alt: "Gabriella Ayu Bastari — 23yo, 170cm, 48kg — Portfolio model profesional TMA",
    category: "Editorial",
    span: "row-span-2",
  },
  {
    src: "/images/tma-balqis-izah.jpg",
    alt: "Balqis Izah — 25yo, 156cm, 46kg, Hijab — Portfolio model profesional TMA",
    category: "Editorial",
    span: "row-span-2",
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

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
            Our Work
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6">
            Portfolio
          </h1>
          <div className="w-16 h-[2px] bg-red-500 mx-auto mb-6" />
          <p className="text-sm text-zinc-400 font-light max-w-xl mx-auto">
            A glimpse into the world of Tiffanny Models Academy — from runway
            moments to editorial highlights.
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex items-center gap-1 border border-white/10 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div
                key={`${img.src}-${idx}-${activeCategory}`}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className={`relative overflow-hidden cursor-pointer group ${img.span}`}
                onClick={() => setLightboxImage(img.src)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs uppercase tracking-widest text-white/80">
                    {img.category}
                  </p>
                  <p className="text-sm font-light mt-1">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs uppercase tracking-widest text-red-500 mb-4">
            Follow Us
          </p>
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            See more on <span className="italic text-zinc-500">social.</span>
          </h2>
          <p className="text-sm text-zinc-400 font-light mb-10 max-w-xl mx-auto">
            Follow our journey on social media for behind-the-scenes content,
            training highlights, and model portfolios.
          </p>
          <a
            href="https://www.instagram.com/tiffannymodelsacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white hover:bg-white/10 text-xs uppercase tracking-widest font-bold transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
            Follow us on Instagram
          </a>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Portfolio galeri model Tiffanny Models Academy"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
