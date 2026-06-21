"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Phone, Globe, ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const steps = ["Account", "Personal", "Verify"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError("");

    if (step === 0) {
      if (!form.email || !form.password) return setError("Email and password are required.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!form.name) return setError("Full name is required.");
      if (!form.agreeTerms) return setError("You must agree to the terms.");
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, phone: form.phone, country: form.country },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setStep(2);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#060c1d] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-3xl font-bold tracking-widest text-white font-[family-name:var(--font-playfair)]" style={{ letterSpacing: "0.2em" }}>
            GLOBAL
          </div>
          <div className="text-sm font-bold tracking-widest" style={{ color: "#c9a84c", letterSpacing: "0.35em", fontFamily: "var(--font-inter)" }}>
            HORSE AUCTION
          </div>
        </div>

        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all font-[family-name:var(--font-inter)] ${
                    i < step
                      ? "bg-[#c9a84c] border-[#c9a84c] text-[#060c1d]"
                      : i === step
                      ? "border-[#c9a84c] text-[#c9a84c]"
                      : "border-[#c9a84c]/20 text-[#4a5a70]"
                  }`}
                >
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-[family-name:var(--font-inter)] ${i === step ? "text-[#c9a84c]" : "text-[#4a5a70]"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-px mx-2 mb-4 transition-all ${i < step ? "bg-[#c9a84c]" : "bg-[#c9a84c]/15"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-[family-name:var(--font-inter)]">
              {error}
            </div>
          )}

          {step === 0 && (
            <>
              <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                Create Your Account
              </h1>
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8">
                Join 12,000+ professionals who trust Global Horse Auction.
              </p>
              <div className="space-y-5">
                <Field label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Password" icon={Lock}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </Field>
                <Field label="Confirm Password" icon={Lock}>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="Repeat password"
                    className={inputClass}
                  />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                Personal Details
              </h1>
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8">
                Required for account verification and bid notifications.
              </p>
              <div className="space-y-5">
                <Field label="Full Name" icon={User}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full legal name"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                  />
                </Field>
                <Field label="Country" icon={Globe}>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    placeholder="Your country of residence"
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm((f) => ({ ...f, agreeTerms: e.target.checked }))}
                    className="mt-0.5 accent-[#c9a84c]"
                  />
                  <span className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#c9a84c] hover:underline">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-[#c9a84c] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
                Account Created!
              </h1>
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8">
                Welcome to Global Horse Auction. We&apos;ve sent a verification email to{" "}
                <span className="text-[#c9a84c]">{form.email}</span>.
              </p>
              <button
                onClick={() => router.push("/portal")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)] rounded-xl"
              >
                Go to My Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step < 2 && (
            <button
              onClick={handleContinue}
              disabled={loading}
              className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : <><span>{step === 0 ? "Continue" : "Create Account"}</span> <ArrowRight className="w-4 h-4" /></>}
            </button>
          )}

          {step === 0 && (
            <div className="mt-6 pt-6 border-t border-[#c9a84c]/10 text-center">
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#c9a84c] hover:text-[#e2c97e] font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-[#060c1d] border-transparent rounded-xl pl-11 pr-4 py-3.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none transition-colors placeholder:text-[#4a5a70]";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
        {label}
      </label>
      <div className="relative border border-[#c9a84c]/20 rounded-xl focus-within:border-[#c9a84c] transition-colors">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a84c]/60" />
        {children}
      </div>
    </div>
  );
}
