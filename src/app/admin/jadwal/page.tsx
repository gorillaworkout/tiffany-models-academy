"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Edit2, ArrowLeft, Save, X, MapPin, User, Search, Filter, CheckCircle2, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminJadwalPage() {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [editingSession, setEditingSession] = useState<any>(null); // State for Edit Modal

  // Dummy Global Data for Locations & Coaches
  const [studios, setStudios] = useState<any[]>([]);
  
  // Fetch initial data
  
  useEffect(() => {
    fetch('/api/studios').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setStudios(data);
    });
    fetch('/api/coaches').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setCoaches(data.map((c:any) => c.name));
    });
  }, []);
  
  const [isEditingStudio, setIsEditingStudio] = useState<any>(null);
  const [isEditingCoach, setIsEditingCoach] = useState<any>(null);
  
  const [coaches, setCoaches] = useState<any[]>([]);

  // Curriculum Data
  const [viewingBatch, setViewingBatch] = useState<any>(null); // For Batch Detail View
  const [batches, setBatches] = useState<any[]>([]);
  const [isAddingBatch, setIsAddingBatch] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Set default selected batch when batches load
  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0].id);
    }
  }, [batches, selectedBatch]);
  const [curriculumSlots, setCurriculumSlots] = useState<any[]>([]);

  // Function to load slots from API or generate dummy if empty
  const fetchCurriculum = (batchId: string) => {
    fetch(`/api/jadwal?batchId=${batchId}`).then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        // Map db boolean format back to frontend
        setCurriculumSlots(data.map(d => ({...d, isConfigured: d.isConfigured === 1})));
      } else {
        // Generate blank slate 16 slots if this batch is new
        setCurriculumSlots(Array.from({ length: 16 }, (_, i) => ({
          session: i + 1,
          title: i === 0 ? "Introduction & Posture Assessment" : `Curriculum Topic ${i + 1}`,
          date: "",
          time: "14:00 - 16:00",
          studio: "",
          trainer: "",
          outfit: "TBA",
          props: "TBA",
          isConfigured: false
        })));
      }
    });
  };

  useEffect(() => {
    if (selectedBatch) {
      fetchCurriculum(selectedBatch);
    }
  }, [selectedBatch]);

  // Batches Data
  

  useEffect(() => {
    fetch('/api/batches').then(r => r.json()).then(data => {
      if(Array.isArray(data)) {
         // Also append dummy student count (temporarily 0 for now as no registrations)
         setBatches(data.map((b: any) => ({...b, totalStudents: 0})));
      }
    });
  }, []);

  // Fetch registered models dynamically for the selected batch
  const [registeredModels, setRegisteredModels] = useState<any[]>([]);

  useEffect(() => {
    if (viewingBatch) {
      // Fetch models for this specific batch
      fetch('/api/users').then(r => r.json()).then(data => {
        if (Array.isArray(data)) {
           // We'll need to filter users by batch, but since our current /api/users doesn't include batch_id in the SELECT, 
           // we need to update /api/users first. For now, let's filter if batchId is returned, or just show approved users.
           // To be safe, we will just set them to registeredModels
           setRegisteredModels(data.filter(u => u.status === 'approved' && u.role === 'student' && u.batch_id == viewingBatch.id));
        }
      });
    }
  }, [viewingBatch]);

  const dummyAttendance: any[] = [];

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    setCurriculumSlots(slots => 
      slots.map(s => s.session === editingSession.session ? { ...editingSession, isConfigured: true } : s)
    );
    setEditingSession(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.01 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 lg:p-12 selection:bg-white selection:text-black">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-blue-500"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">Director Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2">
            Curriculum <span className="italic text-zinc-500">Planner</span>.
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            Manage the 16-session curriculum, locations, and coaches.
          </p>
        </div>
        
        {/* Action Button */}
        <div className="flex gap-4">
          <button onClick={async () => {
             const toastId = toast.loading("Saving Curriculum...");
             try {
               await fetch('/api/jadwal', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ batchId: selectedBatch, slots: curriculumSlots })
               });
               toast.success("Published!", { id: toastId, description: "All 16 sessions have been saved successfully to the database." });
             } catch (e) {
               toast.error("Failed to save", { id: toastId });
             }
          }} className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform">
            <Save className="w-4 h-4" /> 
            Publish Curriculum
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
        {[
          { id: "curriculum", label: "16-Weeks Curriculum Planner" },
          { id: "branch", label: "Locations & Coaches" },
          { id: "batch", label: "Manage Batches & Attendance" }
        ].map((tab) => (
          <button
            key={tab.id} type="button"
            onClick={(e) => { e.preventDefault(); setActiveTab(tab.id); }}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 1. CURRICULUM TAB */}
      {/* ----------------------------------------------------------- */}
      {activeTab === "curriculum" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Batch Selector */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8 bg-zinc-950 border border-white/5 p-6 md:px-8 md:py-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Editing Batch:</span>
              <select 
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-black border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-blue-500 font-serif"
              >
                {batches.length === 0 ? (
                  <option value="">No batches available</option>
                ) : (
                  batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest font-bold border border-emerald-500/20">
              Active Session
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {curriculumSlots.map((slot) => (
              <motion.div key={slot.session} variants={itemVariants} className={`p-6 border transition-all duration-300
                ${slot.isConfigured ? 'bg-zinc-950 border-white/10 hover:border-white/30' : 'bg-black border-dashed border-zinc-800 hover:border-zinc-600'}
              `}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full ${slot.isConfigured ? 'bg-blue-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                      {slot.session}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Session {String(slot.session).padStart(2, '0')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingSession({...slot})}
                      className="text-zinc-600 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-xl font-serif mb-4 ${slot.isConfigured ? 'text-white' : 'text-zinc-500'}`}>
                  {slot.title}
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Date & Time</span>
                    <span className="text-xs text-zinc-400">{slot.date ? `${slot.date} • ${slot.time}` : 'TBD'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Location</span>
                    <span className="text-xs text-zinc-400">{slot.studio}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Lead Trainer</span>
                    <span className="text-xs text-zinc-400">{slot.trainer}</span>
                  </div>
                </div>

                {!slot.isConfigured && (
                  <div className="mt-4 pt-4 border-t border-dashed border-zinc-800 flex justify-center">
                    <button 
                      onClick={() => setEditingSession({...slot})}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Configure Session
                    </button>
                  </div>
                )}

              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. LOCATIONS & COACHES TAB */}
      {/* ----------------------------------------------------------- */}
      {activeTab === "branch" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Studio Locations */}
            <div className="bg-zinc-950 border border-white/5 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h3 className="text-2xl font-serif">Studio Locations</h3>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingStudio({ id: Date.now().toString(), name: "", lat: 0, lon: 0 }); }} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Location
                </button>
              </div>
              <div className="space-y-3">
                {studios.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 border border-white/5 bg-black hover:border-white/20 transition-colors group cursor-pointer" onClick={() => setIsEditingStudio(s)}>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-zinc-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">{s.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">GPS: {s.lat}, {s.lon}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingStudio(s); }} className="text-zinc-600 hover:text-white transition-colors p-2 z-10 relative">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetch('/api/studios', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id }) }).then(() => setStudios(studios.filter(st => st.id !== s.id))); }} className="text-zinc-600 hover:text-red-400 transition-colors p-2 z-10 relative">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coaches */}
            <div className="bg-zinc-950 border border-white/5 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h3 className="text-2xl font-serif">Academy Coaches</h3>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingCoach({ oldName: "", newName: "" }); }} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-amber-400 hover:text-amber-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Coach
                </button>
              </div>
              <div className="space-y-3">
                {coaches.map(c => (
                  <div key={c} className="flex items-center justify-between p-4 border border-white/5 bg-black hover:border-white/20 transition-colors group cursor-pointer" onClick={() => setIsEditingCoach({ oldName: c, newName: c })}>
                    <div className="flex items-center gap-4">
                      <User className="w-5 h-5 text-zinc-500" />
                      <span className="text-sm font-medium text-white">{c}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingCoach({ oldName: c, newName: c }); }} className="text-zinc-600 hover:text-white transition-colors p-2 z-10 relative">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetch('/api/coaches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c }) }).then(() => setCoaches(coaches.filter(co => co !== c))); }} className="text-zinc-600 hover:text-red-400 transition-colors p-2 z-10 relative">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 3. BATCHES & ATTENDANCE TAB */}
      {/* ----------------------------------------------------------- */}
      {activeTab === "batch" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {!viewingBatch ? (
            // LIST VIEW
            <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif">Academy Batches</h3>
              <button 
                onClick={() => setIsAddingBatch({ name: "", branch: studios.length > 0 ? studios[0].id : "", status: "Registration", maxStudents: 30 })}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-zinc-200 text-[10px] uppercase tracking-widest font-bold transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Batch
              </button>
            </div>
            <div className="bg-zinc-950 border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-5 font-bold">Batch Name</th>
                    <th className="px-6 py-5 font-bold">Branch Location</th>
                    <th className="px-6 py-5 font-bold">Enrolled / Max</th>
                    <th className="px-6 py-5 font-bold">Status</th>
                    <th className="px-6 py-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-5 font-medium text-white">{batch.name}</td>
                      <td className="px-6 py-5">{batch.branch}</td>
                      <td className="px-6 py-5">
                        <span className={batch.totalStudents >= (batch.maxStudents || 30) ? "text-amber-400 font-medium" : "text-white"}>
                          {batch.totalStudents} / {batch.maxStudents || 30}
                        </span>
                        <span className="text-zinc-500 ml-1">Models</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                          batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewingBatch(batch); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold transition-colors"
                          >
                            Details
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAddingBatch({...batch}); }}
                            className="p-2 text-zinc-600 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { 
                               e.preventDefault(); e.stopPropagation(); 
                               fetch('/api/batches', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: batch.id}) }).then(() => setBatches(batches.filter(b => b.id !== batch.id)));
                            }}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          ) : (
            // DETAIL VIEW (Models & Attendance)
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                  <button onClick={() => setViewingBatch(null)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Batches List
                  </button>
                  <h2 className="text-3xl font-serif mb-1">{viewingBatch.name}</h2>
                  <p className="text-sm text-zinc-400">{viewingBatch.branch} • {viewingBatch.totalStudents} Active Models Enrolled</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-colors">
                    Export CSV Data
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrolled Models */}
                <div className="bg-zinc-950 border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif">Enrolled Models</h3>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 bg-white/5 px-2 py-1">{viewingBatch.totalStudents} Total</span>
                  </div>
                  <div className="space-y-3">
                    {registeredModels.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-white/5 bg-black hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white leading-none mb-1.5">{m.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">{m.ig} • {m.height}cm</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Attendance</p>
                          <p className={`text-sm font-bold ${m.attendance === '100%' ? 'text-emerald-400' : 'text-amber-400'}`}>{m.attendance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Summary per Session */}
                <div className="bg-zinc-950 border border-white/5 p-6">
                  <h3 className="text-xl font-serif mb-6">Attendance Summary</h3>
                  <div className="space-y-4">
                    {dummyAttendance.map((a, i) => (
                      <div key={i} className="p-5 border border-white/5 bg-black relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1 block">Session {String(a.session).padStart(2, '0')} • {a.date}</span>
                            <h4 className="text-sm font-medium text-white">{a.title}</h4>
                          </div>
                          <div className="text-right">
                            <span className={`text-2xl font-serif ${a.present === a.total ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {a.present}<span className="text-zinc-600 text-sm font-sans">/{a.total}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full h-1.5 bg-zinc-900 mt-2">
                          <div className={`h-full ${a.present === a.total ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(a.present / a.total) * 100}%` }} />
                        </div>
                        
                        {a.present < a.total && (
                          <div className="mt-4 pt-3 border-t border-dashed border-white/10">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-red-400 mb-1">Absentees:</p>
                            <p className="text-xs text-zinc-400">Amanda Rawles, Budi Santoso</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* EDIT MODAL POPUP */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence>
        {editingSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditingSession(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setEditingSession(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-blue-500">Session {String(editingSession.session).padStart(2, '0')}</span>
                </div>
                <h2 className="text-2xl font-serif">Configure Curriculum Slot</h2>
              </div>

              <div className="p-6 md:p-8 bg-black overflow-y-auto">
                <form onSubmit={handleSaveSession} className="space-y-6">
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Class Title / Module Name</Label>
                    <Input 
                      required
                      value={editingSession.title}
                      onChange={(e) => setEditingSession({...editingSession, title: e.target.value})}
                      className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Date</Label>
                      <Input 
                        type="date"
                        required
                        value={editingSession.date}
                        onChange={(e) => setEditingSession({...editingSession, date: e.target.value})}
                        className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Time (e.g., 14:00 - 16:00)</Label>
                      <Input 
                        required
                        value={editingSession.time}
                        onChange={(e) => setEditingSession({...editingSession, time: e.target.value})}
                        className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* STUDIO DROPDOWN */}
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Studio / Location</Label>
                      <Select 
                        value={editingSession.studio} 
                        onValueChange={(val) => setEditingSession({...editingSession, studio: val})}
                      >
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus:ring-1 focus:ring-blue-500 text-sm text-white">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none z-[110]">
                          {studios.map(s => (
                            <SelectItem key={s.id} value={s.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* COACH DROPDOWN */}
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Lead Trainer / Coach</Label>
                      <Select 
                        value={editingSession.trainer} 
                        onValueChange={(val) => setEditingSession({...editingSession, trainer: val})}
                      >
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus:ring-1 focus:ring-blue-500 text-sm text-white">
                          <SelectValue placeholder="Select Coach" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none max-h-[200px] z-[110]">
                          {coaches.map(c => (
                            <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white cursor-pointer">
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Outfit Required</Label>
                      <Input 
                        value={editingSession.outfit}
                        onChange={(e) => setEditingSession({...editingSession, outfit: e.target.value})}
                        className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500">Props Required</Label>
                      <Input 
                        value={editingSession.props}
                        onChange={(e) => setEditingSession({...editingSession, props: e.target.value})}
                        className="bg-zinc-900/50 border-white/10 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                    <button 
                      type="button"
                      onClick={() => setEditingSession(null)}
                      className="px-6 py-2 border border-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modals for Location, Coach, and Batch */}
        {isAddingBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddingBatch(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 shadow-2xl"
            >
              <h3 className="text-xl font-serif mb-6">{isAddingBatch.id ? "Edit Batch" : "Add New Batch"}</h3>
              <div className="space-y-4">
                <div>
                  <Label>Batch Name</Label>
                  <Input 
                    value={isAddingBatch.name} 
                    onChange={e => setIsAddingBatch({...isAddingBatch, name: e.target.value})}
                    placeholder="e.g. Batch 3 (Nov '26)"
                    className="bg-black border-white/10 mt-1"
                  />
                </div>
                <div>
                  <Label>Branch Location</Label>
                  <Select value={isAddingBatch.branch} onValueChange={(val) => setIsAddingBatch({...isAddingBatch, branch: val})}>
                    <SelectTrigger className="bg-black border-white/10 text-white mt-1">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {studios.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Max Models</Label>
                    <Input 
                      type="number" 
                      value={isAddingBatch.maxStudents} 
                      onChange={e => setIsAddingBatch({...isAddingBatch, maxStudents: parseInt(e.target.value) || 0})}
                      className="bg-black border-white/10 mt-1"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={isAddingBatch.status} onValueChange={(val) => setIsAddingBatch({...isAddingBatch, status: val})}>
                      <SelectTrigger className="bg-black border-white/10 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Registration">Registration</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={(e) => { e.preventDefault(); setIsAddingBatch(null); }} className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">Cancel</button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isAddingBatch.name) return;
                    const newBatch = {
                      id: isAddingBatch.id || Date.now().toString(),
                      name: isAddingBatch.name,
                      branch: isAddingBatch.branch || (studios.length > 0 ? studios[0].id : ""),
                      status: isAddingBatch.status,
                      maxStudents: isAddingBatch.maxStudents
                    };
                    fetch('/api/batches', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newBatch)
                    }).then(() => {
                      if (isAddingBatch.id) {
                         setBatches(batches.map(b => b.id === isAddingBatch.id ? { ...b, ...newBatch } : b));
                      } else {
                         setBatches([...batches, { ...newBatch, totalStudents: 0 }]);
                      }
                      setIsAddingBatch(null);
                    });
                  }} 
                  className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-200"
                >
                  {isAddingBatch.id ? "Save Changes" : "Create Batch"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      <AnimatePresence>
        {isEditingStudio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditingStudio(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 shadow-2xl"
            >
              <h3 className="text-xl font-serif mb-6">{isEditingStudio.name === "" ? "Add New Location" : "Edit Location"}</h3>
              <div className="space-y-4">
                <div>
                  <Label>Location Name</Label>
                  <Input 
                    value={isEditingStudio.name} 
                    onChange={e => setIsEditingStudio({...isEditingStudio, name: e.target.value})}
                    className="bg-black border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input 
                      type="number" step="any"
                      value={isEditingStudio.lat} 
                      onChange={e => setIsEditingStudio({...isEditingStudio, lat: parseFloat(e.target.value) || 0})}
                      className="bg-black border-white/10"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input 
                      type="number" step="any"
                      value={isEditingStudio.lon} 
                      onChange={e => setIsEditingStudio({...isEditingStudio, lon: parseFloat(e.target.value) || 0})}
                      className="bg-black border-white/10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={(e) => { e.preventDefault(); setIsEditingStudio(null); }} className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">Cancel</button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isEditingStudio.name === "") {
                       // Just simple check
                       return;
                    }
                    const exists = studios.find(s => s.id === isEditingStudio.id);
                     
                      const newStudio = { ...isEditingStudio, id: isEditingStudio.id || isEditingStudio.name };
                    fetch('/api/studios', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newStudio)
                    }).then(() => {
                      if (exists) {
                        setStudios(studios.map(s => s.id === isEditingStudio.id ? newStudio : s));
                      } else {
                        setStudios([...studios, newStudio]);
                      }
                      setIsEditingStudio(null);
                    });
                  }} 
                  className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-200"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isEditingCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditingCoach(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 shadow-2xl"
            >
              <h3 className="text-xl font-serif mb-6">{isEditingCoach.oldName === "" ? "Add New Coach" : "Edit Coach"}</h3>
              <div className="space-y-4">
                <div>
                  <Label>Coach Name</Label>
                  <Input 
                    value={isEditingCoach.newName} 
                    onChange={e => setIsEditingCoach({...isEditingCoach, newName: e.target.value})}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={(e) => { e.preventDefault(); setIsEditingCoach(null); }} className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">Cancel</button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isEditingCoach.newName === "") return;
                    
                    
                      fetch('/api/coaches', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: isEditingCoach.newName, oldName: isEditingCoach.oldName })
                    }).then(() => {
                      if (isEditingCoach.oldName === "") {
                        setCoaches([...coaches, isEditingCoach.newName]);
                      } else {
                        setCoaches(coaches.map(c => c === isEditingCoach.oldName ? isEditingCoach.newName : c));
                      }
                      setIsEditingCoach(null);
                    });
                  }} 
                  className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-200"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
