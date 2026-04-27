"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Clock,
  MapPin,
  MessageSquare,
  Plus,
  Trash2,
  Users,
  Check,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface WaGroup {
  id: string;
  name: string;
  group_id: string;
}

const STUDIOS = ["Studio Jakarta Selatan", "Studio Bintaro"];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export default function ReminderPage() {
  const [jam, setJam] = useState("10:00");
  const [studio, setStudio] = useState(STUDIOS[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [sending, setSending] = useState(false);

  // Group management
  const [groups, setGroups] = useState<WaGroup[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [addingGroup, setAddingGroup] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await fetch("/api/wa-groups");
      const data = await res.json();
      setGroups(data.groups || []);
      // Auto-select all groups
      setSelectedGroupIds((data.groups || []).map((g: WaGroup) => g.group_id));
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim() || !newGroupId.trim()) {
      toast.error("Name and Group ID are required");
      return;
    }
    setAddingGroup(true);
    try {
      const res = await fetch("/api/wa-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, groupId: newGroupId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Group added!");
        setNewGroupName("");
        setNewGroupId("");
        setShowAddGroup(false);
        await fetchGroups();
      } else {
        toast.error(data.error || "Failed to add group");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAddingGroup(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch("/api/wa-groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Group removed");
        await fetchGroups();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAll = () => {
    setSelectedGroupIds(groups.map((g) => g.group_id));
  };

  const deselectAll = () => {
    setSelectedGroupIds([]);
  };

  const previewMessage = useCustom
    ? customMessage
    : `📚 *Reminder Class TMA!*

Halo semuanya 👋
Jangan lupa hari ini ada kelas modeling:

🕐 *Jam:* ${jam} WIB
📍 *Studio:* ${studio}

Siapkan diri kalian dan datang tepat waktu ya!
See you there! ✨

— _Tiffanny Models Academy_`;

  const handleSend = async () => {
    if (selectedGroupIds.length === 0) {
      toast.error("Select at least one group");
      return;
    }
    if (useCustom && !customMessage.trim()) {
      toast.error("Custom message cannot be empty");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jam,
          studio,
          customMessage: useCustom ? customMessage : undefined,
          targets: selectedGroupIds,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          `✅ Reminder sent to ${selectedGroupIds.length} group(s)!`
        );
      } else {
        toast.error(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Class Reminder</h1>
            <p className="text-sm text-zinc-500">
              Send reminder to WhatsApp groups
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Groups */}
          <div className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Groups
              </h2>
              <button
                onClick={() => setShowAddGroup(!showAddGroup)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs uppercase tracking-wider rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
              >
                {showAddGroup ? (
                  <X className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {showAddGroup ? "Cancel" : "Add"}
              </button>
            </div>

            {/* Add Group Form */}
            {showAddGroup && (
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name (e.g. TMA Batch 2)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="text"
                  value={newGroupId}
                  onChange={(e) => setNewGroupId(e.target.value)}
                  placeholder="WA Group ID (e.g. 120363...@g.us)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 font-mono"
                />
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  Get Group ID from Fonnte dashboard → Groups, or use the Fonnte
                  API.
                </p>
                <button
                  onClick={handleAddGroup}
                  disabled={addingGroup}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all uppercase tracking-wider"
                >
                  {addingGroup ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  {addingGroup ? "Adding..." : "Add Group"}
                </button>
              </div>
            )}

            {/* Group List */}
            {loadingGroups ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              </div>
            ) : groups.length === 0 ? (
              <p className="text-sm text-zinc-600 text-center py-8">
                No groups yet. Add one above.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-600">
                  <button onClick={selectAll} className="hover:text-white transition-colors">
                    Select All
                  </button>
                  <span>·</span>
                  <button onClick={deselectAll} className="hover:text-white transition-colors">
                    None
                  </button>
                  <span className="ml-auto">
                    {selectedGroupIds.length}/{groups.length} selected
                  </span>
                </div>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedGroupIds.includes(group.group_id)
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                      }`}
                      onClick={() => toggleGroup(group.group_id)}
                    >
                      <div
                        className={`flex items-center justify-center h-5 w-5 rounded border transition-all flex-shrink-0 ${
                          selectedGroupIds.includes(group.group_id)
                            ? "bg-green-500 border-green-500"
                            : "border-white/20"
                        }`}
                      >
                        {selectedGroupIds.includes(group.group_id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {group.name}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-mono truncate">
                          {group.group_id}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        disabled={deletingId === group.id}
                        className="flex-shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        {deletingId === group.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Middle: Form */}
          <div className="space-y-6 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-400" />
              Compose Reminder
            </h2>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustom(false)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  !useCustom
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                Template
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  useCustom
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                Custom
              </button>
            </div>

            {!useCustom ? (
              <>
                {/* Time */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Jam Kelas
                  </label>
                  <select
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="bg-zinc-900">
                        {t} WIB
                      </option>
                    ))}
                  </select>
                </div>

                {/* Studio */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Studio
                  </label>
                  <select
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    {STUDIOS.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              /* Custom Message */
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                  Custom Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your custom message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending || selectedGroupIds.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 px-6 rounded-lg transition-all text-sm uppercase tracking-wider"
            >
              <Send className="h-4 w-4" />
              {sending
                ? "Sending..."
                : selectedGroupIds.length === 0
                ? "Select a Group"
                : `Send to ${selectedGroupIds.length} Group${
                    selectedGroupIds.length > 1 ? "s" : ""
                  }`}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold text-zinc-400">Preview</h2>
            <div className="bg-[#005c4b] rounded-xl p-4 text-white text-sm whitespace-pre-wrap leading-relaxed font-light">
              {previewMessage || "Type a message to preview..."}
            </div>
            <p className="text-xs text-zinc-600">
              * Bold text (*text*) and italic (_text_) will render in WhatsApp
            </p>
            {selectedGroupIds.length > 0 && (
              <div className="border-t border-white/5 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">
                  Sending to:
                </p>
                <div className="space-y-1">
                  {groups
                    .filter((g) => selectedGroupIds.includes(g.group_id))
                    .map((g) => (
                      <p key={g.id} className="text-xs text-green-400">
                        ✓ {g.name}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
