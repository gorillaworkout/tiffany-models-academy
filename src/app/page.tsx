import Link from 'next/link';
import { ArrowRight, ChevronRight, Camera } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <div className="flex flex-col">
          <span className="font-serif italic tracking-widest text-2xl">TMA</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/tiffannymodelsacademy/" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
          </a>
          <Link href="/login" className="text-xs uppercase tracking-widest font-bold hover:text-zinc-400 transition-colors hidden md:block">
            Member Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold rounded-none transition-all">
            Join Academy
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 h-full w-full z-0 opacity-40">
          <div className="relative h-full overflow-hidden border-r border-white/5">
            <img src="/images/tma-magazine.jpg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700" alt="TMA Model" />
          </div>
          <div className="relative h-full overflow-hidden border-r border-white/5">
            <img src="/images/tma-sunglasses.jpg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700" alt="TMA Model" />
          </div>
          <div className="relative h-full overflow-hidden border-r border-white/5 hidden lg:block">
            <img src="/images/tma-group.jpg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700" alt="TMA Group" />
          </div>
          <div className="relative h-full overflow-hidden hidden lg:block">
            <img src="/images/tma-rose.jpg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700" alt="TMA Model" />
          </div>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h2 className="text-xs md:text-sm uppercase tracking-[0.4em] text-zinc-400 mb-6 font-bold">Tiffanny Models Academy</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-8 leading-tight">
            Elevate your <br />
            <span className="italic text-zinc-500">presence.</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light mb-12 max-w-2xl mx-auto">
            The premier modeling academy in Indonesia. Master the runway, perfect your editorial poses, and build a professional portfolio that demands attention. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group transition-all">
              Apply for Next Batch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://www.instagram.com/tiffannymodelsacademy/" target="_blank" className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <Camera className="w-4 h-4" /> Follow Our Journey
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-white/10" />
            <img src="/images/tma-magazine.jpg" className="w-full h-[600px] object-cover grayscale" alt="Magazine Cover" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-md border border-white/10">
              <p className="font-serif italic text-xl">"Hijab doesn't cover beauty, it redefines what beauty is."</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-4">— Founder: Nadira Tiffanny</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8">More than just <span className="italic text-zinc-500">walking.</span></h2>
            <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
              <p>Tiffanny Models Academy (TMA) is not just about teaching you how to walk. It's about building confidence, character, and the professional mindset required in the modern fashion industry.</p>
              <p>Our curriculum covers everything from basic catwalk mechanics and photo posing to personal branding and runway makeup.</p>
              <p>We believe every aspiring model deserves the right foundation to shine, whether on the runway, in editorial magazines, or in commercial campaigns.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/10">
              <div>
                <p className="text-4xl font-serif mb-2">2</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Active Branches<br/>(Jakarta & Bandung)</p>
              </div>
              <div>
                <p className="text-4xl font-serif mb-2">16+</p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Intensive<br/>Training Modules</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">
          © {new Date().getFullYear()} Tiffanny Models Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
