"use client";

import { useState } from "react";
import { User, Mail, Phone, Globe, Shield, Save, CheckCircle } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: mockUser.name ?? "",
    email: mockUser.email,
    phone: mockUser.phone ?? "",
    country: mockUser.country ?? "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">My Profile</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          Manage your personal details and account settings.
        </p>
      </div>

      {/* Avatar */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#c9a84c] flex items-center justify-center text-2xl font-bold text-[#060c1d] font-[family-name:var(--font-playfair)] shrink-0">
          {form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">{form.name}</h2>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">{form.email}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-[family-name:var(--font-inter)] font-semibold">Verified Account</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 space-y-5">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2">
          <User className="w-4 h-4 text-[#c9a84c]" />
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { field: "name", label: "Full Name", icon: User, type: "text", placeholder: "Your full name" },
            { field: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "your@email.com" },
            { field: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1 234 567 8900" },
            { field: "country", label: "Country", icon: Globe, type: "text", placeholder: "Your country" },
          ].map(({ field, label, icon: Icon, type, placeholder }) => (
            <div key={field}>
              <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a84c]/60" />
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl ${
            saved
              ? "bg-green-500 text-white"
              : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Security */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-[#c9a84c]" />
          Security
        </h2>
        <div className="space-y-3">
          <button className="w-full sm:w-auto px-6 py-3 border border-[#c9a84c]/30 text-[#c9a84c] font-semibold text-sm tracking-wider uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all font-[family-name:var(--font-inter)] rounded-xl">
            Change Password
          </button>
          <p className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
            Last changed: Never · Two-factor authentication not enabled
          </p>
        </div>
      </div>
    </div>
  );
}
