"use client";

import { useState } from "react";
import { Mail, Phone, Globe, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSent(true);
  };

  const contactItems = [
    { icon: Mail, label: t('contact', 'emailLabel'), value: "info@globalhorseauction.com", href: "mailto:info@globalhorseauction.com" },
    { icon: Phone, label: t('contact', 'phoneLabel'), value: "+31 20 123 4567", href: "tel:+31201234567" },
    { icon: Globe, label: t('contact', 'networkLabel'), value: t('contact', 'networkValue'), href: null },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            {t('contact', 'getInTouch')}
          </p>
          <h1 className="text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            {t('contact', 'title')}
          </h1>
          <p className="text-lg text-[#7a8fa8] max-w-xl mx-auto font-[family-name:var(--font-inter)]">
            {t('contact', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-5 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <div className="text-xs text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mb-1">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-white hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="w-12 h-12 text-[#c9a84c] mb-4" />
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">{t('contact', 'messageSent')}</h3>
                <p className="text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                  {t('contact', 'replyTime')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{t('contact', 'fullName')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder={t('contact', 'fullNamePlaceholder')}
                      required
                      className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{t('contact', 'emailAddress')}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{t('contact', 'subject')}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder={t('contact', 'subjectPlaceholder')}
                    className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">{t('contact', 'message')}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={t('contact', 'messagePlaceholder')}
                    rows={6}
                    required
                    className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)] rounded-xl"
                >
                  {t('contact', 'sendMessage')} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
