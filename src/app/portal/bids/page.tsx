"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gavel, TrendingUp, TrendingDown, ExternalLink, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BidRow {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  horse_id: string;
  horses: {
    id: string;
    name: string;
    breed: string;
    category: string;
    current_price: number;
    currency: string;
    images: string[];
  } | null;
}

type Filter = "all" | "leading" | "outbid";

export default function MyBidsPage() {
  const { t } = useLanguage();
  const [bids, setBids] = useState<BidRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/login?redirectTo=/portal/bids"; return; }
      const { data } = await supabase
        .from("bids")
        .select("id, amount, currency, created_at, horse_id, horses(id, name, breed, category, current_price, currency, images)")
        .eq("bidder_id", user.id)
        .order("created_at", { ascending: false });
      setBids((data ?? []) as unknown as BidRow[]);
      setLoading(false);
    });
  }, []);

  // Deduplicate by horse — keep latest bid per horse
  const byHorse: Record<string, BidRow> = {};
  for (const b of bids) {
    if (b.horses?.id && !byHorse[b.horses.id]) byHorse[b.horses.id] = b;
  }
  const unique = Object.values(byHorse);

  const totalValue = unique.reduce((s, b) => s + Number(b.amount), 0);
  const leadingBids = unique.filter(b => b.horses && Number(b.amount) >= Number(b.horses.current_price));
  const outbidBids = unique.filter(b => b.horses && Number(b.amount) < Number(b.horses.current_price));

  const filtered = filter === "leading" ? leadingBids : filter === "outbid" ? outbidBids : unique;

  const tabs: { key: Filter; label: string; count: number; color: string }[] = [
    { key: "all", label: "All Bids", count: unique.length, color: "text-[#c9a84c]" },
    { key: "leading", label: "Leading", count: leadingBids.length, color: "text-emerald-400" },
    { key: "outbid", label: "Outbid", count: outbidBids.length, color: "text-red-400" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase mb-1 font-[family-name:var(--font-inter)]">
          {t('portal', 'clientPortal')}
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">{t('portal', 'myBids')}</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          {t('portal', 'myBidsSubtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('portal', 'statTotalBids'), value: unique.length, color: "text-white" },
          { label: "Leading", value: leadingBids.length, color: "text-emerald-400" },
          { label: "Outbid", value: outbidBids.length, color: outbidBids.length > 0 ? "text-red-400" : "text-[#4a5a70]" },
          { label: t('portal', 'statValue'), value: formatCurrency(totalValue), color: "text-[#c9a84c]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 p-4">
            <div className={`text-xl font-bold font-[family-name:var(--font-playfair)] ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Outbid urgent strip */}
      {outbidBids.length > 0 && filter !== "leading" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/25 flex-wrap">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shrink-0" />
          <p className="text-sm font-semibold text-red-300 font-[family-name:var(--font-inter)] flex-1">
            You&apos;re outbid on {outbidBids.length} {outbidBids.length === 1 ? "horse" : "horses"} — act before the auction closes.
          </p>
          <button onClick={() => setFilter("outbid")}
            className="text-xs font-bold text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-all font-[family-name:var(--font-inter)]">
            Show outbid
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all font-[family-name:var(--font-inter)] uppercase tracking-wide ${
              filter === tab.key
                ? "bg-[#060c1d] text-white shadow"
                : "text-[#4a5a70] hover:text-[#7a8fa8]"
            }`}>
            {tab.label}
            <span className={`text-[10px] font-bold ${filter === tab.key ? tab.color : "text-[#4a5a70]"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bids list */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Gavel className="w-10 h-10 text-[#c9a84c]/20 mx-auto mb-4" />
            <p className="text-white font-bold mb-2 font-[family-name:var(--font-playfair)]">
              {filter === "leading" ? "Not leading any bids yet." : filter === "outbid" ? "Not outbid on anything." : t('portal', 'noBidsYet')}
            </p>
            <Link href="/auctions" className="text-[#c9a84c] hover:underline text-sm font-[family-name:var(--font-inter)]">
              {t('portal', 'browseAuctionsLink')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#c9a84c]/8">
            {filtered.map((bid) => {
              const horse = bid.horses;
              const isLeading = horse ? Number(bid.amount) >= Number(horse.current_price) : false;
              const diff = horse ? Number(horse.current_price) - Number(bid.amount) : 0;
              const images = (typeof horse?.images === "string" ? JSON.parse(horse.images) : horse?.images) as string[];
              const primaryImage = images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&q=80";

              return (
                <div key={bid.id}
                  className={`px-5 py-4 flex items-center gap-4 transition-colors group ${isLeading ? "hover:bg-emerald-500/3" : "hover:bg-red-500/3"}`}>
                  {/* Status stripe */}
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${isLeading ? "bg-emerald-400" : "bg-red-400"}`} />

                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#c9a84c]/10">
                    <Image src={primaryImage} alt={horse?.name ?? ""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="56px" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{horse?.name ?? "Unknown"}</span>
                      {horse?.category && (
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
                          {categoryLabel(horse.category)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      {horse?.breed} · {formatDateTime(new Date(bid.created_at))}
                    </div>
                    {!isLeading && diff > 0 && (
                      <p className="text-[10px] text-red-400/80 mt-0.5 font-[family-name:var(--font-inter)]">
                        {formatCurrency(diff)} behind current bid
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                      {formatCurrency(Number(bid.amount), bid.currency)}
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs justify-end mt-0.5 font-semibold font-[family-name:var(--font-inter)]", isLeading ? "text-emerald-400" : "text-red-400")}>
                      {isLeading ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isLeading ? "Leading" : `Current: ${formatCurrency(Number(horse?.current_price ?? 0), bid.currency)}`}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {!isLeading && horse?.id && (
                      <Link href={`/horses/${horse.id}`}
                        className="flex items-center gap-1 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Bid again">
                        <Zap className="w-4 h-4" />
                      </Link>
                    )}
                    {horse?.id && (
                      <Link href={`/horses/${horse.id}`}
                        className="p-2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors"
                        aria-label={`View ${horse.name}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
