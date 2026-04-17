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
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState("model");
  const [users, setUsers] = useState<any[]>([]);

    const [stats, setStats] = useState({
    activeModels: 0,
    classesThisWeek: 0,
    branchesCount: 0,
    publishedModules: 0,
    pendingApprovals: 0,
  });

  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/users?stats=true');
      const data = await res.json();
      if (data && !data.error) {
        setStats({
          activeModels: data.activeModels || 0,
          classesThisWeek: 0,
          branchesCount: data.branchesCount || 0,
          publishedModules: data.publishedModules || 0,
          pendingApprovals: data.pendingApprovals || 0,
        });
      }

      // Fetch today's classes
      const resToday = await fetch('/api/jadwal?today=true');
      const todayData = await resToday.json();
      if (Array.isArray(todayData)) {
        setTodayClasses(todayData);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
    }).then(() => { fetchUsers(); fetchStats(); });
  };
  const [userName, setUserName] = useState("Tiffany");
  const [userBranch, setUserBranch] = useState("Jakarta Selatan");
  const [userStatus, setUserStatus] = useState("pending");

  // Geolocation & Attendance State
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasClassToday, setHasClassToday] = useState(false);
  const [todaySession, setTodaySession] = useState<any>(null);

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPwCurrent, setShowPwCurrent] = useState(false);
  const [showPwNew, setShowPwNew] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Admin Reset Password State
  const [resetPwTarget, setResetPwTarget] = useState<any>(null);
  const [resetPwValue, setResetPwValue] = useState("");

  // Student dynamic data
  const [studentStats, setStudentStats] = useState({
    statusLabel: "Pending",
    modulesLabel: "Loading...",
    nextSessionLabel: "Loading...",
    gradeLabel: "—",
  });
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [studioCoords, setStudioCoords] = useState<{lat: number; lon: number; name: string}>({ lat: -6.2280239, lon: 106.825536, name: "Studio" });

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
      setUserStatus(parsed.status || "pending");
      if (parsed.role === 'admin') {
         fetchUsers();
         fetchStats();
      } else if (parsed.batchId) {
         // Fetch student status label
         setStudentStats(prev => ({
           ...prev,
           statusLabel: parsed.status === 'approved' ? 'Active Model' : parsed.status === 'rejected' ? 'Rejected' : 'Pending',
         }));

         // Fetch jadwal for student's batch
         fetch(`/api/jadwal?batchId=${parsed.batchId}`)
            .then(r => r.json())
            .then(data => {
               if (Array.isArray(data)) {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const now = new Date();
                  const configuredSessions = data.filter(s => s.isConfigured === 1);
                  
                  // Count completed sessions (past dates)
                  const completedCount = configuredSessions.filter(s => {
                    if (!s.date) return false;
                    const endTimeStr = (s.time || "00:00 - 23:59").split(" - ")[1] || "23:59";
                    return new Date(`${s.date}T${endTimeStr}:00`) < now;
                  }).length;

                  setStudentStats(prev => ({
                    ...prev,
                    modulesLabel: `${completedCount} of ${data.length} Done`,
                  }));

                  // Find next upcoming session
                  const upcomingConfigured = configuredSessions
                    .filter(s => s.date && new Date(`${s.date}T00:00:00`) >= new Date(todayStr))
                    .sort((a, b) => a.date.localeCompare(b.date));

                  if (upcomingConfigured.length > 0) {
                    const nextSession = upcomingConfigured[0];
                    const nextDate = new Date(nextSession.date);
                    const isToday = nextSession.date === todayStr;
                    const timeStr = nextSession.time ? nextSession.time.split(" - ")[0] : "";
                    setStudentStats(prev => ({
                      ...prev,
                      nextSessionLabel: isToday ? `Today, ${timeStr}` : `${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`,
                    }));
                  } else {
                    setStudentStats(prev => ({ ...prev, nextSessionLabel: "No upcoming" }));
                  }

                  // Set upcoming sessions for sidebar (next 2)
                  setUpcomingSessions(upcomingConfigured.slice(0, 2));

                  // Find today's session for check-in
                  const sessionToday = data.find(s => s.date === todayStr && s.isConfigured === 1);
                  if (sessionToday) {
                     setHasClassToday(true);
                     setTodaySession(sessionToday);
                     // Set studio coordinates from jadwal API response
                     if (sessionToday.studioLat && sessionToday.studioLon) {
                       setStudioCoords({
                         lat: parseFloat(sessionToday.studioLat),
                         lon: parseFloat(sessionToday.studioLon),
                         name: sessionToday.studio || "Studio",
                       });
                     }
                     // Check if already checked in
                     fetch(`/api/attendance?memberId=${parsed.id}&jadwalId=${sessionToday.id}`)
                       .then(r => r.json())
                       .then(att => setHasCheckedIn(!!att.hasCheckedIn));
                  }
               }
            });

         // Fetch attendance for grade
         fetch(`/api/attendance?batchId=${parsed.batchId}`)
           .then(r => r.json())
           .then(attData => {
             if (Array.isArray(attData) && attData.length > 0) {
               // Get this student's attendance from the member-level count
               fetch('/api/users')
                 .then(r => r.json())
                 .then(usersData => {
                   if (Array.isArray(usersData)) {
                     const me = usersData.find(u => u.id === parsed.id);
                     if (me) {
                       const pct = Math.round((me.attended_count / 16) * 100);
                       setStudentStats(prev => ({
                         ...prev,
                         gradeLabel: `${pct}%`,
                       }));
                     } else {
                       setStudentStats(prev => ({ ...prev, gradeLabel: "N/A" }));
                     }
                   }
                 });
             } else {
               setStudentStats(prev => ({ ...prev, gradeLabel: "N/A" }));
             }
           });

         // Fetch batch name for branch display
         fetch('/api/batches')
           .then(r => r.json())
           .then(batchData => {
             if (Array.isArray(batchData)) {
               const myBatch = batchData.find(b => b.id == parsed.batchId);
               if (myBatch) {
                 setUserBranch(myBatch.branch || "Jakarta");
               }
             }
           });
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

        // Dynamic Studio Coordinates from jadwal API
        const studioLat = studioCoords.lat;
        const studioLon = studioCoords.lon;

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
          fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              memberId: JSON.parse(localStorage.getItem('tma_user')!).id,
              jadwalId: todaySession.id,
              status: 'hadir',
              lat: userLat,
              lon: userLon
            })
          }).then(r => r.json()).then(res => {
             if (res.success) {
               setHasCheckedIn(true);
               toast.success("Attendance Recorded!", {
                 description: `You are checked in for ${todaySession.title}!`,
               });
             } else {
               toast.error("Already checked in or Error", { description: res.error });
             }
          });
        } else {
          toast.error("Check-in Failed: Too Far", {
            description: `You are ${distance.toFixed(2)} km away from ${studioCoords.name}. Maximum allowed radius is 1 km.`,
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
              value: stats.activeModels.toString(),
              sub: "Total registered",
              color: "text-emerald-400",
            },
            {
              icon: Calendar,
              label: "Classes & Branches",
              value: "Active",
              sub: `${stats.branchesCount} Branches`,
              color: "text-blue-400",
            },
            {
              icon: BookOpen,
              label: "Published Modules",
              value: stats.publishedModules.toString(),
              sub: "Fully Updated",
              color: "text-amber-400",
            },
            {
              icon: List,
              label: "Pending Approvals",
              value: stats.pendingApprovals.toString(),
              sub: "Need your review",
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
                            <>
                             <button onClick={() => { setResetPwTarget(u); setResetPwValue(""); }} className="p-2 text-zinc-600 hover:text-amber-400 transition-colors" title="Reset Password">
                                 <KeyRound className="w-4 h-4" />
                             </button>
                             <button onClick={() => updateStatus(u.id, 'delete')} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                                 <Trash className="w-4 h-4" />
                             </button>
                            </>
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
                {todayClasses.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic text-center py-4">No classes scheduled today.</p>
                ) : (
                  todayClasses.map((cls, idx) => (
                    <div key={cls.id} className={`group relative pl-6 border-l ${idx === 0 ? 'border-emerald-500/50' : 'border-zinc-800'}`}>
                      <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${idx === 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {cls.time || "TBD"}
                      </div>
                      <h4 className="text-lg font-serif mb-1">
                        {cls.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mb-2">
                        {cls.batchName || "Batch"}
                      </p>
                      <div className="flex items-center text-xs text-zinc-400 gap-2">
                        <MapPin className="w-3 h-3" /> {cls.studio || "TBD"}
                      </div>
                    </div>
                  ))
                )}
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

        {/* ADMIN RESET PASSWORD MODAL */}
        <AnimatePresence>
          {resetPwTarget && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setResetPwTarget(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 shadow-2xl"
              >
                <h3 className="text-xl font-serif mb-2">Reset Password</h3>
                <p className="text-xs text-zinc-500 mb-6">Set a new password for <span className="text-white font-medium">{resetPwTarget.name}</span></p>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">New Password</label>
                  <input type="text" value={resetPwValue}
                    onChange={e => setResetPwValue(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30" />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setResetPwTarget(null)}
                    className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">Cancel</button>
                  <button type="button"
                    onClick={async () => {
                      if (!resetPwValue || resetPwValue.length < 6) {
                        toast.error("Password minimal 6 karakter"); return;
                      }
                      const savedUser = JSON.parse(localStorage.getItem("tma_user") || "{}");
                      try {
                        const res = await fetch('/api/auth/reset-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ adminId: savedUser.id, targetUserId: resetPwTarget.id, newPassword: resetPwValue })
                        });
                        const data = await res.json();
                        if (data.success) {
                          toast.success(`Password ${resetPwTarget.name} berhasil di-reset!`);
                          setResetPwTarget(null);
                          setResetPwValue("");
                        } else {
                          toast.error(data.error || "Gagal reset password");
                        }
                      } catch {
                        toast.error("Terjadi kesalahan");
                      }
                    }}
                    className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-200"
                  >
                    Reset Password
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
            onClick={() => setShowChangePassword(true)}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" /> Change Password
          </button>
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
                  Session {todaySession ? String(todaySession.session).padStart(2, '0') : ''}: {todaySession?.title || 'Class'} • Today, {todaySession?.time?.split(' - ')[0] || ''} at {todaySession?.studio || 'Studio'}
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
                You have successfully checked in for today's session at {todaySession?.studio || 'the studio'}. Have a great training!
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
            value: studentStats.statusLabel,
            color: "text-emerald-400",
          },
          {
            icon: BookOpen,
            label: "Modules",
            value: studentStats.modulesLabel,
            color: "text-blue-400",
          },
          {
            icon: Calendar,
            label: "Next Session",
            value: studentStats.nextSessionLabel,
            color: "text-amber-400",
          },
          {
            icon: Star,
            label: "Attendance",
            value: studentStats.gradeLabel,
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
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-zinc-500 italic text-center py-4">No upcoming sessions.</p>
              ) : (
                upcomingSessions.map((session, idx) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isToday = session.date === todayStr;
                  const dateLabel = isToday
                    ? `Today • ${session.time || 'TBD'}`
                    : `${session.date ? new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBA'} • ${session.time || 'TBD'}`;
                  return (
                    <div key={session.id} className={`group relative pl-6 border-l ${idx === 0 ? 'border-amber-500/50' : 'border-zinc-800 hover:border-white/30'} transition-colors`}>
                      <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-amber-500 animate-pulse' : 'bg-zinc-800 group-hover:bg-white'} transition-colors`} />
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${idx === 0 ? 'text-amber-500' : 'text-zinc-500'}`}>
                        {dateLabel}
                      </div>
                      <h4 className={`text-lg font-serif mb-2 ${idx === 0 ? 'text-white' : ''}`}>
                        {session.title}
                      </h4>
                      <div className="flex items-center text-xs text-zinc-400 gap-2">
                        <MapPin className="w-3 h-3" /> {session.studio || 'TBD'}
                      </div>
                    </div>
                  );
                })
              )}
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

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showChangePassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => { setShowChangePassword(false); setPwForm({ current: "", new: "", confirm: "" }); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-serif mb-2">Change Password</h3>
              <p className="text-xs text-zinc-500 mb-6">Enter your current password and choose a new one.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showPwCurrent ? "text" : "password"} value={pwForm.current}
                      onChange={e => setPwForm({...pwForm, current: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 pr-10" />
                    <button type="button" onClick={() => setShowPwCurrent(!showPwCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                      {showPwCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">New Password</label>
                  <div className="relative">
                    <input type={showPwNew ? "text" : "password"} value={pwForm.new}
                      onChange={e => setPwForm({...pwForm, new: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 pr-10" />
                    <button type="button" onClick={() => setShowPwNew(!showPwNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                      {showPwNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-2">Confirm New Password</label>
                  <input type="password" value={pwForm.confirm}
                    onChange={e => setPwForm({...pwForm, confirm: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => { setShowChangePassword(false); setPwForm({ current: "", new: "", confirm: "" }); }}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">Cancel</button>
                <button type="button" disabled={isChangingPw}
                  onClick={async () => {
                    if (!pwForm.current || !pwForm.new || !pwForm.confirm) {
                      toast.error("Semua field harus diisi"); return;
                    }
                    if (pwForm.new.length < 6) {
                      toast.error("Password minimal 6 karakter"); return;
                    }
                    if (pwForm.new !== pwForm.confirm) {
                      toast.error("Password baru tidak cocok"); return;
                    }
                    setIsChangingPw(true);
                    try {
                      const savedUser = JSON.parse(localStorage.getItem("tma_user") || "{}");
                      const res = await fetch('/api/auth/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: savedUser.id, currentPassword: pwForm.current, newPassword: pwForm.new })
                      });
                      const data = await res.json();
                      setIsChangingPw(false);
                      if (data.success) {
                        toast.success("Password berhasil diubah!");
                        setShowChangePassword(false);
                        setPwForm({ current: "", new: "", confirm: "" });
                      } else {
                        toast.error(data.error || "Gagal mengubah password");
                      }
                    } catch {
                      setIsChangingPw(false);
                      toast.error("Terjadi kesalahan");
                    }
                  }}
                  className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPw ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
