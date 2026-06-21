"use client";

import { useState } from "react";
import { Bell, Shield, Globe, Trash2, Save, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailOutbid: true,
    emailAuction: true,
    emailNewsletter: false,
    smsOutbid: false,
    twoFactor: false,
    currency: "EUR",
    language: "EN",
  });

  const toggle = (field: string) =>
    setPrefs((p) => ({ ...p, [field]: !p[field as keyof typeof p] }));

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
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Settings</h1>
      </div>

      {/* Notifications */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-[#c9a84c]" /> Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: "emailOutbid", label: "Email when outbid", desc: "Receive an email immediately when someone outbids you" },
            { key: "emailAuction", label: "Auction reminders", desc: "Reminder emails 24h and 1h before auctions you've bid in close" },
            { key: "emailNewsletter", label: "New auction announcements", desc: "Be the first to know when new collections are announced" },
            { key: "smsOutbid", label: "SMS when outbid", desc: "Text message alert when outbid (requires verified phone)" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#c9a84c]/8 last:border-0">
              <div>
                <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{item.label}</div>
                <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">{item.desc}</div>
              </div>
              <Toggle
                checked={prefs[item.key as keyof typeof prefs] as boolean}
                onChange={() => toggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-[#c9a84c]" /> Security
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-[#c9a84c]/8">
          <div>
            <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">Two-Factor Authentication</div>
            <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">Add an extra layer of security to your account</div>
          </div>
          <Toggle checked={prefs.twoFactor} onChange={() => toggle("twoFactor")} />
        </div>
        <div className="pt-4">
          <button className="px-5 py-2.5 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-semibold rounded-xl hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
            Change Password
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
        <h2 className="font-bold text-white font-[family-name:var(--font-inter)] flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-[#c9a84c]" /> Preferences
        </h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Default Currency</label>
            <select
              value={prefs.currency}
              onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))}
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
            >
              {["EUR", "USD", "GBP", "CHF", "AED"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Language</label>
            <select
              value={prefs.language}
              onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
              className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
            >
              {[["EN", "English"], ["NL", "Nederlands"], ["DE", "Deutsch"], ["FR", "Français"], ["ES", "Español"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-8 py-3 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl ${
          saved ? "bg-green-500 text-white" : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] glow-gold"
        }`}
      >
        {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>

      {/* Danger zone */}
      <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
        <h2 className="font-bold text-red-400 font-[family-name:var(--font-inter)] flex items-center gap-2 mb-3">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-4">
          Deleting your account is permanent and cannot be undone. All bid history will be retained for legal purposes.
        </p>
        <button className="px-5 py-2.5 border border-red-400/30 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-400/10 transition-all font-[family-name:var(--font-inter)]">
          Delete Account
        </button>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-[#c9a84c]" : "bg-[#1a2d4a]"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
