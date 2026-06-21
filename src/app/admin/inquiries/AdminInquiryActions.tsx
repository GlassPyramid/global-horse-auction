"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export function AdminInquiryActions({ inquiryId, status }: { inquiryId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-2 shrink-0">
      {status === "PENDING" && (
        <button
          onClick={() => update("REVIEWING")}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-400/10 border border-blue-400/30 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-400/20 transition-all font-[family-name:var(--font-inter)] disabled:opacity-40"
        >
          <Eye className="w-3.5 h-3.5" /> Review
        </button>
      )}
      {(status === "PENDING" || status === "REVIEWING") && (
        <>
          <button
            onClick={() => update("ACCEPTED")}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-all font-[family-name:var(--font-inter)] disabled:opacity-40"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Accept
          </button>
          <button
            onClick={() => update("REJECTED")}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-400/20 transition-all font-[family-name:var(--font-inter)] disabled:opacity-40"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </>
      )}
    </div>
  );
}
