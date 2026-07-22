"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, TrendingUp, TrendingDown, Gavel } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface WatchHorse {
  id: string;
  name: string;
  breed: string;
  category: string;
  current_price: number;
  currency: string;
  images: string[];
  age: number;
  height_cm: number;
  discipline: string;
  bids: { id: string; amount: number; bidder_id: string }[];
}

export default function WatchlistPage() {
  const { t } = useLanguage();
  const [horses, setHorses] = useState<WatchHorse[]>([]);
  const [myBidsByHorse, setMyBidsByHorse] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/login?redirectTo=/portal/watchlist"; return; }

      const [watchRes, bidsRes] = await Promise.all([
        supabase.from("watchlist")
          .select("horses(id, name, breed, category, current_price, currency, images, age, height_cm, discipline, bids(id, amount, bidder_id))")
          .eq("user_id", user.id),
        supabase.from("bids")
          .select("amount, horse_id")
          .eq("bidder_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const hs = ((watchRes.data ?? []) as unknown as { horses: WatchHorse | null }[]).map((r) => r.horses).filter(Boolean) as WatchHorse[];
      setHorses(hs);

      // Build map of my latest bid per horse
      const map: Record<string, number> = {};
      for (const b of (bidsRes.data ?? []) as { amount: number; horse_id: string }[]) {
        if (!map[b.horse_id]) map[b.horse_id] = Number(b.amount);
      }
      setMyBidsByHorse(map);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (horseId: string) => {
    const supabase = createClient();
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ horse_id: horseId }),
    });
    setHorses(prev => prev.filter(h => h.id !== horseId));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase mb-1 font-[family-name:var(--font-inter)]">
            {t('portal', 'clientPortal')}
          </p>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">{t('portal', 'watchlistTitle')}</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
            {horses.length} {t('portal', 'watchlistCount')}
          </p>
        </div>
        {horses.length > 0 && (
          <Link href="/horses"
            className="text-xs text-[#c9a84c] hover:text-[#e2c97e] font-semibold font-[family-name:var(--font-inter)] transition-colors">
            Browse more →
          </Link>
        )}
      </div>

      {horses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10">
          <Heart className="w-12 h-12 text-[#c9a84c]/20 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">{t('portal', 'watchlistEmpty')}</h3>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] max-w-xs mb-6">
            {t('portal', 'watchlistEmptyDesc')}
          </p>
          <Link href="/horses"
            className="px-6 py-3 bg-[#c9a84c] text-[#060c1d] text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)]">
            Browse Horses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {horses.map((horse) => {
            const images = (typeof horse.images === "string" ? JSON.parse(horse.images) : horse.images) as string[];
            const myBid = myBidsByHorse[horse.id];
            const isLeading = myBid !== undefined && myBid >= Number(horse.current_price);
            const isOutbid = myBid !== undefined && myBid < Number(horse.current_price);
            const bidCount = horse.bids?.length ?? 0;

            return (
              <div key={horse.id}
                className="group relative bg-[#0a1428] border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c9a84c]/5">

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80"}
                    alt={horse.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-transparent to-transparent" />

                  {/* Category */}
                  <div className="absolute top-3 left-3">
                    <span className={cn("text-[9px] font-bold px-2.5 py-1 rounded-full border font-[family-name:var(--font-inter)] uppercase tracking-wider", categoryClass(horse.category))}>
                      {categoryLabel(horse.category)}
                    </span>
                  </div>

                  {/* Bid status badge */}
                  {(isLeading || isOutbid) && (
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold font-[family-name:var(--font-inter)] uppercase tracking-wider ${
                      isLeading ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border-red-500/30 text-red-300"
                    }`}>
                      {isLeading ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {isLeading ? "Leading" : "Outbid"}
                    </div>
                  )}

                  {/* Remove */}
                  <button onClick={() => handleRemove(horse.id)}
                    className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-[#060c1d]/80 border border-[#c9a84c]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-red-400/40 hover:text-red-400 text-[#7a8fa8]">
                    <Heart className="w-3 h-3" fill="currentColor" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white font-[family-name:var(--font-playfair)] truncate group-hover:text-[#c9a84c] transition-colors">
                        {horse.name}
                      </h3>
                      <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">
                        {horse.breed} · {horse.age} yrs
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                        {formatCurrency(horse.current_price, horse.currency)}
                      </div>
                      <div className="flex items-center gap-1 justify-end text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">
                        <Gavel className="w-3 h-3" /> {bidCount} {bidCount === 1 ? "bid" : "bids"}
                      </div>
                    </div>
                  </div>

                  {isOutbid && myBid && (
                    <div className="mb-3 px-3 py-2 bg-red-500/8 border border-red-500/20 rounded-lg">
                      <p className="text-[10px] text-red-400 font-[family-name:var(--font-inter)]">
                        Your bid {formatCurrency(myBid)} · {formatCurrency(Number(horse.current_price) - myBid)} behind
                      </p>
                    </div>
                  )}

                  <Link href={`/horses/${horse.id}`}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all font-[family-name:var(--font-inter)] ${
                      isOutbid
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d]"
                    }`}>
                    {isOutbid ? "Bid Again" : "View Horse"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
