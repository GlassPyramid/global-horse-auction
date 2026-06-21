"use client";

import { useState } from "react";
import { User, Mail, Phone, Globe, Shield, Save, CheckCircle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  country: string;
  role: string;
  verified: boolean;
}

export function ProfileForm({ userId, email, fullName, phone, country, role, verified }: Props) {
  const [form, setForm] = useState({ fullName, phone, country });
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwState, setPwState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwError, setPwError] = useState("");

  const handleSave = async () => {
    setSaveState("loading");
    const res = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: form.fullName, phone: form.phone, country: form.country }),
    });
    setSaveState(res.ok ? "success" : "error");
    if (res.ok) setTimeout(() => setSaveState("idle"), 3000);
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords don't match."); return; }
    if (pwForm.newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwState("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
    if (error) { setPwError(error.message); setPwState("error"); }
    else { setPwState("success"); setPwForm({ current: "", newPw: "", confirm: "" }); setTimeout(() => setPwState("idle"), 3000); }
  };

  const initials = form.fullName
    ? form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? "?";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">My Profile</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">Manage your personal details and account settings.</p>
      </div>

      {/* Avatar */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#c9a84c] flex items-center justify-center text-2xl font-bold text-[#060c1d] font-[family-name:var(--font-playfair)] shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">{form.fullName || email}</h2>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">{email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)] ${
              role === "ADMIN" ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20" : "bg-blue-400/10 text-blue-400 border-blue-400/20"
            }`}>{role}</span>
            {verified && (
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-400 font-[family-name:var(--font-inter)] font-semibold">Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 space-y-5">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2">
          <User className="w-4 h-4 text-[#c9a84c]" /> Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { field: "fullName", label: "Full Name", icon: User, type: "text", placeholder: "Your full name", value: form.fullName },
            { field: "email", label: "Email Address", icon: Mail, type: "email", placeholder: email, value: email, readOnly: true },
            { field: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1 234 567 8900", value: form.phone },
            { field: "country", label: "Country", icon: Globe, type: "text", placeholder: "Your country", value: form.country },
          ].map(({ field, label, icon: Icon, type, placeholder, value, readOnly }) => (
            <div key={field}>
              <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a84c]/60" />
                <input
                  type={type}
                  value={value}
                  readOnly={readOnly}
                  onChange={readOnly ? undefined : (e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm font-[family-name:var(--font-inter)] focus:outline-none transition-colors placeholder:text-[#4a5a70] ${
                    readOnly
                      ? "bg-[#0a1428] border-[#c9a84c]/10 text-[#4a5a70] cursor-not-allowed"
                      : "bg-[#060c1d] border-[#c9a84c]/20 text-white focus:border-[#c9a84c]"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={saveState === "loading" || saveState === "success"}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl disabled:opacity-60 ${
            saveState === "success" ? "bg-green-500 text-white" : saveState === "error" ? "bg-red-500/20 border border-red-500/30 text-red-400" : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
          }`}>
          {saveState === "success" ? <><CheckCircle className="w-4 h-4" /> Saved!</> : saveState === "loading" ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {/* Change password */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 space-y-5">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#c9a84c]" /> Change Password
        </h2>
        {pwError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-[family-name:var(--font-inter)]">{pwError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">New Password</label>
            <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))}
              placeholder="Minimum 8 characters"
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]" />
          </div>
          <div>
            <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Confirm Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat new password"
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]" />
          </div>
        </div>
        <button onClick={handlePasswordChange} disabled={pwState === "loading" || pwState === "success"}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl border disabled:opacity-60 ${
            pwState === "success" ? "bg-green-500 text-white border-transparent" : "border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10"
          }`}>
          {pwState === "success" ? <><CheckCircle className="w-4 h-4" /> Password Updated!</> : pwState === "loading" ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
