"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-[#060c1d] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl font-bold tracking-widest text-white font-[family-name:var(--font-playfair)]" style={{ letterSpacing: "0.2em" }}>
            GLOBAL
          </div>
          <div className="text-sm font-bold tracking-widest" style={{ color: "#c9a84c", letterSpacing: "0.35em", fontFamily: "var(--font-inter)" }}>
            HORSE AUCTION
          </div>
        </div>

        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/15 p-8">
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-8">
            Sign in to access your bidding portal.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a84c]/60" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a84c]/60" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Your password"
                  className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)] rounded-xl"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#c9a84c]/10 text-center">
            <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              New to Global Horse Auction?{" "}
              <Link href="/register" className="text-[#c9a84c] hover:text-[#e2c97e] font-semibold transition-colors">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
