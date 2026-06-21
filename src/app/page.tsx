import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Eye, Globe, Trophy, ChevronRight, Star, TrendingUp } from "lucide-react";
import { mockHorses, mockAuctions } from "@/lib/mock-data";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { HorseCard } from "@/components/horses/horse-card";

const categories = [
  {
    key: "FUTURE_STARS",
    number: "1",
    title: "Future Stars",
    subtitle: "Young horses with global potential",
    description:
      "Carefully selected young horses with exceptional bloodlines, conformation and athletic ability. The stars of tomorrow, available today.",
    color: "bg-[#163d2a]",
    accent: "#4dcc8a",
    icon: Star,
  },
  {
    key: "COMPETITION_READY",
    number: "2",
    title: "Competition Ready",
    subtitle: "Proven. Trained. Ready to compete.",
    description:
      "Well-trained horses ready for immediate competition. Ideal for ambitious riders and professional stables seeking results now.",
    color: "bg-[#1a2d4a]",
    accent: "#4da6ff",
    icon: Trophy,
  },
  {
    key: "ELITE_SPORT",
    number: "3",
    title: "Elite Sport",
    subtitle: "Top level. Proven results.",
    description:
      "High performance sport horses competing at the highest level. For riders and teams who demand only the absolute best.",
    color: "bg-[#3d1522]",
    accent: "#ff6b8a",
    icon: Trophy,
  },
  {
    key: "BREEDING_INVESTMENT",
    number: "4",
    title: "Breeding & Investment",
    subtitle: "Genetics. Value. Legacy.",
    description:
      "Elite broodmares, proven producers and embryos. For breeders and investors building a legacy through exceptional genetics.",
    color: "bg-[#3a2800]",
    accent: "#ffb84d",
    icon: TrendingUp,
  },
];

const trustBadges = [
  { icon: Shield, label: "Vet Checked", sub: "All horses vet approved" },
  { icon: Eye, label: "Full Transparency", sub: "Videos, reports & full history" },
  { icon: Globe, label: "Live & Online Bidding", sub: "Bid from anywhere in the world" },
  { icon: Trophy, label: "Global Network", sub: "Trusted by professionals worldwide" },
];

const stats = [
  { value: "€2.4B+", label: "Total sales volume" },
  { value: "4,800+", label: "Horses sold" },
  { value: "60+", label: "Countries represented" },
  { value: "12,000+", label: "Registered bidders" },
];

export default function HomePage() {
  const featuredAuction = mockAuctions[0];
  const featuredHorses = mockHorses.filter((h) => h.featured).slice(0, 3);

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
                  Live Auction
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
                Exceptional
              </span>
              <span
                className="block text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mt-1"
                style={{ color: "#c9a84c", letterSpacing: "-0.02em" }}
              >
                Horses.
              </span>
              <span
                className="block text-4xl md:text-5xl font-medium text-white/80 leading-none mt-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                Extraordinary Futures.
              </span>
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#c9a84c]" />
              <p
                className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase font-[family-name:var(--font-inter)]"
                style={{ letterSpacing: "0.3em" }}
              >
                Curated · Verified · Global
              </p>
            </div>

            <p className="text-lg text-[#a8bfd4] max-w-xl leading-relaxed mb-10 font-[family-name:var(--font-inter)]">
              The world&apos;s most sophisticated platform for elite horse acquisition.
              Every horse hand-selected, every pedigree verified, every transaction secured.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/auctions"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all duration-300 glow-gold font-[family-name:var(--font-inter)]"
              >
                View Live Auctions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-3 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-300 font-[family-name:var(--font-inter)]"
              >
                Register to Bid
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                    {s.value}
                  </div>
                  <div className="text-xs text-[#7a8fa8] mt-1 font-[family-name:var(--font-inter)] tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c]/60 to-transparent animate-pulse" />
          <span className="text-[10px] text-[#c9a84c]/60 tracking-widest font-[family-name:var(--font-inter)] uppercase">
            Scroll
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
                  Currently Live
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {featuredAuction.title}
              </h2>
              <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
                {featuredAuction.horses.length} exceptional horses · Closing in:
              </p>
            </div>
            <div className="flex items-center gap-8">
              <CountdownTimer endDate={featuredAuction.endDate} />
              <Link
                href={`/auctions/${featuredAuction.id}`}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)]"
              >
                Bid Now <ArrowRight className="w-4 h-4" />
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
                Featured Lots
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
                Exceptional Horses,<br />
                <span style={{ color: "#c9a84c" }}>Right Now</span>
              </h2>
            </div>
            <Link
              href="/auctions"
              className="flex items-center gap-2 text-sm text-[#c9a84c] hover:text-[#e2c97e] font-semibold tracking-wider uppercase transition-colors font-[family-name:var(--font-inter)] group"
            >
              View All Lots
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
              Four Segments. One Standard: Global.
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Every Horse Has a Story.<br />
              <span style={{ color: "#c9a84c" }}>Find Yours.</span>
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
                    Browse <ChevronRight className="w-3 h-3" />
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
              The Global Standard
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Why Professionals<br />
              <span style={{ color: "#c9a84c" }}>Choose Us</span>
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
              {[
                { step: "01", title: "Register Free", desc: "Create your account in 2 minutes. Verified and approved within 24 hours." },
                { step: "02", title: "Browse & Discover", desc: "Explore our curated catalog with full video, vet reports, and bloodline analysis." },
                { step: "03", title: "Bid Live or Online", desc: "Place bids in real-time from anywhere in the world with our live bidding system." },
                { step: "04", title: "Secure Your Horse", desc: "Our team manages the full transaction, transport, and aftercare support." },
              ].map((item) => (
                <div key={item.step} className="relative text-center lg:text-left">
                  <div className="relative inline-flex w-20 h-20 rounded-full border-2 border-[#c9a84c]/30 items-center justify-center mb-4 mx-auto lg:mx-0 bg-[#0a1428]">
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
            src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1920&q=90"
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
            Join the Global Standard
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
            Ready to Find Your<br />
            <span style={{ color: "#c9a84c" }}>Perfect Partner?</span>
          </h2>
          <p className="text-lg text-[#a8bfd4] max-w-xl mx-auto mb-10 font-[family-name:var(--font-inter)]">
            Register today and gain access to our exclusive catalog of verified,
            vet-checked sport horses from the world&apos;s top producers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)]"
            >
              Create Free Account
            </Link>
            <Link
              href="/auctions"
              className="px-10 py-4 border border-[#c9a84c]/50 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all font-[family-name:var(--font-inter)]"
            >
              View Current Auctions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
