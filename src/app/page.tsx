import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Eye, Globe, Trophy, ChevronRight, Star, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toHorse, toAuction, type DbHorse, type DbAuction } from "@/lib/types";
import { mockHorses, mockAuctions } from "@/lib/mock-data";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { HorseCard } from "@/components/horses/horse-card";
import { getLang } from "@/lib/lang";
import { t } from "@/lib/i18n";

const stats = [
  { value: "€2.4B+", labelKey: "statTotalSales" },
  { value: "4,800+", labelKey: "statHorsesSold" },
  { value: "60+", labelKey: "statCountries" },
  { value: "12,000+", labelKey: "statBidders" },
];

export default async function HomePage() {
  const lang = await getLang();
  const supabase = await createClient();

  const [{ data: auctionRows }, { data: horseRows }] = await Promise.all([
    supabase
      .from("auctions")
      .select("*, horses(*, bids(id, amount, bidder_id, created_at))")
      .eq("status", "LIVE")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("horses")
      .select("*, bids(id, amount, bidder_id, created_at)")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const featuredAuction =
    auctionRows && auctionRows.length > 0
      ? toAuction(auctionRows[0] as unknown as DbAuction)
      : mockAuctions[0];

  const featuredHorses =
    horseRows && horseRows.length > 0
      ? horseRows.map((h) => toHorse(h as unknown as DbHorse))
      : mockHorses.filter((h) => h.featured).slice(0, 3);

  const categories = [
    {
      key: "FUTURE_STARS",
      number: "1",
      title: t(lang, 'home', 'cat1title'),
      subtitle: t(lang, 'home', 'cat1subtitle'),
      description: t(lang, 'home', 'cat1desc'),
      color: "bg-[#163d2a]",
      accent: "#4dcc8a",
      icon: Star,
    },
    {
      key: "COMPETITION_READY",
      number: "2",
      title: t(lang, 'home', 'cat2title'),
      subtitle: t(lang, 'home', 'cat2subtitle'),
      description: t(lang, 'home', 'cat2desc'),
      color: "bg-[#1a2d4a]",
      accent: "#4da6ff",
      icon: Trophy,
    },
    {
      key: "ELITE_SPORT",
      number: "3",
      title: t(lang, 'home', 'cat3title'),
      subtitle: t(lang, 'home', 'cat3subtitle'),
      description: t(lang, 'home', 'cat3desc'),
      color: "bg-[#3d1522]",
      accent: "#ff6b8a",
      icon: Trophy,
    },
    {
      key: "BREEDING_INVESTMENT",
      number: "4",
      title: t(lang, 'home', 'cat4title'),
      subtitle: t(lang, 'home', 'cat4subtitle'),
      description: t(lang, 'home', 'cat4desc'),
      color: "bg-[#3a2800]",
      accent: "#ffb84d",
      icon: TrendingUp,
    },
  ];

  const trustBadges = [
    { icon: Shield, label: t(lang, 'home', 'vetChecked'), sub: t(lang, 'home', 'vetCheckedSub') },
    { icon: Eye, label: t(lang, 'home', 'fullTransparency'), sub: t(lang, 'home', 'fullTransparencySub') },
    { icon: Globe, label: t(lang, 'home', 'liveBidding'), sub: t(lang, 'home', 'liveBiddingSub') },
    { icon: Trophy, label: t(lang, 'home', 'globalNetwork'), sub: t(lang, 'home', 'globalNetworkSub') },
  ];

  const howToSteps = [
    { step: "01", title: t(lang, 'home', 'step1Title'), desc: t(lang, 'home', 'step1Desc') },
    { step: "02", title: t(lang, 'home', 'step2Title'), desc: t(lang, 'home', 'step2Desc') },
    { step: "03", title: t(lang, 'home', 'step3Title'), desc: t(lang, 'home', 'step3Desc') },
    { step: "04", title: t(lang, 'home', 'step4Title'), desc: t(lang, 'home', 'step4Desc') },
  ];

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=95"
            alt="Global Horse Auction — Elite horses"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060c1d]/80 via-transparent to-[#060c1d]/40" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-300 tracking-widest font-[family-name:var(--font-inter)] uppercase">
                  {t(lang, 'home', 'liveNow')}
                </span>
              </span>
              <span className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] tracking-wider">
                {featuredAuction.title}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] mb-6">
              <span
                className="block text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight text-glow-gold"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t(lang, 'home', 'heroTitle3')}
              </span>
              <span
                className="block text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mt-1"
                style={{ color: "#c9a84c", letterSpacing: "-0.02em" }}
              >
                {t(lang, 'home', 'heroTitle4')}
              </span>
              <span
                className="block text-4xl md:text-5xl font-medium text-white/80 leading-none mt-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                {t(lang, 'home', 'heroTitle5')}
              </span>
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#c9a84c]" />
              <p
                className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase font-[family-name:var(--font-inter)]"
                style={{ letterSpacing: "0.3em" }}
              >
                {t(lang, 'home', 'heroCurated')}
              </p>
            </div>

            <p className="text-lg text-[#a8bfd4] max-w-xl leading-relaxed mb-10 font-[family-name:var(--font-inter)]">
              {t(lang, 'home', 'heroDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/auctions"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all duration-300 glow-gold font-[family-name:var(--font-inter)]"
              >
                {t(lang, 'home', 'viewLiveAuctions')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-3 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-300 font-[family-name:var(--font-inter)]"
              >
                {t(lang, 'home', 'registerToBid')}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.labelKey}>
                  <div className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                    {s.value}
                  </div>
                  <div className="text-xs text-[#7a8fa8] mt-1 font-[family-name:var(--font-inter)] tracking-wide">
                    {t(lang, 'home', s.labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c]/60 to-transparent animate-pulse" />
          <span className="text-[10px] text-[#c9a84c]/60 tracking-widest font-[family-name:var(--font-inter)] uppercase">
            {t(lang, 'home', 'scroll')}
          </span>
        </div>
      </section>

      {/* ─── LIVE AUCTION BANNER ─────────────────────────────── */}
      <section className="bg-[#0a1428] border-y border-[#c9a84c]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-400 tracking-widest font-[family-name:var(--font-inter)] uppercase">
                  {t(lang, 'home', 'currentlyLive')}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {featuredAuction.title}
              </h2>
              <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
                {featuredAuction.horses.length} {t(lang, 'home', 'closingIn')}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <CountdownTimer endDate={featuredAuction.endDate} />
              <Link
                href={`/auctions/${featuredAuction.id}`}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)]"
              >
                {t(lang, 'home', 'bidNow')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED HORSES ─────────────────────────────────── */}
      <section className="py-24 bg-[#060c1d]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6">
            <div>
              <p
                className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]"
                style={{ letterSpacing: "0.3em" }}
              >
                {t(lang, 'home', 'featuredLots')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {t(lang, 'home', 'horsesRightNow1')}<br />
                <span style={{ color: "#c9a84c" }}>{t(lang, 'home', 'horsesRightNow2')}</span>
              </h2>
            </div>
            <Link
              href="/auctions"
              className="flex items-center gap-2 text-sm text-[#c9a84c] hover:text-[#e2c97e] font-semibold tracking-wider uppercase transition-colors font-[family-name:var(--font-inter)] group"
            >
              {t(lang, 'home', 'viewAllLots')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHorses.map((horse) => (
              <HorseCard key={horse.id} horse={horse} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────── */}
      <section className="py-24 bg-[#040a18]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]"
              style={{ letterSpacing: "0.3em" }}
            >
              {t(lang, 'home', 'fourSegments')}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
              {t(lang, 'home', 'everyHorse1')}<br />
              <span style={{ color: "#c9a84c" }}>{t(lang, 'home', 'everyHorse2')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/horses?category=${cat.key}`}
                className={`group relative overflow-hidden rounded-xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-all duration-500 ${cat.color} p-6 hover:scale-[1.02]`}
              >
                <div className="relative z-10">
                  <div
                    className="text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]"
                    style={{ color: cat.accent + "40" }}
                  >
                    {cat.number}.
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white font-[family-name:var(--font-playfair)]">
                    {cat.title}
                  </h3>
                  <p
                    className="text-xs font-bold tracking-wider uppercase mb-3 font-[family-name:var(--font-inter)]"
                    style={{ color: cat.accent }}
                  >
                    {cat.subtitle}
                  </p>
                  <p className="text-sm text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">
                    {cat.description}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-6 text-xs font-bold tracking-wider uppercase font-[family-name:var(--font-inter)] group-hover:gap-3 transition-all"
                    style={{ color: cat.accent }}
                  >
                    {t(lang, 'home', 'browse')} <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
                <div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: cat.accent, filter: "blur(24px)" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#060c1d]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]"
              style={{ letterSpacing: "0.3em" }}
            >
              {t(lang, 'home', 'theGlobalStandard')}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
              {t(lang, 'home', 'whyProfessionals1')}<br />
              <span style={{ color: "#c9a84c" }}>{t(lang, 'home', 'whyProfessionals2')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center p-6 rounded-xl border border-[#c9a84c]/10 bg-[#0a1428]/50 hover:border-[#c9a84c]/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-4 group-hover:border-[#c9a84c]/50 group-hover:bg-[#c9a84c]/15 transition-all">
                  <badge.icon className="w-6 h-6 text-[#c9a84c]" />
                </div>
                <h4 className="font-bold text-white mb-1 font-[family-name:var(--font-inter)]">
                  {badge.label}
                </h4>
                <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                  {badge.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent hidden lg:block" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {howToSteps.map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative inline-flex w-20 h-20 rounded-full border-2 border-[#c9a84c]/30 items-center justify-center mb-4 mx-auto bg-[#0a1428]">
                    <span className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1920&q=90"
            alt="Elite sport horses"
            fill
            className="object-cover object-center opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#060c1d]/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]"
            style={{ letterSpacing: "0.3em" }}
          >
            {t(lang, 'home', 'joinGlobalStandard')}
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
            {t(lang, 'home', 'ctaTitle1')}<br />
            <span style={{ color: "#c9a84c" }}>{t(lang, 'home', 'ctaTitle2')}</span>
          </h2>
          <p className="text-lg text-[#a8bfd4] max-w-xl mx-auto mb-10 font-[family-name:var(--font-inter)]">
            {t(lang, 'home', 'ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)]"
            >
              {t(lang, 'home', 'createFreeAccount')}
            </Link>
            <Link
              href="/auctions"
              className="px-10 py-4 border border-[#c9a84c]/50 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all font-[family-name:var(--font-inter)]"
            >
              {t(lang, 'home', 'viewCurrentAuctions')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
