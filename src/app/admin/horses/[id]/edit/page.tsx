"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";

const categories = ["FUTURE_STARS", "COMPETITION_READY", "ELITE_SPORT", "BREEDING_INVESTMENT"];
const categoryLabels: Record<string, string> = {
  FUTURE_STARS: "Future Stars",
  COMPETITION_READY: "Competition Ready",
  ELITE_SPORT: "Elite Sport",
  BREEDING_INVESTMENT: "Breeding & Investment",
};
const genders = ["STALLION", "MARE", "GELDING"];
const disciplines = ["Dressage", "Show Jumping", "Eventing", "Breeding", "Working Equitation", "Endurance", "Reining", "Other"];

type Auction = { id: string; title: string; status: string };

export default function EditHorsePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "fetching">("fetching");
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [form, setForm] = useState({
    name: "", breed: "", age: "", gender: "MARE", color: "", heightCm: "",
    country: "", sire: "", dam: "", discipline: "Dressage", category: "COMPETITION_READY",
    description: "", startingPrice: "", currency: "EUR", lotNumber: "",
    vetChecked: false, featured: false, videoUrl: "", auctionId: "",
  });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("horses").select("*").eq("id", id).single(),
      supabase.from("auctions").select("id, title, status").order("start_date", { ascending: false }),
    ]).then(([{ data: horse }, { data: auctionData }]) => {
      if (horse) {
        setForm({
          name: horse.name ?? "",
          breed: horse.breed ?? "",
          age: horse.age?.toString() ?? "",
          gender: horse.gender ?? "MARE",
          color: horse.color ?? "",
          heightCm: horse.height_cm?.toString() ?? "",
          country: horse.country ?? "",
          sire: horse.sire ?? "",
          dam: horse.dam ?? "",
          discipline: horse.discipline ?? "Dressage",
          category: horse.category ?? "COMPETITION_READY",
          description: horse.description ?? "",
          startingPrice: horse.starting_price?.toString() ?? "",
          currency: horse.currency ?? "EUR",
          lotNumber: horse.lot_number?.toString() ?? "",
          vetChecked: horse.vet_checked ?? false,
          featured: horse.featured ?? false,
          videoUrl: horse.video_url ?? "",
          auctionId: horse.auction_id ?? "",
        });
        setImages(horse.images ?? []);
      }
      if (auctionData) setAuctions(auctionData);
      setState("idle");
    });
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    setState("loading");
    setError("");
    const res = await fetch(`/api/admin/horses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, breed: form.breed, age: Number(form.age),
        gender: form.gender, color: form.color,
        height_cm: Number(form.heightCm), country: form.country,
        sire: form.sire || null, dam: form.dam || null,
        discipline: form.discipline, category: form.category,
        description: form.description,
        starting_price: Number(form.startingPrice),
        currency: form.currency,
        vet_checked: form.vetChecked,
        featured: form.featured,
        video_url: form.videoUrl || null,
        auction_id: form.auctionId || null,
        lot_number: form.lotNumber ? Number(form.lotNumber) : null,
        images,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      setState("error");
    } else {
      setState("success");
      setTimeout(() => router.push("/admin/horses"), 1200);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/horses/${id}`, { method: "DELETE" });
    router.push("/admin/horses");
  };

  if (state === "fetching") {
    return <div className="text-[#7a8fa8] font-[family-name:var(--font-inter)] p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/horses" className="flex items-center gap-2 text-xs text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Edit: {form.name}</h1>
        </div>
        <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold transition-all font-[family-name:var(--font-inter)]">
          <Trash2 className="w-3.5 h-3.5" /> Delete Horse
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-[family-name:var(--font-inter)]">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormSection title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Horse Name" value={form.name} onChange={set("name")} placeholder="e.g. Valeria W" required />
              <Field label="Breed" value={form.breed} onChange={set("breed")} placeholder="e.g. KWPN" required />
              <Field label="Age (years)" type="number" value={form.age} onChange={set("age")} placeholder="e.g. 7" required />
              <SelectField label="Gender" value={form.gender} onChange={set("gender")}>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </SelectField>
              <Field label="Color" value={form.color} onChange={set("color")} placeholder="e.g. Bay" required />
              <Field label="Height (cm)" type="number" value={form.heightCm} onChange={set("heightCm")} placeholder="e.g. 168" required />
              <Field label="Country of Origin" value={form.country} onChange={set("country")} placeholder="e.g. Netherlands" required />
              <SelectField label="Discipline" value={form.discipline} onChange={set("discipline")}>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </SelectField>
              <Field label="Sire (father)" value={form.sire} onChange={set("sire")} placeholder="Optional" />
              <Field label="Dam (mother)" value={form.dam} onChange={set("dam")} placeholder="Optional" />
            </div>
          </FormSection>

          <FormSection title="Description">
            <div>
              <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Full Description <span className="text-red-400">*</span></label>
              <textarea value={form.description} onChange={set("description")} rows={8} required
                className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70] resize-none" />
              <p className="text-[10px] text-[#4a5a70] mt-1 font-[family-name:var(--font-inter)]">{form.description.length} chars</p>
            </div>
            <Field label="Video URL" value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
          </FormSection>

          <FormSection title="Photos">
            <ImageUpload urls={images} onChange={setImages} />
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Assign to Auction">
            <SelectField label="Auction" value={form.auctionId} onChange={set("auctionId")}>
              <option value="">— No auction —</option>
              {auctions.map((a) => <option key={a.id} value={a.id}>{a.title} ({a.status})</option>)}
            </SelectField>
            <Field label="Lot Number" type="number" value={form.lotNumber} onChange={set("lotNumber")} placeholder="e.g. 1" />
          </FormSection>

          <FormSection title="Pricing">
            <Field label="Starting Price" type="number" value={form.startingPrice} onChange={set("startingPrice")} placeholder="e.g. 95000" required />
            <SelectField label="Currency" value={form.currency} onChange={set("currency")}>
              {["EUR", "USD", "GBP", "CHF"].map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
          </FormSection>

          <FormSection title="Category">
            <div className="grid grid-cols-1 gap-2">
              {categories.map((c) => (
                <label key={c} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.category === c ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-[#c9a84c]/10 hover:border-[#c9a84c]/30"}`}>
                  <input type="radio" name="category" value={c} checked={form.category === c} onChange={set("category")} className="accent-[#c9a84c]" />
                  <span className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{categoryLabels[c]}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Flags">
            <Toggle label="Vet Checked ✓" checked={form.vetChecked} onChange={(v) => setForm((f) => ({ ...f, vetChecked: v }))} />
            <Toggle label="Featured Lot" checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
          </FormSection>

          <button onClick={handleSave} disabled={state === "loading" || state === "success"}
            className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl disabled:opacity-60 ${
              state === "success" ? "bg-green-500 text-white" : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
            }`}
          >
            {state === "success" ? <><CheckCircle className="w-4 h-4" /> Saved!</> : state === "loading" ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 space-y-4">
      <h3 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm border-b border-[#c9a84c]/10 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1.5 block">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]" />
    </div>
  );
}

function SelectField({ label, value, onChange, children }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1.5 block">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors">
        {children}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">{label}</span>
    </label>
  );
}
