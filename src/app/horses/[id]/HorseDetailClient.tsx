"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ChevronLeft, ChevronRight, Gavel, Clock,
  Globe, Share2, Play, CheckCircle, Shield, TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass, heightToCm } from "@/lib/utils";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { cn } from "@/lib/utils";
import type { Horse, Auction } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

type Bid = { id: string; amount: number; userId: string; createdAt: Date };

interface Props {
  horse: Horse;
  auction: Auction | null;
  isAuthenticated: boolean;
}

export function HorseDetailClient({ horse, auction, isAuthenticated }: Props) {
  const { t } = useLanguage();
  const images = JSON.parse(horse.images) as string[];
  const [activeImage, setActiveImage] = useState(0);
  const [watched, setWatched] = useState(false);
  const [bids, setBids] = useState<Bid[]>(horse.bids);
  const [currentPrice, setCurrentPrice] = useState(horse.currentPrice);
  const [bidAmount, setBidAmount] = useState(horse.currentPrice + 5000);
  const [bidState, setBidState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bidError, setBidError] = useState("");
  const [lightbox, setLightbox] = useState(false);

  const minBid = currentPrice + 1000;
  const isLive = auction?.status === "LIVE";

  const genderLabel: Record<string, string> = {
    STALLION: t('horseDetail', 'stallion'),
    MARE: t('horseDetail', 'mare'),
    GELDING: t('horseDetail', 'gelding'),
  };

  const viewLabels = [
    t('horseDetail', 'leftView'),
    t('horseDetail', 'rightView'),
    t('horseDetail', 'frontView'),
    t('horseDetail', 'movement'),
    t('horseDetail', 'detail'),
    t('horseDetail', 'closeUp'),
    t('horseDetail', 'action'),
    t('horseDetail', 'profile'),
  ];

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`horse-bids-${horse.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "bids", filter: `horse_id=eq.${horse.id}` },
        (payload) => {
          const b = payload.new as { id: string; amount: number; bidder_id: string; created_at: string };
          setBids((prev) => [{ id: b.id, amount: Number(b.amount), userId: b.bidder_id, createdAt: new Date(b.created_at) }, ...prev]);
          setCurrentPrice(Number(b.amount));
          setBidAmount(Number(b.amount) + 5000);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [horse.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActiveImage(p => Math.min(images.length - 1, p + 1));
      if (e.key === "ArrowLeft") setActiveImage(p => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  const handleBid = async () => {
    if (!isAuthenticated) { window.location.href = `/login?redirectTo=/horses/${horse.id}`; return; }
    if (bidAmount < minBid) return;
    setBidState("loading");
    setBidError("");
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horse_id: horse.id, amount: bidAmount, currency: horse.currency }),
      });
      const data = await res.json();
      if (!res.ok) { setBidError(data.error ?? "Bid failed."); setBidState("error"); setTimeout(() => setBidState("idle"), 3000); }
      else { setBidState("success"); setTimeout(() => setBidState("idle"), 3000); }
    } catch { setBidError("Network error."); setBidState("error"); setTimeout(() => setBidState("idle"), 3000); }
  };

  const handleWatchlist = async () => {
    if (!isAuthenticated) { window.location.href = `/login?redirectTo=/horses/${horse.id}`; return; }
    await fetch("/api/watchlist", { method: watched ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ horse_id: horse.id }) });
    setWatched(!watched);
  };

  const quickSpecs = [
    { label: t('horseDetail', 'breed'), value: horse.breed },
    { label: t('horseDetail', 'height'), value: heightToCm(horse.heightCm) },
    { label: t('horseDetail', 'country'), value: horse.country },
    { label: t('horseDetail', 'discipline'), value: horse.discipline },
    { label: t('horseDetail', 'vetChecked'), value: horse.vetChecked ? "✓" : "—" },
  ];

  const fullSpecs = [
    { label: t('horseDetail', 'name'), value: horse.name },
    { label: t('horseDetail', 'breed'), value: horse.breed },
    { label: t('horseDetail', 'gender'), value: genderLabel[horse.gender] ?? horse.gender },
    { label: t('horseDetail', 'age'), value: `${horse.age} ${t('horseDetail', 'yearsOld')}` },
    { label: t('horseDetail', 'height'), value: heightToCm(horse.heightCm) },
    { label: t('horseDetail', 'color'), value: horse.color },
    { label: t('horseDetail', 'country'), value: horse.country },
    { label: t('horseDetail', 'discipline'), value: horse.discipline },
    { label: t('horseDetail', 'category'), value: categoryLabel(horse.category) },
    ...(horse.sire ? [{ label: t('horseDetail', 'sire'), value: horse.sire }] : []),
    ...(horse.dam ? [{ label: t('horseDetail', 'dam'), value: horse.dam }] : []),
    { label: t('horseDetail', 'vetChecked'), value: horse.vetChecked ? t('horseDetail', 'vetCheckedYes') : t('horseDetail', 'vetCheckedOnRequest') },
  ];

  const guarantees = [
    { icon: Shield, label: t('horseDetail', 'g1label'), desc: t('horseDetail', 'g1desc') },
    { icon: CheckCircle, label: t('horseDetail', 'g2label'), desc: t('horseDetail', 'g2desc') },
    { icon: Globe, label: t('horseDetail', 'g3label'), desc: t('horseDetail', 'g3desc') },
    { icon: TrendingUp, label: t('horseDetail', 'g4label'), desc: t('horseDetail', 'g4desc') },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">

      {/* ── HERO ────────────────────────────────── */}
      <div className="relative w-full bg-[#040a18]" style={{ height: "70vh", minHeight: 480 }}>
        <Image
          src={images[activeImage]}
          alt={horse.name}
          fill
          className="object-cover transition-all duration-500"
          sizes="100vw"
          priority
          onClick={() => setLightbox(true)}
          style={{ cursor: "zoom-in" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060c1d 0%, transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #060c1d 0%, transparent 30%, transparent 70%, #060c1d 100%)" }} />

        <div className="absolute top-6 left-6">
          <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
            {categoryLabel(horse.category)}
          </span>
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button onClick={handleWatchlist}
            className={cn("p-2.5 rounded-xl border backdrop-blur-sm transition-all", watched ? "bg-[#c9a84c] border-[#c9a84c] text-[#060c1d]" : "bg-[#060c1d]/60 border-[#c9a84c]/30 text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c]")}>
            <Heart className="w-4 h-4" fill={watched ? "currentColor" : "none"} />
          </button>
          <button className="p-2.5 rounded-xl border border-[#c9a84c]/30 bg-[#060c1d]/60 backdrop-blur-sm text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImage(p => Math.max(0, p - 1))} disabled={activeImage === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#060c1d]/70 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d] transition-all disabled:opacity-20 backdrop-blur-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveImage(p => Math.min(images.length - 1, p + 1))} disabled={activeImage === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#060c1d]/70 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d] transition-all disabled:opacity-20 backdrop-blur-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase font-[family-name:var(--font-inter)] mb-1" style={{ letterSpacing: "0.25em" }}>
              {horse.breed} · {genderLabel[horse.gender] ?? horse.gender} · {horse.age} {t('horseDetail', 'yearsOld')}
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] tracking-tight">
              {horse.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ── VIEW SWITCHER ───────────────────────── */}
      <div className="border-b border-[#c9a84c]/10 bg-[#040a18] sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap font-[family-name:var(--font-inter)] shrink-0",
                  activeImage === i
                    ? "bg-[#c9a84c] text-[#060c1d]"
                    : "text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5"
                )}>
                <div className="w-6 h-6 rounded overflow-hidden shrink-0 border border-current/20">
                  <Image src={img} alt="" width={24} height={24} className="w-full h-full object-cover" />
                </div>
                {viewLabels[i] ?? `View ${i + 1}`}
              </button>
            ))}
            {horse.videoUrl && (
              <button onClick={() => { document.getElementById("horse-video")?.scrollIntoView({ behavior: "smooth" }); }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all whitespace-nowrap font-[family-name:var(--font-inter)] shrink-0">
                <div className="w-6 h-6 rounded bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 text-[#c9a84c]" />
                </div>
                {t('horseDetail', 'videoTitle')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* LEFT ─ details */}
          <div className="lg:col-span-3 space-y-8">

            {/* Quick specs strip */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {quickSpecs.map(spec => (
                <div key={spec.label} className="bg-[#0a1428] rounded-xl p-4 border border-[#c9a84c]/10 text-center">
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{spec.label}</div>
                  <div className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-7">
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">{t('horseDetail', 'about')} {horse.name}</h2>
              <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)] text-sm whitespace-pre-line">{horse.description}</p>
            </div>

            {/* Pedigree */}
            {(horse.sire || horse.dam) && (
              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-7">
                <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">{t('horseDetail', 'pedigree')}</h2>
                {/* Mobile: stacked list; Desktop: tree layout */}
                <div className="sm:hidden space-y-3">
                  {[
                    { label: t('horseDetail', 'sireFather'), value: horse.sire },
                    { label: t('horseDetail', 'damMother'), value: horse.dam },
                  ].map(({ label, value }) => (
                    <div key={label} className={`rounded-xl border p-4 ${value ? "border-[#c9a84c]/20 bg-[#060c1d]" : "border-[#c9a84c]/10 bg-[#060c1d]/40"}`}>
                      <div className="text-[9px] text-[#c9a84c] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{label}</div>
                      <div className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{value ?? t('horseDetail', 'notRecorded')}</div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-stretch gap-0">
                    <div className="flex flex-col justify-center w-1/3 pr-4">
                      <div className="rounded-xl border-2 border-[#c9a84c]/40 bg-[#060c1d] p-4 text-center">
                        <div className="text-[9px] text-[#c9a84c] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{t('horseDetail', 'subject')}</div>
                        <div className="text-sm font-bold text-white font-[family-name:var(--font-playfair)]">{horse.name}</div>
                        <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">{genderLabel[horse.gender]}</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center relative w-8 shrink-0">
                      <div className="absolute top-1/4 bottom-1/4 left-0 right-0 flex flex-col justify-between">
                        <div className="h-px bg-[#c9a84c]/30 w-full" style={{ marginTop: "25%" }} />
                        <div className="h-px bg-[#c9a84c]/30 w-full" style={{ marginBottom: "25%" }} />
                      </div>
                      <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px bg-[#c9a84c]/30" />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-2 gap-4">
                      {horse.sire ? (
                        <div className="rounded-xl border border-[#c9a84c]/20 bg-[#060c1d] p-4">
                          <div className="text-[9px] text-[#c9a84c] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{t('horseDetail', 'sireFather')}</div>
                          <div className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{horse.sire}</div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-[#c9a84c]/10 bg-[#060c1d]/40 p-4">
                          <div className="text-[9px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{t('horseDetail', 'sireFather')}</div>
                          <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{t('horseDetail', 'notRecorded')}</div>
                        </div>
                      )}
                      {horse.dam ? (
                        <div className="rounded-xl border border-[#c9a84c]/20 bg-[#060c1d] p-4">
                          <div className="text-[9px] text-[#c9a84c] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{t('horseDetail', 'damMother')}</div>
                          <div className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{horse.dam}</div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-[#c9a84c]/10 bg-[#060c1d]/40 p-4">
                          <div className="text-[9px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">{t('horseDetail', 'damMother')}</div>
                          <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{t('horseDetail', 'notRecorded')}</div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between relative w-8 shrink-0 py-2 gap-4">
                      <div className="flex items-center h-full"><div className="w-full h-px bg-[#c9a84c]/20" /></div>
                      <div className="flex items-center h-full"><div className="w-full h-px bg-[#c9a84c]/20" /></div>
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-2 gap-2">
                      {[
                        t('horseDetail', 'paternalGrandsire'),
                        t('horseDetail', 'paternalGranddam'),
                        t('horseDetail', 'maternalGrandsire'),
                        t('horseDetail', 'maternalGranddam'),
                      ].map(role => (
                        <div key={role} className="rounded-lg border border-[#c9a84c]/8 bg-[#060c1d]/30 px-3 py-2.5">
                          <div className="text-[8px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">{role}</div>
                          <div className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)] mt-0.5">—</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-[#4a5a70] mt-5 font-[family-name:var(--font-inter)]">
                  {t('horseDetail', 'pedigreeNote')}
                </p>
              </div>
            )}

            {/* Full specs */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-7">
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-5">{t('horseDetail', 'fullDetails')}</h2>
              <div className="grid grid-cols-2 gap-0 divide-y divide-[#c9a84c]/8">
                {fullSpecs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-3 px-1 col-span-1">
                    <span className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">{spec.label}</span>
                    <span className="text-sm font-semibold text-[#a8bfd4] font-[family-name:var(--font-inter)] text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            {horse.videoUrl && (
              <div id="horse-video" className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#c9a84c]" />
                  <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)]">{t('horseDetail', 'videoTitle')}</h2>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={horse.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/").replace("vimeo.com/", "player.vimeo.com/video/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-7">
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-5">{t('horseDetail', 'transparencyGuarantee')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guarantees.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-[#060c1d]/40 border border-[#c9a84c]/8">
                    <item.icon className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{item.label}</div>
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT ─ bid panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-36 space-y-4">

              <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase font-[family-name:var(--font-inter)]",
                isLive ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-blue-500/10 border border-blue-500/20 text-blue-400")}>
                <span className={cn("w-2 h-2 rounded-full", isLive ? "bg-red-400 animate-pulse" : "bg-blue-400")} />
                {isLive ? t('horseDetail', 'liveAuction') : t('horseDetail', 'auctionPreview')}
                {isLive && auction && <span className="ml-auto"><CountdownTimer endDate={auction.endDate} compact /></span>}
              </div>

              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/20 overflow-hidden">
                <div className="p-6 border-b border-[#c9a84c]/10">
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">
                    {isLive ? t('horseDetail', 'currentBid') : t('horseDetail', 'startingPrice')}
                  </div>
                  <div className="text-4xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                    {formatCurrency(currentPrice, horse.currency)}
                  </div>
                  <div className="text-xs text-[#7a8fa8] mt-1 font-[family-name:var(--font-inter)]">
                    {bids.length} {t('horseDetail', 'bids')} · {t('horseDetail', 'starting')} {formatCurrency(horse.startingPrice, horse.currency)}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {!isLive && auction && (
                    <div className="flex items-center gap-3 p-3 bg-[#060c1d]/60 rounded-xl border border-[#c9a84c]/10">
                      <Clock className="w-4 h-4 text-[#c9a84c] shrink-0" />
                      <div>
                        <div className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">{t('horseDetail', 'auctionOpens')}</div>
                        <CountdownTimer endDate={auction.startDate} compact />
                      </div>
                    </div>
                  )}

                  {isLive ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">
                          {t('horseDetail', 'yourBidMin')} {formatCurrency(minBid, horse.currency)})
                        </label>
                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] font-bold font-[family-name:var(--font-inter)]">€</span>
                          <input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))}
                            min={minBid} step={1000}
                            className="w-full bg-[#060c1d] border border-[#c9a84c]/30 rounded-xl px-10 py-4 text-white text-lg font-bold font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[5000, 10000, 25000, 50000].map((inc) => (
                          <button key={inc} onClick={() => setBidAmount(currentPrice + inc)}
                            className="py-2 text-xs border border-[#c9a84c]/20 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-all font-[family-name:var(--font-inter)] font-semibold">
                            +€{inc / 1000}k
                          </button>
                        ))}
                      </div>

                      {bidError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-[family-name:var(--font-inter)]">{bidError}</div>
                      )}

                      <button onClick={handleBid} disabled={bidAmount < minBid || bidState === "loading"}
                        className={cn("w-full py-4 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl",
                          bidState === "success" ? "bg-green-500 text-white"
                            : bidState === "error" ? "bg-red-500/20 border border-red-500/30 text-red-400"
                            : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] disabled:opacity-50 glow-gold")}>
                        {bidState === "success" ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> {t('horseDetail', 'bidPlaced')}</span>
                          : bidState === "loading" ? t('horseDetail', 'placingBid')
                          : bidState === "error" ? t('horseDetail', 'bidFailed')
                          : `${t('horseDetail', 'placeBid')} — ${formatCurrency(bidAmount, horse.currency)}`}
                      </button>

                      {!isAuthenticated && (
                        <p className="text-[10px] text-[#4a5a70] text-center font-[family-name:var(--font-inter)]">
                          <Link href={`/login?redirectTo=/horses/${horse.id}`} className="text-[#c9a84c] hover:underline">{t('horseDetail', 'signInToBid')}</Link> {t('horseDetail', 'signInToBidSuffix')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">{t('horseDetail', 'registerInterestDesc')}</p>
                      <Link href="/register" className="block w-full py-4 text-center bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
                        {t('horseDetail', 'registerInterest')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Bid history */}
              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-4 h-4 text-[#c9a84c]" />
                  <h3 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">{t('horseDetail', 'bidHistory')}</h3>
                  {isLive && <span className="ml-auto flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase tracking-wider font-[family-name:var(--font-inter)]"><span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />{t('horseDetail', 'live')}</span>}
                </div>
                <div className="space-y-1">
                  {bids.length === 0 ? (
                    <p className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{t('horseDetail', 'noBidsFirst')}</p>
                  ) : (
                    [...bids].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((bid, i) => (
                      <div key={bid.id} className={cn("flex items-center justify-between py-2.5 px-3 rounded-lg", i === 0 && "bg-[#c9a84c]/5 border border-[#c9a84c]/20")}>
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="text-[9px] bg-[#c9a84c] text-[#060c1d] px-1.5 py-0.5 rounded font-bold font-[family-name:var(--font-inter)]">LEAD</span>}
                          <span className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                            #{bid.userId.slice(-4).toUpperCase()} · {formatDateTime(bid.createdAt)}
                          </span>
                        </div>
                        <span className={cn("text-sm font-bold font-[family-name:var(--font-inter)]", i === 0 ? "text-[#c9a84c]" : "text-[#7a8fa8]")}>
                          {formatCurrency(bid.amount, horse.currency)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="p-5 rounded-2xl border border-[#c9a84c]/10 bg-[#0a1428] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{t('contact', 'subtitle').split('.')[0]}?</div>
                  <Link href="/contact" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)]">
                    {t('contact', 'title')} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ────────────────────────────── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-sm font-[family-name:var(--font-inter)]" onClick={() => setLightbox(false)}>
            ESC to close
          </button>
          <button onClick={(e) => { e.stopPropagation(); setActiveImage(p => Math.max(0, p - 1)); }} disabled={activeImage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl mx-8" style={{ height: "80vh" }} onClick={(e) => e.stopPropagation()}>
            <Image src={images[activeImage]} alt={horse.name} fill className="object-contain" sizes="100vw" />
          </div>
          <button onClick={(e) => { e.stopPropagation(); setActiveImage(p => Math.min(images.length - 1, p + 1)); }} disabled={activeImage === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-20">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-[family-name:var(--font-inter)]">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
