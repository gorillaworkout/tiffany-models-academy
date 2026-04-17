"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  BookOpen,
  User,
  Star,
  ChevronRight,
  DownloadCloud,
  PlayCircle,
  MapPin,
  Users,
  Settings,
  Plus,
  List,
  Search,
  Fingerprint,
  CheckCircle2,
  Loader2,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState("model");
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = () => {
    fetch('/api/users').then(r => r.json()).then(data => {
       if (Array.isArray(data)) setUsers(data);
    });
  };

  const updateStatus = (id: string, action: string) => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    }).then(() => fetchUsers());
  };
  const [userName, setUserName] = useState("Tiffany");
  const [userBranch, setUserBranch] = useState("Jakarta Selatan");

  // Geolocation & Attendance State
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasClassToday, setHasClassToday] = useState(true); // Control visibility of the banner

  useEffect(() => {
    const savedUser = localStorage.getItem("tma_user");
    if (!savedUser) {
      window.location.href = "/";
      return;
    }
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserRole(parsed.role);
      setUserName(parsed.fullName.split(" ")[0]);
      if (parsed.role === 'admin') {
         fetchUsers();
      }
    }
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as any, stiffness: 100 },
    },
  };

  // GPS Check-in Logic (Haversine Formula)
  const handleCheckIn = () => {
    setIsCheckingIn(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation Error", {
        description: "Your device/browser does not support GPS location.",
      });
      setIsCheckingIn(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Dynamic Studio Coordinates (Noble House Jakarta: -6.2280239, 106.825536)
        const studioLat = -6.2280239;
        const studioLon = 106.825536;

        // Calculate distance in kilometers
        const R = 6371;
        const dLat = ((studioLat - userLat) * Math.PI) / 180;
        const dLon = ((studioLon - userLon) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((studioLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in KM

        setIsCheckingIn(false);

        if (distance <= 1.0) {
          setHasCheckedIn(true);
          toast.success("Attendance Recorded!", {
            description:
              "You are within the studio radius. Have a great training session at Noble House!",
          });
        } else {
          toast.error("Check-in Failed: Too Far", {
            description: `You are ${distance.toFixed(2)} km away from Noble House. Maximum allowed radius is 1 km.`,
          });
        }
      },
      (error) => {
        setIsCheckingIn(false);
        toast.error("Location Access Denied", {
          description:
            "Please allow location access in your browser settings to verify your attendance.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  if (!isMounted)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-serif italic tracking-widest animate-pulse">
          TMA
        </div>
      </div>
    );

  // -------------------------------------------------------------
  //  1. ADMIN VIEW (Director Panel)
  // -------------------------------------------------------------
  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-black text-white p-6 md:p-10 lg:p-12 w-full selection:bg-white selection:text-black font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-emerald-500"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-bold">
                Director Portal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
              Academy <span className="italic text-zinc-500">Overview</span>.
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-bold transition-all">
              <Plus className="w-4 h-4" /> New Class
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              icon: Users,
              label: "Active Models",
              value: "128",
              sub: "+12 this month",
              color: "text-emerald-400",
            },
            {
              icon: Calendar,
              label: "Classes This Week",
              value: "5",
              sub: "2 Branches",
              color: "text-blue-400",
            },
            {
              icon: BookOpen,
              label: "Published Modules",
              value: "16",
              sub: "Fully Updated",
              color: "text-amber-400",
            },
            {
              icon: List,
              label: "Pending Approvals",
              value: "3",
              sub: "New Registrations",
              color: "text-pink-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative bg-zinc-950/50 border border-white/5 p-6 overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150`}
              />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {stat.label}
                </p>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-serif tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-500">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-2 space-y-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/admin/jadwal"
                className="group block relative bg-zinc-900/40 border border-white/5 p-8 hover:bg-zinc-900 transition-colors"
              >
                <Calendar className="w-8 h-8 text-blue-400 mb-6 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-2xl font-serif mb-3">
                  Manage Schedules & Branches
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light mb-8">
                  Update branch coordinates (GPS), assign studios, and set the
                  training curriculum for both Jakarta & Bandung branches.
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:text-blue-300 transition-colors">
                  Open Scheduler{" "}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a
                href="/modul"
                className="group block relative bg-zinc-900/40 border border-white/5 p-8 hover:bg-zinc-900 transition-colors"
              >
                <BookOpen className="w-8 h-8 text-amber-400 mb-6 group-hover:text-amber-300 transition-colors" />
                <h3 className="text-2xl font-serif mb-3">View Modules</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light mb-8">
                  Publish new PDF materials, link video tutorials, and manage
                  the curriculum library for the models.
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-amber-400 group-hover:text-amber-300 transition-colors">
                  Open Library{" "}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>

            <div className="border border-white/5 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-xl font-serif">Registrations & Directory</h3>
              </div>
              <div className="space-y-4">
                {users.length === 0 ? (
                   <p className="text-sm text-zinc-500 italic text-center py-4">No users registered yet.</p>
                ) : (
                   users.map((u: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col gap-4 p-4 bg-black border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10">
                           <User className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-1">
                            {u.name}
                          </p>
                          <p className="text-xs text-zinc-500 font-mono">
                            {u.email} • WA: {u.whatsapp || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 border ${
                            u.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : u.status === "rejected"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {u.status}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {u.status === 'pending' && (
                            <>
                               <button onClick={() => updateStatus(u.id, 'approve')} className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/30 transition-colors">
                                 Approve
                               </button>
                               <button onClick={() => updateStatus(u.id, 'reject')} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/30 transition-colors">
                                 Reject
                               </button>
                            </>
                          )}
                          {u.status !== 'pending' && u.role !== 'admin' && (
                             <button onClick={() => updateStatus(u.id, 'delete')} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                                 <Trash className="w-4 h-4" />
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="border border-white/5 bg-zinc-950/30 backdrop-blur-sm h-full">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Today's Classes
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="group relative pl-6 border-l border-emerald-500/50">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">
                    In 2 Hours
                  </div>
                  <h4 className="text-lg font-serif mb-1">
                    Facial Expressions
                  </h4>
                  <p className="text-xs text-zinc-500 mb-2">
                    Batch 1 • 24 Students
                  </p>
                  <div className="flex items-center text-xs text-zinc-400 gap-2">
                    <MapPin className="w-3 h-3" /> Noble House, Jakarta
                  </div>
                </div>

                <div className="group relative pl-6 border-l border-zinc-800">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                    16:00 - 18:00
                  </div>
                  <h4 className="text-lg font-serif mb-1">Camera Presence</h4>
                  <p className="text-xs text-zinc-500 mb-2">
                    Batch 2 • 18 Students
                  </p>
                  <div className="flex items-center text-xs text-zinc-400 gap-2">
                    <MapPin className="w-3 h-3" /> Photo Studio B, Bandung
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 mt-auto">
                <button
                  onClick={() => {
                    localStorage.removeItem("tma_user");
                    window.location.href = "/";
                  }}
                  className="w-full py-3 text-xs font-bold uppercase tracking-widest text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  Logout Admin
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  //  2. STUDENT VIEW (Model Portal)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 lg:p-12 w-full selection:bg-white selection:text-black font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-zinc-500"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold">
              Member Portal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2">
            Welcome back,{" "}
            <span className="italic text-zinc-500">{userName}</span>.
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            Registered at{" "}
            <span className="text-white font-medium">{userBranch} Branch</span>{" "}
            (Batch 1)
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("tma_user");
              window.location.href = "/";
            }}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs uppercase tracking-widest font-bold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* LIVE ATTENDANCE GEOFENCING BANNER - ONLY SHOWS IF THERE IS A CLASS TODAY */}
      <AnimatePresence>
        {hasClassToday && !hasCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-8 border p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 bg-zinc-900/60 border-white/10 hover:border-white/30"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white animate-pulse shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif mb-1">Live Class Check-in</h3>
                <p className="text-xs text-zinc-400">
                  Session 04: Facial Expressions • Today, 14:00 at Noble House
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full md:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shrink-0"
            >
              {isCheckingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying GPS...
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" /> Check In Now
                </>
              )}
            </button>
          </motion.div>
        )}

        {hasClassToday && hasCheckedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 border p-6 flex items-center gap-5 bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif mb-1 text-white">
                Attendance Verified
              </h3>
              <p className="text-xs text-emerald-500/70">
                You have successfully checked in for today's session at Noble
                House. Have a great training!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12"
      >
        {[
          {
            icon: User,
            label: "Status",
            value: "Active Model",
            color: "text-emerald-400",
          },
          {
            icon: BookOpen,
            label: "Modules",
            value: "3 of 16 Done",
            color: "text-blue-400",
          },
          {
            icon: Calendar,
            label: "Next Session",
            value: "Today, 14:00",
            color: "text-amber-400",
          },
          {
            icon: Star,
            label: "Grade",
            value: "Excellent",
            color: "text-pink-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="group relative bg-zinc-950/50 border border-white/5 p-6 overflow-hidden hover:border-white/20 transition-all duration-500"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150`}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  {stat.label}
                </p>
                <p className="text-xl font-medium tracking-tight">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-70`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2 space-y-8"
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Academy Hub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/modul"
                className="group block relative bg-zinc-900/40 border border-white/5 p-8 hover:bg-zinc-900 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen className="w-8 h-8 text-zinc-400 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-serif mb-3">Training Modules</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light mb-8">
                  Access the complete 16-part curriculum covering basic catwalk,
                  photo posing, and runway makeup.
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  Browse Library{" "}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a
                href="/jadwal"
                className="group block relative bg-zinc-900/40 border border-white/5 p-8 hover:bg-zinc-900 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Calendar className="w-8 h-8 text-zinc-400 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-serif mb-3">Class Schedule</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light mb-8">
                  View your weekly training sessions, track attendance, and
                  check upcoming academy events.
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  View Calendar{" "}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="border border-white/5 bg-zinc-950/30 backdrop-blur-sm h-full">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
                Upcoming Schedule
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="group relative pl-6 border-l border-amber-500/50">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">
                  Today • 14:00 - 16:00
                </div>
                <h4 className="text-lg font-serif mb-2 text-white">
                  Facial Expressions
                </h4>
                <div className="flex items-center text-xs text-zinc-400 gap-2">
                  <MapPin className="w-3 h-3" /> Noble House, Jakarta
                </div>
              </div>

              <div className="group relative pl-6 border-l border-zinc-800 hover:border-white/30 transition-colors">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-white transition-colors" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                  Next Week • 14:00 - 16:00
                </div>
                <h4 className="text-lg font-serif mb-2">Advanced Runway</h4>
                <div className="flex items-center text-xs text-zinc-400 gap-2">
                  <MapPin className="w-3 h-3" /> Noble House, Jakarta
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 mt-auto">
              <a
                href="/jadwal"
                className="block text-center w-full py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                View Full Calendar
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
