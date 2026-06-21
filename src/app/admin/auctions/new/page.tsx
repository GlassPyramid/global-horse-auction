"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function NewAuctionPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", startDate: "", endDate: "",
    status: "UPCOMING", featured: false, coverImage: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => router.push("/admin/auctions"), 1500);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/auctions" className="flex items-center gap-2 text-xs text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">New Auction</h1>
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 space-y-5">
        <div>
          <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Auction Title <span className="text-red-400">*</span></label>
          <input
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Summer Elite Collection 2026"
            required
            className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
          />
        </div>

        <div>
          <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe this auction collection..."
            rows={4}
            className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={set("startDate")}
              required
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> End Date <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={set("endDate")}
              required
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Status</label>
            <select value={form.status} onChange={set("status")} className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors">
              {["UPCOMING", "LIVE", "CLOSED", "COMPLETED"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Cover Image URL</label>
            <input
              value={form.coverImage}
              onChange={set("coverImage")}
              placeholder="https://..."
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
            <input type="checkbox" checked={form.featured} onChange={set("featured")} className="sr-only" />
          </div>
          <span className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">Feature this auction on the homepage</span>
        </label>

        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl ${
            saved ? "bg-green-500 text-white" : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
          }`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Created!</> : <><Save className="w-4 h-4" /> Create Auction</>}
        </button>
      </div>
    </div>
  );
}
