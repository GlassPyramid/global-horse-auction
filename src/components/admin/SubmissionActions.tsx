"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

const statuses = [
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

  const update = async (status?: string) => {
    if (status) setActionLoading(status);
    else setSaving(true);

    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(status ? { status } : {}), admin_notes: notes }),
    });

    setActionLoading(null);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 flex-1">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Admin notes (visible to seller)..."
          className="flex-1 bg-[#060c1d] border border-[#c9a84c]/15 rounded-lg px-3 py-2 text-xs text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
        />
        <button onClick={() => update()} disabled={saving}
          className="px-3 py-2 text-xs font-bold border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] disabled:opacity-50">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {statuses.filter(s => s.value !== currentStatus).map((s) => (
          <button key={s.value} onClick={() => update(s.value)} disabled={!!actionLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-50"
            style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
            {actionLoading === s.value ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <s.icon className="w-3.5 h-3.5" />}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
