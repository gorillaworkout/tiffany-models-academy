"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Lock, Camera, Scissors, GraduationCap, ClipboardList, BookText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ModulPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [modules, setModules] = useState<any[]>([]);

    useEffect(() => {
      const savedUser = localStorage.getItem("tma_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.batchId) {
          // Fetch jadwal and student's attendance in parallel
          Promise.all([
            fetch(`/api/jadwal?batchId=${parsed.batchId}`).then(r => r.json()),
            parsed.id ? fetch(`/api/attendance?memberId=${parsed.id}&batchId=${parsed.batchId}`).then(r => r.json()).catch(() => []) : Promise.resolve([])
          ]).then(([jadwalData, attendanceData]) => {
              if (Array.isArray(jadwalData)) {
                 // Build a set of jadwal IDs the student has attended
                 const attendedJadwalIds = new Set<string>();
                 if (Array.isArray(attendanceData)) {
                   attendanceData.forEach((a: any) => {
                     if (a.jadwal_id || a.jadwalId) attendedJadwalIds.add(a.jadwal_id || a.jadwalId);
                   });
                 }

                 let foundNext = false;
                 const mapped = jadwalData.map((d: any, i: number) => {
                   let status = "locked";
                   const attended = attendedJadwalIds.has(d.id);
                   
                   if (attended) {
                     status = "completed";
                   } else if (d.isConfigured && !foundNext) {
                     status = "active";
                     foundNext = true;
                   } else if (d.isConfigured) {
                     status = "active";
                   }

                   return {
                   id: `0${i+1}`.slice(-2),
                   title: d.title,
                   description: d.description || "No description available yet.",
                   category: "Theory & Practice",
                   status,
                   icon: BookText
                 }});
                 setModules(mapped);
              }
              setIsMounted(true);
            })
            .catch(() => setIsMounted(true));
        } else {
           setIsMounted(true);
        }
      } else {
        setIsMounted(true);
      }
    }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (!isMounted) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white font-serif italic tracking-widest animate-pulse">TMA</div></div>;

  const completedCount = modules?.filter((m: any) => m.status === 'completed').length || 0;
  const progressPercent = Math.round((completedCount / 16) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 lg:p-12 w-full selection:bg-white selection:text-black font-sans relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8 max-w-5xl mx-auto">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-blue-500"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">Academy Curriculum</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2">
            The 16-Part <span className="italic text-zinc-500">Syllabus</span>.
          </h1>
          <p className="text-zinc-400 text-sm font-light max-w-xl">
            A comprehensive breakdown of everything you will learn during your time at Tiffany Models Academy. Master the theoretical and practical skills required for the professional industry.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full lg:w-64 bg-zinc-950 border border-white/10 p-4 shrink-0">
          <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
            <span className="text-zinc-400">Course Progress</span>
            <span className="text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-zinc-800">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 text-right">
            {completedCount} of 16 Modules Learned
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <div className="bg-zinc-950 border border-white/5 rounded-none p-2 sm:p-6 md:p-8">
          {/* @ts-ignore */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {(modules || []).map((module: any) => (
              <AccordionItem 
                key={module.id} 
                value={module.id} 
                className={`border px-4 transition-colors duration-300 ${
                  module.status === 'active' ? 'border-white/30 bg-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 
                  'border-white/5 bg-black hover:border-white/20 hover:bg-zinc-900/50'
                }`}
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left w-full pr-4">
                    {/* Status Icon */}
                    <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full border ${
                      module.status === 'completed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      module.status === 'active' ? 'bg-white text-black border-white' :
                      'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                      {module.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                       module.status === 'locked' ? <Lock className="w-4 h-4" /> :
                       <BookOpen className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Part {module.id}</span>
                        {module.status === 'active' && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] uppercase tracking-widest font-bold border border-blue-500/20">Current Focus</span>
                        )}
                      </div>
                      <h3 className={`text-lg sm:text-xl font-serif ${module.status === 'locked' ? 'text-zinc-500' : 'text-white'}`}>
                        {module.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pb-8 pt-2 pl-[4.5rem]">
                  <div className="pr-4 sm:pr-8 border-l border-white/10 pl-6">
                    <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                      {module.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                        <module.icon className="w-4 h-4 text-zinc-400" />
                        {module.category}
                      </div>

                      {module.status === 'locked' ? (
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-600 bg-zinc-900 px-4 py-2 w-fit">
                          <Lock className="w-3 h-3" /> Upcoming Content
                        </span>
                      ) : module.status === 'completed' ? (
                        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white hover:text-blue-400 transition-colors w-fit border border-white/20 hover:border-blue-400/50 px-4 py-2">
                          View Module Guide
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-black bg-white hover:bg-zinc-200 transition-colors w-fit px-6 py-3">
                          <BookOpen className="w-4 h-4" /> Read Material
                        </button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>

    </div>
  );
}
