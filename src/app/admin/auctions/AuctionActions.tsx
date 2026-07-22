import { adminFetch } from "@/lib/adminFetch";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const statusOptions = ["UPCOMING", "LIVE", "CLOSED", "COMPLETED"] as const;

const statusColors: Record<string, string> = {
  UPCOMING: "border-blue-400/30 text-blue-400 hover:bg-blue-400/10",
  LIVE: "border-red-400/30 text-red-400 hover:bg-red-400/10",
  CLOSED: "border-[#7a8fa8]/30 text-[#7a8fa8] hover:bg-[#7a8fa8]/10",
  COMPLETED: "border-green-400/30 text-green-400 hover:bg-green-400/10",
};

export function AuctionActions({ auctionId, currentStatus }: { auctionId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (status: string) => {
    setLoading(true);
    await adminFetch(`/api/admin/auctions/${auctionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this auction? All associated horse lot assignments will be cleared.")) return;
    setLoading(true);
    await adminFetch(`/api/admin/auctions/${auctionId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">Set status:</span>
      {statusOptions.filter((s) => s !== currentStatus).map((s) => (
        <button key={s} onClick={() => update(s)} disabled={loading}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all font-[family-name:var(--font-inter)] disabled:opacity-40 ${statusColors[s]}`}>
          → {s}
        </button>
      ))}
      <button onClick={handleDelete} disabled={loading}
        className="ml-auto p-1.5 text-[#7a8fa8] hover:text-red-400 transition-colors disabled:opacity-40" title="Delete auction">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
