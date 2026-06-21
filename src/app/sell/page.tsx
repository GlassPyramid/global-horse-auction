"use client";

import { useState } from "react";
import { CheckCircle, Star, Trophy, Shield, TrendingUp, ArrowRight, Send } from "lucide-react";

const sellingPoints = [
  { icon: Star, title: "Global Reach", desc: "Reach 12,000+ verified buyers across 60+ countries simultaneously." },
  { icon: Trophy, title: "Premium Prices", desc: "Competitive live bidding consistently achieves above-market results." },
  { icon: Shield, title: "Secure Transactions", desc: "All payments secured. We handle contracts, transfer, and aftercare." },
  { icon: TrendingUp, title: "Expert Marketing", desc: "Professional photography, video production, and global promotion included." },
];

const requirements = [
  "Horses must be competition-sound with no undisclosed health issues",
  "Full vet check documentation required prior to listing",
  "UELN passport or equivalent certification mandatory",
  "Minimum age: 3 years. No upper age limit for breeding stock",
  "Seller must provide video footage within 60 days of application",
  "Reserve prices must align with current market valuations",
];

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "",
    horseName: "", breed: "", age: "", discipline: "",
    askingPrice: "", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, email: form.email, phone: form.phone, country: form.country,
        horse_name: form.horseName, breed: form.breed, age: form.age,
        discipline: form.discipline, asking_price: form.askingPrice, description: form.description,
      }),
    });
    if (res.ok) setSubmitted(true);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      {/* Header */}
      <section className="py-20 bg-[#0a1428] border-b border-[#c9a84c]/10 text-center">
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
          List With Us
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
          Sell Your Horse
        </h1>
        <p className="text-lg text-[#7a8fa8] max-w-xl mx-auto font-[family-name:var(--font-inter)]">
          We accept less than 20% of applications. If your horse meets our standard,
          we&apos;ll achieve the best price in the world for it.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Benefits & requirements */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">
                Why Sell With GHA?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sellingPoints.map((sp) => (
                  <div key={sp.title} className="p-5 bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all group">
                    <sp.icon className="w-5 h-5 text-[#c9a84c] mb-3" />
                    <h4 className="font-bold text-white mb-1 font-[family-name:var(--font-inter)]">{sp.title}</h4>
                    <p className="text-xs text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">{sp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
                Listing Requirements
              </h2>
              <div className="space-y-3">
                {requirements.map((req) => (
                  <div key={req} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission */}
            <div className="p-6 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/20">
              <h3 className="font-bold text-white font-[family-name:var(--font-inter)] mb-3">Seller Commission</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">5%</span>
                <span className="text-[#7a8fa8] text-sm font-[family-name:var(--font-inter)] mb-1">of hammer price</span>
              </div>
              <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                No listing fee. No upfront cost. Commission is only charged when your horse sells.
                Marketing, photography, and video production are included in the commission.
              </p>
            </div>
          </div>

          {/* Right: Application form */}
          <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#c9a84c]" />
                </div>
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">Application Received</h3>
                <p className="text-[#7a8fa8] font-[family-name:var(--font-inter)] text-sm leading-relaxed">
                  Our selection team reviews every application within 48 hours. If your horse meets our standards,
                  we&apos;ll contact you to arrange a video review and vet check documentation.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                  Seller Application
                </h2>
                <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8">
                  Tell us about yourself and your horse. We review every application personally.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Your Name" value={form.name} onChange={set("name")} placeholder="Full name" required />
                    <InputField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required />
                    <InputField label="Phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 8900" />
                    <InputField label="Country" value={form.country} onChange={set("country")} placeholder="Country" />
                  </div>

                  <div className="h-px bg-[#c9a84c]/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Horse Name" value={form.horseName} onChange={set("horseName")} placeholder="Horse name" required />
                    <InputField label="Breed" value={form.breed} onChange={set("breed")} placeholder="e.g. KWPN, Hanoverian" required />
                    <InputField label="Age (years)" type="number" value={form.age} onChange={set("age")} placeholder="e.g. 7" />
                    <div>
                      <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Discipline</label>
                      <select
                        value={form.discipline}
                        onChange={set("discipline")}
                        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
                      >
                        <option value="">Select discipline</option>
                        {["Dressage", "Show Jumping", "Eventing", "Breeding", "Working Equitation", "Other"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <InputField label="Asking Price (€)" type="number" value={form.askingPrice} onChange={set("askingPrice")} placeholder="e.g. 150000" />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
                      Tell Us About Your Horse
                    </label>
                    <textarea
                      value={form.description}
                      onChange={set("description")}
                      placeholder="Competition record, health history, temperament, bloodlines, why are you selling..."
                      rows={5}
                      required
                      className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)] rounded-xl"
                  >
                    Submit Application <Send className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-[#4a5a70] text-center font-[family-name:var(--font-inter)]">
                    Submitting an application does not guarantee listing. All applications are reviewed by our selection committee.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
      />
    </div>
  );
}
