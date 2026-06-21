"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Save, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

const categories = ["FUTURE_STARS", "COMPETITION_READY", "ELITE_SPORT", "BREEDING_INVESTMENT"];
const genders = ["STALLION", "MARE", "GELDING"];
const disciplines = ["Dressage", "Show Jumping", "Eventing", "Breeding", "Working Equitation", "Endurance", "Reining", "Other"];

export default function AddHorsePage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "", breed: "", age: "", gender: "MARE", color: "", heightCm: "",
    country: "", sire: "", dam: "", discipline: "Dressage", category: "COMPETITION_READY",
    description: "", startingPrice: "", currency: "EUR",
    vetChecked: false, featured: false, videoUrl: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      router.push("/admin/horses");
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/horses" className="flex items-center gap-2 text-xs text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Add Horse</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
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

          {/* Description */}
          <FormSection title="Description">
            <div>
              <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
                Full Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={set("description")}
                placeholder="Detailed description of the horse — competition record, character, movement, why it's exceptional..."
                rows={8}
                required
                className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70] resize-none"
              />
              <p className="text-[10px] text-[#4a5a70] mt-1 font-[family-name:var(--font-inter)]">
                {form.description.length} characters — aim for 300-600 for best results
              </p>
            </div>
            <Field label="Video URL (YouTube or Vimeo)" value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
          </FormSection>

          {/* Images */}
          <FormSection title="Photos">
            <div className="border-2 border-dashed border-[#c9a84c]/20 rounded-xl p-8 text-center hover:border-[#c9a84c]/40 transition-colors cursor-pointer">
              <ImagePlus className="w-8 h-8 text-[#c9a84c]/40 mx-auto mb-3" />
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                Drop photos here or click to upload
              </p>
              <p className="text-xs text-[#4a5a70] mt-1 font-[family-name:var(--font-inter)]">
                PNG, JPG up to 10MB each. Minimum 3 photos required.
              </p>
              <button className="mt-4 px-4 py-2 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-semibold rounded-lg hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
                Choose Files
              </button>
            </div>
          </FormSection>
        </div>

        {/* Right: Pricing & flags */}
        <div className="space-y-6">
          <FormSection title="Auction Settings">
            <SelectField label="Category" value={form.category} onChange={set("category")}>
              {categories.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
              ))}
            </SelectField>
            <Field label="Starting Price" type="number" value={form.startingPrice} onChange={set("startingPrice")} placeholder="e.g. 95000" required />
            <SelectField label="Currency" value={form.currency} onChange={set("currency")}>
              {["EUR", "USD", "GBP", "CHF"].map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
          </FormSection>

          <FormSection title="Flags">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.vetChecked ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.vetChecked ? "translate-x-5" : "translate-x-0.5"}`} />
                <input type="checkbox" checked={form.vetChecked} onChange={set("vetChecked")} className="sr-only" />
              </div>
              <span className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">Vet Checked</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group mt-3">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="sr-only" />
              </div>
              <span className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">Featured Lot</span>
            </label>
          </FormSection>

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl ${
              saved ? "bg-green-500 text-white" : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
            }`}
          >
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Horse</>}
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
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
      >
        {children}
      </select>
    </div>
  );
}
