"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Star, Trophy, Shield, TrendingUp, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

type TFn = (section: TranslationKey, key: string) => string;

const STEPS = 4;

type Form = {
  // Step 1
  name: string; breed: string; age: string; gender: string; color: string;
  height_cm: string; country_origin: string; discipline: string; category: string;
  sire: string; dam: string; studbook_number: string;
  // Step 2
  ueln: string; passport_type: string; vet_check_date: string;
  vaccinations_current: boolean; xrays_available: boolean;
  health_notes: string; competition_level: string; competition_results: string;
  // Step 3
  images: string[]; video_url: string;
  // Step 4
  asking_price: string; reserve_price: string; accept_offers: boolean; description: string;
};

const empty: Form = {
  name: "", breed: "", age: "", gender: "MARE", color: "", height_cm: "",
  country_origin: "", discipline: "Dressage", category: "COMPETITION_READY",
  sire: "", dam: "", studbook_number: "",
  ueln: "", passport_type: "", vet_check_date: "",
  vaccinations_current: false, xrays_available: false,
  health_notes: "", competition_level: "", competition_results: "",
  images: [], video_url: "",
  asking_price: "", reserve_price: "", accept_offers: true, description: "",
};

export default function SellPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null | "loading">("loading");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const set = (key: keyof Form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const disciplines = [
    t('sell', 'dressage'), t('sell', 'showJumping'), t('sell', 'eventing'),
    t('sell', 'breeding'), t('sell', 'workingEquitation'), t('sell', 'western'),
    t('sell', 'endurance'), t('sell', 'other'),
  ];
  const genders = [t('sell', 'mare'), t('sell', 'stallion'), t('sell', 'gelding')];
  const genderValues = ["MARE", "STALLION", "GELDING"];
  const categories = [
    { value: "FUTURE_STARS", label: t('sell', 'catFutureStars') },
    { value: "COMPETITION_READY", label: t('sell', 'catCompetitionReady') },
    { value: "ELITE_SPORT", label: t('sell', 'catEliteSport') },
    { value: "BREEDING_INVESTMENT", label: t('sell', 'catBreeding') },
  ];

  const stepLabels = [t('sell', 'step1'), t('sell', 'step2'), t('sell', 'step3'), t('sell', 'step4')];

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const payload = {
      ...form,
      age: form.age ? parseInt(form.age) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      asking_price: form.asking_price ? parseFloat(form.asking_price) : null,
      reserve_price: form.reserve_price ? parseFloat(form.reserve_price) : null,
    };
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong");
    }
    setSubmitting(false);
  };

  const sellingPoints = [
    { icon: Star, title: t('sell', 'globalReach'), desc: t('sell', 'globalReachDesc') },
    { icon: Trophy, title: t('sell', 'premiumPrices'), desc: t('sell', 'premiumPricesDesc') },
    { icon: Shield, title: t('sell', 'secureTransactions'), desc: t('sell', 'secureTransactionsDesc') },
    { icon: TrendingUp, title: t('sell', 'expertMarketing'), desc: t('sell', 'expertMarketingDesc') },
  ];

  const requirements = [
    t('sell', 'req1'), t('sell', 'req2'), t('sell', 'req3'),
    t('sell', 'req4'), t('sell', 'req5'), t('sell', 'req6'),
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <section className="py-20 bg-[#0a1428] border-b border-[#c9a84c]/10 text-center">
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
          {t('sell', 'listWith')}
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
          {t('sell', 'title')}
        </h1>
        <p className="text-lg text-[#7a8fa8] max-w-xl mx-auto font-[family-name:var(--font-inter)]">
          {t('sell', 'subtitle')}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: benefits */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">
                {t('sell', 'whySell')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sellingPoints.map((sp) => (
                  <div key={sp.title} className="p-5 bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all">
                    <sp.icon className="w-5 h-5 text-[#c9a84c] mb-3" />
                    <h4 className="font-bold text-white mb-1 font-[family-name:var(--font-inter)] text-sm">{sp.title}</h4>
                    <p className="text-xs text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">{sp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
                {t('sell', 'requirements')}
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

            <div className="p-6 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/20">
              <h3 className="font-bold text-white font-[family-name:var(--font-inter)] mb-3">{t('sell', 'commission')}</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{t('sell', 'commissionRate')}</span>
                <span className="text-[#7a8fa8] text-sm font-[family-name:var(--font-inter)] mb-1">{t('sell', 'commissionSub')}</span>
              </div>
              <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{t('sell', 'commissionDesc')}</p>
            </div>
          </div>

          {/* Right: form or login gate */}
          <div>
            {user === "loading" ? (
              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-8 flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
              </div>
            ) : !user ? (
              <LoginGate t={t} />
            ) : submitted ? (
              <SuccessCard t={t} router={router} />
            ) : (
              <SubmissionForm
                step={step} setStep={setStep} form={form} set={set}
                stepLabels={stepLabels} disciplines={disciplines}
                genders={genders} genderValues={genderValues} categories={categories}
                submitting={submitting} error={error}
                handleSubmit={handleSubmit} t={t}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginGate({ t }: { t: TFn }) {
  return (
    <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-6">
        <Shield className="w-8 h-8 text-[#c9a84c]" />
      </div>
      <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
        {t('sell', 'loginRequired')}
      </h2>
      <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8 leading-relaxed">
        {t('sell', 'loginRequiredDesc')}
      </p>
      <Link href="/register?redirectTo=/sell"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
        {t('sell', 'createAccount')} <ArrowRight className="w-4 h-4" />
      </Link>
      <div className="mt-4">
        <Link href="/login?redirectTo=/sell" className="text-sm text-[#c9a84c] hover:text-[#e2c97e] font-[family-name:var(--font-inter)]">
          {t('sell', 'alreadyHaveAccount')}
        </Link>
      </div>
    </div>
  );
}

function SuccessCard({ t, router }: { t: TFn; router: ReturnType<typeof useRouter> }) {
  return (
    <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-[#c9a84c]" />
      </div>
      <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
        {t('sell', 'successTitle')}
      </h2>
      <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8 leading-relaxed">
        {t('sell', 'successDesc')}
      </p>
      <button onClick={() => router.push("/portal/horses")}
        className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
        {t('sell', 'viewMyHorses')} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SubmissionForm({
  step, setStep, form, set, stepLabels, disciplines, genders, genderValues, categories,
  submitting, error, handleSubmit, t,
}: {
  step: number; setStep: (n: number) => void; form: Form;
  set: (k: keyof Form, v: unknown) => void;
  stepLabels: string[]; disciplines: string[]; genders: string[];
  genderValues: string[]; categories: { value: string; label: string }[];
  submitting: boolean; error: string;
  handleSubmit: () => void; t: TFn;
}) {
  const inp = "w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]";
  const lbl = "text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block";

  const field = (label: string, key: keyof Form, type = "text", placeholder = "") => (
    <div>
      <label className={lbl}>{label}</label>
      <input type={type} value={form[key] as string} placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)} className={inp} />
    </div>
  );

  const selectField = (label: string, key: keyof Form, options: { value: string; label: string }[]) => (
    <div>
      <label className={lbl}>{label}</label>
      <select value={form[key] as string} onChange={(e) => set(key, e.target.value)} className={inp}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const checkbox = (label: string, key: keyof Form) => (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <input type="checkbox" checked={form[key] as boolean}
        onChange={(e) => set(key, e.target.checked)}
        className="w-4 h-4 accent-[#c9a84c]" />
      <span className="text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">{label}</span>
    </label>
  );

  return (
    <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-8">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all font-[family-name:var(--font-inter)] ${
                i < step ? "bg-[#c9a84c] border-[#c9a84c] text-[#060c1d]"
                : i === step ? "border-[#c9a84c] text-[#c9a84c]"
                : "border-[#c9a84c]/20 text-[#4a5a70]"
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-[family-name:var(--font-inter)] text-center leading-tight ${i === step ? "text-[#c9a84c]" : "text-[#4a5a70]"}`}>
                {label}
              </span>
            </div>
            {i < STEPS - 1 && <div className={`h-px flex-1 mx-1 mb-4 transition-all ${i < step ? "bg-[#c9a84c]" : "bg-[#c9a84c]/15"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-[family-name:var(--font-inter)]">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field(t('sell', 'horseName'), 'name', 'text', 'e.g. Floriano')}
            {field(t('sell', 'breed'), 'breed', 'text', 'e.g. KWPN')}
            {field(t('sell', 'ageYears'), 'age', 'number', 'e.g. 7')}
            {selectField(t('sell', 'gender'), 'gender', genders.map((g, i) => ({ value: genderValues[i], label: g })))}
            {field(t('sell', 'color'), 'color', 'text', 'e.g. Bay')}
            {field(t('sell', 'heightCm'), 'height_cm', 'number', 'e.g. 168')}
            {field(t('sell', 'countryOrigin'), 'country_origin', 'text', 'e.g. Netherlands')}
            {selectField(t('sell', 'discipline'), 'discipline', disciplines.map(d => ({ value: d, label: d })))}
          </div>
          {selectField(t('sell', 'category'), 'category', categories)}
          <div className="pt-2 border-t border-[#c9a84c]/10">
            <p className={lbl}>Bloodlines</p>
            <div className="grid grid-cols-2 gap-4">
              {field(t('sell', 'sire'), 'sire', 'text', 'e.g. Vivaldi')}
              {field(t('sell', 'dam'), 'dam', 'text', 'e.g. Rosamunde')}
              {field(t('sell', 'studbookNumber'), 'studbook_number', 'text', 'e.g. NL 123456')}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Health & Certs */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field(t('sell', 'ueln'), 'ueln', 'text', 'e.g. 528003200012345')}
            {field(t('sell', 'passportType'), 'passport_type', 'text', 'e.g. KWPN')}
            {field(t('sell', 'vetCheckDate'), 'vet_check_date', 'date')}
            {field(t('sell', 'competitionLevel'), 'competition_level', 'text', 'e.g. 1.40m / Z2')}
          </div>
          <div className="space-y-2 pt-2">
            {checkbox(t('sell', 'vaccinationsCurrent'), 'vaccinations_current')}
            {checkbox(t('sell', 'xraysAvailable'), 'xrays_available')}
            {checkbox(t('sell', 'acceptOffers'), 'accept_offers')}
          </div>
          <div>
            <label className={lbl}>{t('sell', 'healthNotes')}</label>
            <textarea value={form.health_notes} onChange={e => set('health_notes', e.target.value)}
              rows={3} className={`${inp} resize-none`} placeholder="Any health remarks, surgeries, management requirements..." />
          </div>
          <div>
            <label className={lbl}>{t('sell', 'competitionResults')}</label>
            <textarea value={form.competition_results} onChange={e => set('competition_results', e.target.value)}
              rows={3} className={`${inp} resize-none`} placeholder="Competition record, notable results, rankings..." />
          </div>
        </div>
      )}

      {/* Step 3: Media */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className={lbl}>{t('sell', 'photos')} ({form.images.length}/20)</label>
            <ImageUpload urls={form.images} onChange={(urls) => set('images', urls)} bucket="horse-images" maxFiles={20} />
          </div>
          <div>
            <label className={lbl}>{t('sell', 'videoUrl')}</label>
            <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
              placeholder={t('sell', 'videoUrlPlaceholder')} className={inp} />
          </div>
        </div>
      )}

      {/* Step 4: Pricing & Description */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field(t('sell', 'askingPrice'), 'asking_price', 'number', 'e.g. 150000')}
            {field(t('sell', 'reservePrice'), 'reserve_price', 'number', 'e.g. 120000')}
          </div>
          <div>
            <label className={lbl}>{t('sell', 'description')}</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={6} className={`${inp} resize-none`} placeholder={t('sell', 'descriptionPlaceholder')} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            className="px-5 py-3 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-bold rounded-xl hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] tracking-wider uppercase">
            {t('sell', 'back')}
          </button>
        )}
        {step < STEPS - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
            {t('sell', 'next')} <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl disabled:opacity-50">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('sell', 'submitting')}</> : t('sell', 'submit')}
          </button>
        )}
      </div>
    </div>
  );
}
