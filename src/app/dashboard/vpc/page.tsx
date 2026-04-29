"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Loader2,
  ArrowLeft,
  Zap,
  Timer,
  Flame,
  Trash,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import Link from "next/link";

// ── Types ───────────────────────────────────────────────────────────────────

interface CategoryCount {
  male: number;
  female: number;
}

interface Registration {
  id: number;
  club_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  skill_7_8: string;
  speed_8_9: string;
  speed_10_12: string;
  speed_13_15: string;
  free_10_12: string;
  free_13_15: string;
  free_16_open: string;
  total_participants: number;
  notes: string | null;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseCategory(json: string): CategoryCount {
  try {
    const parsed = JSON.parse(json);
    return { male: Number(parsed.male) || 0, female: Number(parsed.female) || 0 };
  } catch {
    return { male: 0, female: 0 };
  }
}

function catTotal(c: CategoryCount) {
  return c.male + c.female;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  rejected: "Rejected",
};

// ── Category display config ─────────────────────────────────────────────────

const categoryConfig = [
  { key: "skill_7_8", label: "Skill 7-8yo", icon: Zap, color: "text-amber-400" },
  { key: "speed_8_9", label: "Speed 8-9yo", icon: Timer, color: "text-cyan-400" },
  { key: "speed_10_12", label: "Speed 10-12yo", icon: Timer, color: "text-cyan-400" },
  { key: "speed_13_15", label: "Speed 13-15yo", icon: Timer, color: "text-cyan-400" },
  { key: "free_10_12", label: "Free 10-12yo", icon: Flame, color: "text-purple-400" },
  { key: "free_13_15", label: "Free 13-15yo", icon: Flame, color: "text-purple-400" },
  { key: "free_16_open", label: "Free 16+ Open", icon: Flame, color: "text-purple-400" },
];

// ── Main Component ──────────────────────────────────────────────────────────

export default function VPCAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  // Auth check
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("tma_user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === "admin") {
        setAuthed(true);
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/vpc/registrations");
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
      }
    } catch (e: any) {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/vpc/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${status}`);
        fetchData();
      } else {
        toast.error(json.error);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteRegistration(id: number) {
    if (!confirm("Delete this registration?")) return;
    try {
      const res = await fetch("/api/vpc/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Registration deleted");
        fetchData();
      }
    } catch {
      toast.error("Failed to delete");
    }
  }

  // ── Filtering ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        searchQuery === "" ||
        r.club_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [registrations, searchQuery, statusFilter]);

  // ── Stats ───────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((r) => r.status === "pending").length;
    const confirmed = registrations.filter((r) => r.status === "confirmed").length;
    const totalParticipants = registrations.reduce(
      (sum, r) => sum + r.total_participants,
      0
    );
    const confirmedParticipants = registrations
      .filter((r) => r.status === "confirmed")
      .reduce((sum, r) => sum + r.total_participants, 0);
    return { total, pending, confirmed, totalParticipants, confirmedParticipants };
  }, [registrations]);

  // ── CSV Export ─────────────────────────────────────────────────────────

  function exportCSV() {
    const headers = [
      "ID", "Club Name", "Contact", "Phone", "Email",
      "Skill 7-8 (M)", "Skill 7-8 (F)",
      "Speed 8-9 (M)", "Speed 8-9 (F)",
      "Speed 10-12 (M)", "Speed 10-12 (F)",
      "Speed 13-15 (M)", "Speed 13-15 (F)",
      "Free 10-12 (M)", "Free 10-12 (F)",
      "Free 13-15 (M)", "Free 13-15 (F)",
      "Free 16+ (M)", "Free 16+ (F)",
      "Total", "Notes", "Status", "Registered At",
    ];

    const rows = filtered.map((r) => {
      const cats = categoryConfig.map((c) => {
        const p = parseCategory(r[c.key as keyof Registration] as string);
        return [p.male, p.female];
      });
      return [
        r.id,
        `"${r.club_name}"`,
        `"${r.first_name} ${r.last_name}"`,
        r.phone,
        r.email,
        ...cats.flat(),
        r.total_participants,
        `"${r.notes || ""}"`,
        r.status,
        r.created_at,
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vpc2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="border-b border-white/10 bg-[#111] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                VPC 2026 — Registrations
              </h1>
              <p className="text-sm text-white/50">
                VATA Parkour Challenge · June 21, 2026
              </p>
            </div>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Clubs",
              value: stats.total,
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "text-yellow-400",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              icon: CheckCircle2,
              color: "text-green-400",
            },
            {
              label: "Total Athletes",
              value: `${stats.confirmedParticipants} / ${stats.totalParticipants}`,
              icon: Trophy,
              color: "text-orange-400",
              sub: "confirmed / all",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#151515] border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-white/50 uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              {s.sub && (
                <div className="text-xs text-white/30 mt-1">{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search club, name, or email..."
              className="w-full bg-[#151515] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            {["all", "pending", "confirmed", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                  statusFilter === s
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-transparent"
                }`}
              >
                {s === "all" ? "All" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No registrations found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((reg) => {
                const isExpanded = expandedId === reg.id;

                return (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                  >
                    {/* Row header */}
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : reg.id)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-white truncate">
                            {reg.club_name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[reg.status]}`}
                          >
                            {statusLabels[reg.status]}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                          <span>
                            {reg.first_name} {reg.last_name}
                          </span>
                          <span>{reg.email}</span>
                          <span>{reg.phone}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-orange-400">
                          {reg.total_participants}
                        </div>
                        <div className="text-xs text-white/40">athletes</div>
                      </div>
                      <div className="flex-shrink-0 text-white/30">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/10 p-4 space-y-4">
                            {/* Categories */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {categoryConfig.map((cat) => {
                                const p = parseCategory(
                                  reg[cat.key as keyof Registration] as string
                                );
                                const total = catTotal(p);
                                if (total === 0) return null;

                                const Icon = cat.icon;
                                return (
                                  <div
                                    key={cat.key}
                                    className="bg-white/5 rounded-lg p-3"
                                  >
                                    <div
                                      className={`flex items-center gap-1.5 mb-2 ${cat.color}`}
                                    >
                                      <Icon className="w-3.5 h-3.5" />
                                      <span className="text-xs font-medium">
                                        {cat.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                      <span className="text-white/60">
                                        M: <span className="text-white font-medium">{p.male}</span>
                                      </span>
                                      <span className="text-white/60">
                                        F: <span className="text-white font-medium">{p.female}</span>
                                      </span>
                                      <span className="text-white/40 ml-auto">
                                        = {total}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Notes */}
                            {reg.notes && (
                              <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-white/40 mb-1">
                                  Notes
                                </div>
                                <p className="text-sm text-white/80">
                                  {reg.notes}
                                </p>
                              </div>
                            )}

                            {/* Meta */}
                            <div className="text-xs text-white/40">
                              Registered: {formatDate(reg.created_at)} · ID: #{reg.id}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                              {reg.status !== "confirmed" && (
                                <button
                                  onClick={() =>
                                    updateStatus(reg.id, "confirmed")
                                  }
                                  disabled={updating === reg.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Confirm
                                </button>
                              )}
                              {reg.status !== "rejected" && (
                                <button
                                  onClick={() =>
                                    updateStatus(reg.id, "rejected")
                                  }
                                  disabled={updating === reg.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              )}
                              {reg.status !== "pending" && (
                                <button
                                  onClick={() =>
                                    updateStatus(reg.id, "pending")
                                  }
                                  disabled={updating === reg.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Set Pending
                                </button>
                              )}
                              <button
                                onClick={() => deleteRegistration(reg.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-colors ml-auto"
                              >
                                <Trash className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
