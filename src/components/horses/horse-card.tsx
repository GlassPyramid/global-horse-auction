"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, Gavel, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatCurrency, categoryLabel, categoryClass, heightToCm } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface HorseCardProps {
  horse: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
    color: string;
    heightCm: number;
    country: string;
    discipline: string;
    category: string;
    currentPrice: number;
    currency: string;
    vetChecked: boolean;
    featured: boolean;
    images: string | string[];
    bids: { id: string; amount: number }[];
  };
  compact?: boolean;
}

const genderLabel: Record<string, string> = {
  STALLION: "Stallion",
  MARE: "Mare",
  GELDING: "Gelding",
};

export function HorseCard({ horse, compact = false }: HorseCardProps) {
  const { t } = useLanguage();
  const [watched, setWatched] = useState(false);
  const images = (typeof horse.images === "string" ? JSON.parse(horse.images) : horse.images) as string[];
  const primaryImage = images[0];
  const bidCount = horse.bids.length;

  return (
    <div className="group relative bg-[#0a1428] border border-[#c9a84c]/10 hover:border-[#c9a84c]/35 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#c9a84c]/5 hover:-translate-y-1">
      <div className={cn("relative overflow-hidden", compact ? "h-48" : "h-64")}>
        <Image
          src={primaryImage}
          alt={horse.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 gradient-card" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wider uppercase font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
            {categoryLabel(horse.category)}
          </span>
          {horse.featured && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c] tracking-wider uppercase font-[family-name:var(--font-inter)]">
              {t('horseCard', 'featured')}
            </span>
          )}
        </div>

        <button
          onClick={() => setWatched(!watched)}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-all",
            watched
              ? "bg-[#c9a84c] border-[#c9a84c] text-[#060c1d]"
              : "bg-[#060c1d]/60 border-[#c9a84c]/30 text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c]"
          )}
          aria-label="Add to watchlist"
        >
          <Heart className="w-3.5 h-3.5" fill={watched ? "currentColor" : "none"} />
        </button>

        {horse.vetChecked && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#060c1d]/80 backdrop-blur-sm rounded-full">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-bold text-green-400 tracking-wider uppercase font-[family-name:var(--font-inter)]">
              {t('horseCard', 'vetChecked')}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#060c1d]/80 backdrop-blur-sm rounded-full">
          <span className="text-[10px] text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            {horse.country}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] group-hover:text-[#c9a84c] transition-colors">
              {horse.name}
            </h3>
            <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              {horse.breed} · {genderLabel[horse.gender] ?? horse.gender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: t('horseCard', 'age'), value: `${horse.age} yrs` },
            { label: t('horseCard', 'height'), value: heightToCm(horse.heightCm) },
            { label: t('horseCard', 'discipline'), value: horse.discipline },
          ].map((spec) => (
            <div key={spec.label} className="bg-[#060c1d]/60 rounded-lg px-3 py-2 text-center border border-[#c9a84c]/8">
              <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mb-0.5">
                {spec.label}
              </div>
              <div className="text-xs font-semibold text-[#a8bfd4] font-[family-name:var(--font-inter)] truncate">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mb-0.5">
              {t('horseCard', 'currentBid')}
            </div>
            <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
              {formatCurrency(horse.currentPrice, horse.currency)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#7a8fa8]">
            <Gavel className="w-3.5 h-3.5" />
            <span className="text-xs font-[family-name:var(--font-inter)]">
              {bidCount} {bidCount === 1 ? t('horseCard', 'bid') : t('horseCard', 'bids')}
            </span>
          </div>
        </div>

        <Link
          href={`/horses/${horse.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#060c1d] transition-all duration-300 rounded font-[family-name:var(--font-inter)] group/btn"
        >
          {t('horseCard', 'viewDetails')}
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
