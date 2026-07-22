import { adminFetch } from "@/lib/adminFetch";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function AdminHorseActions({ horseId, horseName }: { horseId: string; horseName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${horseName}"? This cannot be undone.`)) return;
    setDeleting(true);
    await adminFetch(`/api/admin/horses/${horseId}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-[#7a8fa8] hover:text-red-400 transition-colors disabled:opacity-40"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
