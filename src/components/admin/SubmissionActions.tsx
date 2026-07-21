"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye, Loader2, Rocket } from "lucide-react";

const statusActions = [
  { value: "under_review", label: "Under Review", icon: Eye, color: "#3B82F6" },
  { value: "approved", label: "Approve", icon: CheckCircle, color: "#10B981" },
  { value: "rejected", label: "Reject", icon: XCircle, color: "#EF4444" },
];

export default function SubmissionActions({
  id,
  currentStatus,
  currentNotes,
}: {
  id: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const publish = async () => {
    if (!confirm("Approve & publish this horse as a live listing? This will make it visible on the site.")) return;
    setActionLoading("publish");
    const res = await fetch(`/api/submissions/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes),
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
    <div className="flex items-center gap-3 flex-wrap">
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
            {actionLoading === s.value
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <s.icon className="w-3.5 h-3.5" />}
            {s.label}
          </button>
        ))}

        {/* Approve & Publish — only shown when not already published */}
        {currentStatus !== "published" && (
          <button onClick={publish} disabled={!!actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-50"
            style={{ background: "#c9a84c", color: "#060c1d" }}>
            {actionLoading === "publish"
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Rocket className="w-3.5 h-3.5" />}
            Approve & Publish
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
  );
}
