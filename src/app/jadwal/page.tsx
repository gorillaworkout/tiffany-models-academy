"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, ArrowLeft, CheckCircle2, X, Shirt, Briefcase, Info, Map } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function JadwalPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Model");
  const [userBatch, setUserBatch] = useState("Loading...");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [processedSyllabus, setProcessedSyllabus] = useState<any[]>([]);
  const [batchId, setBatchId] = useState<string>("");

  useEffect(() => {
    const savedUser = localStorage.getItem("tma_user");
    let parsed: any = null;
    if (savedUser) {
      parsed = JSON.parse(savedUser);
      setUserName(parsed.fullName.split(' ')[0]);
      if (parsed.batchId) {
        setBatchId(parsed.batchId);
        // Fetch batch name
        fetch('/api/batches')
          .then(r => r.json())
          .then(batchData => {
            if (Array.isArray(batchData)) {
              const myBatch = batchData.find(b => b.id == parsed.batchId);
              if (myBatch) {
                setUserBatch(`${myBatch.name} • ${myBatch.branch || ''}`);
              }
            }
          });
      }
    }
    
    // Fetch schedule from API
    if (parsed && parsed.batchId) {
      fetch(`/api/jadwal?batchId=${parsed.batchId}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const nowHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            let nextAssigned = false;
            
            const calculated = data.map(session => {
              const startTime = session.startTime || (session.time || "00:00 - 00:00").split(" - ")[0] || "00:00";
              const endTime = session.endTime || (session.time || "00:00 - 23:59").split(" - ")[1] || "23:59";
              const sessionDateStr = session.date || "2099-12-31";
              const timeDisplay = session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : session.time || "TBD";
              
              let status = "upcoming";
              if (session.date && session.date !== "") {
                if (sessionDateStr < todayStr) {
                  status = "completed";
                } else if (sessionDateStr === todayStr && nowHHmm >= endTime) {
                  status = "completed";
                } else {
                  if (!nextAssigned) {
                    status = "next"; 
                    nextAssigned = true;
                  }
                }
              }
              
              const displayDate = session.date ? new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }) : "TBA";
              
              return { 
                ...session, 
                rawDate: session.date,
                status: !session.isConfigured ? "upcoming" : status, 
                displayDate,
                timeDisplay,
              };
            });
            setProcessedSyllabus(calculated);
          }
          setIsMounted(true);
        })
        .catch(e => {
          console.error(e);
          setIsMounted(true);
        });
    } else {
       setIsMounted(true);
    }
    
    if (selectedSession) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedSession]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as any, stiffness: 100 } }
  };

  if (!isMounted) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white font-serif italic tracking-widest animate-pulse">TMA</div></div>;

  const completedCount = processedSyllabus.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / 16) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 lg:p-12 w-full selection:bg-white selection:text-black font-sans relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-amber-500"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">Curriculum Timeline</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2">
            16-Weeks <span className="italic text-zinc-500">Journey</span>.
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            Training schedule for <span className="text-white font-medium">{userName}</span> ({userBatch})
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full lg:w-64 bg-zinc-950 border border-white/10 p-4">
          <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
            <span className="text-zinc-400">Progress</span>
            <span className="text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-zinc-800">
            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 text-right">
            {completedCount} of 16 Sessions Completed
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <div className="relative border-l border-zinc-800 ml-4 md:ml-6 space-y-8 pb-12">
          {processedSyllabus.map((session) => (
            <motion.div key={session.session} variants={itemVariants} className="relative pl-8 md:pl-12 group">
              
              {/* Timeline Node */}
              <div className={`absolute left-[-16px] top-0 w-8 h-8 rounded-full border-4 border-black flex items-center justify-center transition-colors z-10
                ${session.status === 'completed' ? 'bg-amber-500 text-black' : 
                  session.status === 'next' ? 'bg-white text-black animate-pulse' : 
                  'bg-zinc-900 border border-zinc-700 text-zinc-600'}`
              }>
                {session.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-[10px] font-bold">{session.session}</span>
                )}
              </div>

              {/* Content Card - CLICKABLE */}
              <div 
                onClick={() => setSelectedSession(session)}
                className={`p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden
                ${session.status === 'completed' ? 'bg-zinc-950/50 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20' : 
                  session.status === 'next' ? 'bg-zinc-900 border-white/30 hover:border-white shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 
                  'bg-black border-white/5 opacity-50 hover:opacity-100 hover:bg-zinc-950 hover:border-white/20'}`
              }>
                
                <div className="absolute right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  View Details <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Session {String(session.session).padStart(2, '0')}</span>
                    {session.status === 'next' && (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[9px] uppercase tracking-widest font-bold border border-amber-500/20">Up Next</span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-zinc-400 font-medium">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-zinc-500" /> {session.displayDate}
                  </div>
                </div>

                <h3 className={`text-xl md:text-2xl font-serif mb-4 ${session.status === 'next' ? 'text-white' : 'text-zinc-300'}`}>
                  {session.title}
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 border-t border-white/5 mb-4">
                  <div className="flex items-center text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5 mr-2 text-zinc-500" /> {session.timeDisplay || session.time}
                  </div>
                  <div className="flex items-center text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-zinc-500" /> {session.studioName || session.studio || 'TBA'}
                  </div>
                  <div className="flex items-center text-xs text-zinc-400">
                    <User className="w-3.5 h-3.5 mr-2 text-zinc-500" /> {session.trainer || 'TBA'}
                  </div>
                </div>

                {/* Preparation Quick View */}
                <div className="flex flex-col gap-2 pt-4 border-t border-dashed border-white/5">
                  <div className="flex items-start text-xs text-zinc-400">
                    <Shirt className="w-3.5 h-3.5 mr-2 mt-0.5 text-pink-400 shrink-0" /> 
                    <span className="line-clamp-1"><span className="text-zinc-500 font-bold mr-1">Outfit:</span> {session.outfit}</span>
                  </div>
                  <div className="flex items-start text-xs text-zinc-400">
                    <Briefcase className="w-3.5 h-3.5 mr-2 mt-0.5 text-amber-400 shrink-0" /> 
                    <span className="line-clamp-1"><span className="text-zinc-500 font-bold mr-1">Props:</span> {session.props}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MODAL POPUP FOR PREPARATION DETAILS */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedSession(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedSession(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">Session {String(selectedSession.session).padStart(2, '0')}</span>
                  {selectedSession.status === 'completed' && (
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[9px] uppercase tracking-widest font-bold">Completed</span>
                  )}
                  {selectedSession.status === 'next' && (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[9px] uppercase tracking-widest font-bold border border-amber-500/20">Up Next</span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">{selectedSession.title}</h2>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-zinc-400">
                  <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-zinc-500" /> {selectedSession.displayDate}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-500" /> {selectedSession.timeDisplay || selectedSession.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> {selectedSession.studioName || selectedSession.studio || 'TBA'}</div>
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-zinc-500" /> {selectedSession.trainer || 'TBA'}</div>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-8 bg-black overflow-y-auto">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" /> Session Overview
                  </h4>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    {selectedSession.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-dashed border-white/10">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2 mb-3">
                      <Shirt className="w-4 h-4 text-pink-400" /> Dress Code / Outfit
                    </h4>
                    <p className="text-sm text-white font-medium bg-zinc-900/50 border border-white/5 p-4">
                      {selectedSession.outfit}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-amber-400" /> Required Props
                    </h4>
                    <p className="text-sm text-white font-medium bg-zinc-900/50 border border-white/5 p-4">
                      {selectedSession.props}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent((selectedSession.studioName || selectedSession.studio || "") + " Tiffany Models Academy")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    <Map className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
