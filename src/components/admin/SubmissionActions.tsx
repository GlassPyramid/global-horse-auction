"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye, Loader2, Rocket, X, Gavel } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  status: string;
  start_date: string;
}

interface Submission {
  name: string;
  breed: string;
  age?: number;
  gender?: string;
  color?: string;
  height_cm?: number;
  category?: string;
  discipline?: string;
  description?: string;
  asking_price?: number;
  sire?: string;
  dam?: string;
}

const statusActions = [
  { value: "under_review", label: "Under Review", icon: Eye, color: "#3B82F6" },
  { value: "approved", label: "Approve", icon: CheckCircle, color: "#10B981" },
  { value: "rejected", label: "Reject", icon: XCircle, color: "#EF4444" },
];

const CATEGORIES = [
  { value: "FUTURE_STARS", label: "Future Stars" },
  { value: "COMPETITION_READY", label: "Competition Ready" },
  { value: "ELITE_SPORT", label: "Elite Sport" },
  { value: "BREEDING_INVESTMENT", label: "Breeding & Investment" },
];

export default function SubmissionActions({
  id,
  currentStatus,
  currentNotes,
  submission,
}: {
  id: string;
  currentStatus: string;
  currentNotes: string;
  submission: Submission;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Publish panel state
  const [showPublish, setShowPublish] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionId, setAuctionId] = useState("");
  const [featured, setFeatured] = useState(false);

  // Editable fields (pre-filled from submission)
  const [fields, setFields] = useState({
    name: submission.name ?? "",
    breed: submission.breed ?? "",
    age: String(submission.age ?? ""),
    gender: submission.gender ?? "MARE",
    color: submission.color ?? "",
    height_cm: String(submission.height_cm ?? ""),
    category: submission.category ?? "COMPETITION_READY",
    discipline: submission.discipline ?? "Dressage",
    description: submission.description ?? "",
    asking_price: String(submission.asking_price ?? ""),
    sire: submission.sire ?? "",
    dam: submission.dam ?? "",
  });

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  const updateStatus = async (status: string) => {
    setActionLoading(status);
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    setActionLoading(null);
    router.refresh();
  };

  const saveNotes = async () => {
    setSaving(true);
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notes: notes }),
    });
    setSaving(false);
    router.refresh();
  };

  const openPublishPanel = async () => {
    setShowPublish(true);
    setAuctionsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("auctions")
      .select("id, title, status, start_date")
      .in("status", ["UPCOMING", "LIVE"])
      .order("start_date", { ascending: true });
    setAuctions(data ?? []);
    setAuctionsLoading(false);
  };

  const publish = async () => {
    setActionLoading("publish");
    const res = await fetch(`/api/submissions/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_notes: notes,
        auction_id: auctionId || null,
        featured,
        name: fields.name,
        breed: fields.breed,
        age: Number(fields.age),
        gender: fields.gender,
        color: fields.color,
        height_cm: Number(fields.height_cm),
        category: fields.category,
        discipline: fields.discipline,
        description: fields.description,
        asking_price: Number(fields.asking_price),
        sire: fields.sire || null,
        dam: fields.dam || null,
      }),
    });
    const data = await res.json();
    setActionLoading(null);
    if (res.ok) {
      router.push(`/admin/horses/${data.horse_id}/edit`);
    } else {
      alert(data.error ?? "Something went wrong");
      router.refresh();
    }
  };

  return (
    <div>
      {/* Main action bar */}
      <div className="flex items-center gap-3 flex-wrap py-1">
        {/* Notes */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Admin notes (visible to seller)..."
            className="flex-1 min-w-0 bg-[#060c1d] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
          />
          <button onClick={saveNotes} disabled={saving}
            className="shrink-0 px-3 py-2 text-xs font-bold border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] disabled:opacity-50">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
          </button>
        </div>

        {/* Status actions */}
        <div className="flex items-center gap-2 shrink-0">
          {statusActions.filter(s => s.value !== currentStatus).map((s) => (
            <button key={s.value} onClick={() => updateStatus(s.value)} disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-50"
              style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
              {actionLoading === s.value ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <s.icon className="w-3.5 h-3.5" />}
              {s.label}
            </button>
          ))}

          {currentStatus !== "published" && !showPublish && (
            <button onClick={openPublishPanel} disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-50"
              style={{ background: "#c9a84c", color: "#060c1d" }}>
              <Rocket className="w-3.5 h-3.5" /> Approve & Publish
            </button>
          )}

          {currentStatus === "published" && (
            <span className="px-3 py-2 text-xs font-bold rounded-lg font-[family-name:var(--font-inter)]"
              style={{ background: "#8B5CF615", color: "#8B5CF6", border: "1px solid #8B5CF630" }}>
              ✓ Published
            </span>
          )}
        </div>
      </div>

      {/* Publish panel */}
      {showPublish && currentStatus !== "published" && (
        <div className="mt-4 border border-[#c9a84c]/20 rounded-xl overflow-hidden bg-[#060c1d]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#c9a84c]/15 bg-[#0a1428]">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">Review & Publish</span>
              <span className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">— adjust before going live</span>
            </div>
            <button onClick={() => setShowPublish(false)} className="text-[#4a5a70] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Editable fields */}
            <div>
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-bold font-[family-name:var(--font-inter)] mb-3">Horse Details</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Name", key: "name", type: "text" },
                  { label: "Breed", key: "breed", type: "text" },
                  { label: "Age (years)", key: "age", type: "number" },
                  { label: "Color", key: "color", type: "text" },
                  { label: "Height (cm)", key: "height_cm", type: "number" },
                  { label: "Starting Price (€)", key: "asking_price", type: "number" },
                  { label: "Sire", key: "sire", type: "text" },
                  { label: "Dam", key: "dam", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1 block">{label}</label>
                    <input type={type} value={fields[key as keyof typeof fields]} onChange={set(key as keyof typeof fields)}
                      className="w-full bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                ))}

                {/* Gender */}
                <div>
                  <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1 block">Gender</label>
                  <select value={fields.gender} onChange={set("gender")}
                    className="w-full bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors">
                    <option value="STALLION">Stallion</option>
                    <option value="MARE">Mare</option>
                    <option value="GELDING">Gelding</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1 block">Category</label>
                  <select value={fields.category} onChange={set("category")}
                    className="w-full bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                {/* Discipline */}
                <div>
                  <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1 block">Discipline</label>
                  <select value={fields.discipline} onChange={set("discipline")}
                    className="w-full bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors">
                    {["Dressage","Show Jumping","Eventing","Breeding","Working Equitation","Western","Endurance","Other"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-3">
                <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1 block">Description</label>
                <textarea value={fields.description} onChange={set("description")} rows={3}
                  className="w-full bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none" />
              </div>
            </div>

            {/* Auction assignment */}
            <div>
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest font-bold font-[family-name:var(--font-inter)] mb-3">Assign to Auction</p>
              {auctionsLoading ? (
                <div className="flex items-center gap-2 text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading auctions...
                </div>
              ) : (
                <div className="space-y-2">
                  {/* No auction option */}
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${!auctionId ? "border-[#c9a84c]/40 bg-[#c9a84c]/5" : "border-[#c9a84c]/10 hover:border-[#c9a84c]/20"}`}>
                    <input type="radio" name="auction" value="" checked={!auctionId} onChange={() => setAuctionId("")} className="accent-[#c9a84c]" />
                    <div>
                      <p className="text-xs font-semibold text-white font-[family-name:var(--font-inter)]">No auction — publish as standalone listing</p>
                      <p className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">Horse appears on /horses but not in an auction</p>
                    </div>
                  </label>

                  {auctions.length === 0 ? (
                    <div className="p-3 rounded-xl border border-[#c9a84c]/10 text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
                      No upcoming or live auctions. <a href="/admin/auctions/new" className="text-[#c9a84c] hover:underline">Create one first →</a>
                    </div>
                  ) : (
                    auctions.map((a) => (
                      <label key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${auctionId === a.id ? "border-[#c9a84c]/40 bg-[#c9a84c]/5" : "border-[#c9a84c]/10 hover:border-[#c9a84c]/20"}`}>
                        <input type="radio" name="auction" value={a.id} checked={auctionId === a.id} onChange={() => setAuctionId(a.id)} className="accent-[#c9a84c]" />
                        <Gavel className="w-4 h-4 text-[#c9a84c] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white font-[family-name:var(--font-inter)] truncate">{a.title}</p>
                          <p className="text-[10px] font-[family-name:var(--font-inter)]"
                            style={{ color: a.status === "LIVE" ? "#ef4444" : "#3b82f6" }}>
                            {a.status === "LIVE" ? "● Live now" : `Opens ${new Date(a.start_date).toLocaleDateString()}`}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 bg-[#0a1428] rounded-xl border border-[#c9a84c]/10">
              <div>
                <p className="text-xs font-semibold text-white font-[family-name:var(--font-inter)]">Feature this horse</p>
                <p className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">Appears in the Featured Lots section on the homepage</p>
              </div>
              <button onClick={() => setFeatured(f => !f)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${featured ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Confirm publish */}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={() => setShowPublish(false)}
                className="px-5 py-2.5 border border-[#c9a84c]/20 text-[#7a8fa8] text-sm font-semibold rounded-xl hover:border-[#c9a84c]/40 transition-all font-[family-name:var(--font-inter)]">
                Cancel
              </button>
              <button onClick={publish} disabled={!!actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] text-[#060c1d] text-sm font-bold rounded-xl hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] disabled:opacity-50 glow-gold">
                {actionLoading === "publish"
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                  : <><Rocket className="w-4 h-4" /> Publish as Live Listing</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
