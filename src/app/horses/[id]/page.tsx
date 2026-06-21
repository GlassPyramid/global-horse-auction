"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Clock,
  Globe,
  Share2,
  Play,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { mockHorses, mockAuctions } from "@/lib/mock-data";
import {
  formatCurrency,
  formatDateTime,
  categoryLabel,
  categoryClass,
  heightToCm,
} from "@/lib/utils";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { cn } from "@/lib/utils";

const genderLabel: Record<string, string> = {
  STALLION: "Stallion",
  MARE: "Mare",
  GELDING: "Gelding",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function HorsePage({ params }: Props) {
  const { id } = use(params);
  const horse = mockHorses.find((h) => h.id === id);

  if (!horse) notFound();

  const auction = mockAuctions.find((a) => a.id === horse.auctionId);
  const images = JSON.parse(horse.images) as string[];

  return <HorseDetail horse={horse} auction={auction} images={images} />;
}

function HorseDetail({
  horse,
  auction,
  images,
}: {
  horse: (typeof mockHorses)[0];
  auction: (typeof mockAuctions)[0] | undefined;
  images: string[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [watched, setWatched] = useState(false);
  const [bidAmount, setBidAmount] = useState(horse.currentPrice + 5000);
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const minBid = horse.currentPrice + 1000;

  const handleBid = () => {
    if (bidAmount < minBid) return;
    setBidSubmitted(true);
    setTimeout(() => setBidSubmitted(false), 3000);
  };

  const isLive = auction?.status === "LIVE";

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-[#c9a84c]/10 bg-[#040a18]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/auctions" className="hover:text-[#c9a84c] transition-colors">Auctions</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {auction && (
            <>
              <Link href={`/auctions/${auction.id}`} className="hover:text-[#c9a84c] transition-colors truncate max-w-32">
                {auction.title}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-[#c9a84c]">{horse.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* LEFT: Images + Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0a1428] aspect-[4/3]">
              <Image
                src={images[activeImage]}
                alt={`${horse.name} — photo ${activeImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => Math.max(0, p - 1))}
                    disabled={activeImage === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#060c1d]/80 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d] transition-all disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => Math.min(images.length - 1, p + 1))}
                    disabled={activeImage === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#060c1d]/80 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d] transition-all disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4">
                <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
                  {categoryLabel(horse.category)}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#060c1d]/80 backdrop-blur-sm rounded-full text-xs text-[#a8bfd4] font-[family-name:var(--font-inter)]">
                {activeImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                    activeImage === i ? "border-[#c9a84c]" : "border-[#c9a84c]/15 hover:border-[#c9a84c]/40"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
              {horse.videoUrl && (
                <button className="relative w-20 h-16 rounded-lg overflow-hidden border-2 border-[#c9a84c]/15 hover:border-[#c9a84c]/40 transition-all bg-[#0a1428] flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-[#c9a84c]" />
                </button>
              )}
            </div>

            {/* Horse specs */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
              <h2 className="text-lg font-bold text-white mb-5 font-[family-name:var(--font-playfair)]">Horse Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Breed", value: horse.breed },
                  { label: "Gender", value: genderLabel[horse.gender] ?? horse.gender },
                  { label: "Age", value: `${horse.age} years old` },
                  { label: "Height", value: heightToCm(horse.heightCm) },
                  { label: "Color", value: horse.color },
                  { label: "Country", value: horse.country },
                  { label: "Discipline", value: horse.discipline },
                  ...(horse.sire ? [{ label: "Sire", value: horse.sire }] : []),
                  ...(horse.dam ? [{ label: "Dam", value: horse.dam }] : []),
                ].map((spec) => (
                  <div key={spec.label} className="border-b border-[#c9a84c]/8 pb-3 last:border-0">
                    <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mb-1">{spec.label}</div>
                    <div className="text-sm font-semibold text-[#a8bfd4] font-[family-name:var(--font-inter)]">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">About {horse.name}</h2>
              <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)] text-sm">{horse.description}</p>
            </div>

            {/* Guarantees */}
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">Transparency Guarantee</h2>
              <div className="space-y-3">
                {[
                  { icon: Shield, label: "Comprehensive Vet Check", desc: "Full clinical examination by FEI-accredited veterinarian" },
                  { icon: CheckCircle, label: "X-Rays & Scopes Available", desc: "Complete radiological documentation on request" },
                  { icon: Globe, label: "Full Competition History", desc: "Complete results archive and video footage library" },
                  { icon: TrendingUp, label: "Bloodline Certificate", desc: "Verified UELN passport and pedigree certification" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{item.label}</div>
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Bid panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">{horse.name}</h1>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWatched(!watched)}
                      className={cn(
                        "p-2.5 rounded-lg border transition-all",
                        watched ? "bg-[#c9a84c] border-[#c9a84c] text-[#060c1d]" : "border-[#c9a84c]/30 text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                      )}
                    >
                      <Heart className="w-4 h-4" fill={watched ? "currentColor" : "none"} />
                    </button>
                    <button className="p-2.5 rounded-lg border border-[#c9a84c]/30 text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                  {horse.breed} · {genderLabel[horse.gender]} · {horse.age} years old · {horse.country}
                </p>
              </div>

              {/* Bid card */}
              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/20 overflow-hidden">
                <div className={cn("px-6 py-3 flex items-center gap-2 border-b border-[#c9a84c]/10", isLive ? "bg-red-500/10" : "bg-[#1a2d4a]/50")}>
                  <span className={cn("w-2 h-2 rounded-full", isLive ? "bg-red-400 animate-pulse" : "bg-blue-400")} />
                  <span className={cn("text-xs font-bold tracking-widest uppercase font-[family-name:var(--font-inter)]", isLive ? "text-red-400" : "text-blue-400")}>
                    {isLive ? "Live Bidding" : "Auction Preview"}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">Current Bid</div>
                    <div className="text-4xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                      {formatCurrency(horse.currentPrice, horse.currency)}
                    </div>
                    <div className="text-xs text-[#7a8fa8] mt-1 font-[family-name:var(--font-inter)]">
                      {horse.bids.length} bids placed · Starting price {formatCurrency(horse.startingPrice, horse.currency)}
                    </div>
                  </div>

                  {auction && (
                    <div className="flex items-center gap-3 p-4 bg-[#060c1d]/60 rounded-xl border border-[#c9a84c]/10">
                      <Clock className="w-4 h-4 text-[#c9a84c] shrink-0" />
                      <div>
                        <div className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-1">
                          {isLive ? "Closes" : "Opens"}
                        </div>
                        <CountdownTimer endDate={isLive ? auction.endDate : auction.startDate} compact />
                      </div>
                    </div>
                  )}

                  {isLive && (
                    <div className="space-y-3">
                      <label className="text-xs text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)]">
                        Your Bid (minimum {formatCurrency(minBid, horse.currency)})
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] font-bold font-[family-name:var(--font-inter)]">€</span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          min={minBid}
                          step={1000}
                          className="w-full bg-[#060c1d] border border-[#c9a84c]/30 rounded-xl px-10 py-4 text-white text-lg font-bold font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors"
                        />
                      </div>

                      <div className="flex gap-2">
                        {[5000, 10000, 25000, 50000].map((increment) => (
                          <button
                            key={increment}
                            onClick={() => setBidAmount(horse.currentPrice + increment)}
                            className="flex-1 py-2 text-xs border border-[#c9a84c]/20 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-all font-[family-name:var(--font-inter)] font-semibold"
                          >
                            +€{(increment / 1000).toFixed(0)}k
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleBid}
                        disabled={bidAmount < minBid}
                        className={cn(
                          "w-full py-4 font-bold text-sm tracking-widest uppercase transition-all font-[family-name:var(--font-inter)] rounded-xl",
                          bidSubmitted
                            ? "bg-green-500 text-white"
                            : "bg-[#c9a84c] text-[#060c1d] hover:bg-[#e2c97e] disabled:opacity-50 disabled:cursor-not-allowed glow-gold"
                        )}
                      >
                        {bidSubmitted ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Bid Placed!
                          </span>
                        ) : (
                          `Place Bid — ${formatCurrency(bidAmount, horse.currency)}`
                        )}
                      </button>

                      <p className="text-[10px] text-[#4a5a70] text-center font-[family-name:var(--font-inter)]">
                        By bidding you agree to our{" "}
                        <Link href="/terms" className="text-[#c9a84c] hover:underline">Terms & Conditions</Link>
                      </p>
                    </div>
                  )}

                  {!isLive && (
                    <div className="space-y-3">
                      <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                        Register your interest now to be notified when bidding opens.
                      </p>
                      <button className="w-full py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
                        Register Interest
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bid history */}
              <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-4 h-4 text-[#c9a84c]" />
                  <h3 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Bid History</h3>
                </div>
                <div className="space-y-2">
                  {[...horse.bids].reverse().map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between py-2 border-b border-[#c9a84c]/8 last:border-0">
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                        Bidder #{bid.userId.slice(-4).toUpperCase()} · {formatDateTime(bid.createdAt)}
                      </div>
                      <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                        {formatCurrency(bid.amount, horse.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#c9a84c]/10 bg-[#0a1428] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">Need more information?</div>
                  <Link href="/contact" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)]">
                    Contact our specialists →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
