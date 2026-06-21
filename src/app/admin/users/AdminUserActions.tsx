"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, XCircle } from "lucide-react";

export function AdminUserActions({ userId, verified, role }: { userId: string; verified: boolean; role: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (body: object) => {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!verified && (
        <button
          onClick={() => update({ verified: true })}
          disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border border-green-400/20 text-green-400 hover:bg-green-400/10 rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-40"
        >
          <Shield className="w-3 h-3" /> Verify
        </button>
      )}
      {role !== "ADMIN" && (
        <button
          onClick={() => update({ role: "ADMIN" })}
          disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all font-[family-name:var(--font-inter)] disabled:opacity-40"
        >
          Make Admin
        </button>
      )}
      {verified && (
        <button
          onClick={() => update({ verified: false })}
          disabled={loading}
          className="p-1.5 text-[#7a8fa8] hover:text-red-400 transition-colors disabled:opacity-40"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
