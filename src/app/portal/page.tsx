"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gavel, Heart, TrendingUp, TrendingDown, ChevronRight,
  AlertTriangle, Activity, Zap, Eye, CheckCircle, Clock,
  ArrowUpRight, Flame
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CountdownTimer } from "@/components/auctions/countdown-timer";

interface BidRow {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  horses: {
    id: string;
    name: string;
    breed: string;
    category: string;
    current_price: number;
    currency: string;
    images: string[];
    auction_id: string | null;
  } | null;
}

interface LiveAuction {
  id: string;
  title: string;
  status: string;
  end_date: string;
}

interface WatchlistHorse {
  id: string;
  name: string;
  breed: string;
  current_price: number;
  currency: string;
  images: string[];
}

interface ActivityItem {
  id: string;
  type: "bid" | "outbid" | "watch";
  horseName: string;
  horseId: string;
  amount?: number;
  currency?: string;
  currentPrice?: number;
  time: string;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function PortalDashboard() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<{ full_name: string; role: string; country: string; verified: boolean } | null>(null);
  const [bids, setBids] = useState<BidRow[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistHorse[]>([]);
  const [liveAuction, setLiveAuction] = useState<LiveAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  const flash = useCallback((horseId: string) => {
    setFlashIds(p => new Set(p).add(horseId));
    setTimeout(() => setFlashIds(p => { const n = new Set(p); n.delete(horseId); return n; }), 2000);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let userId = "";

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login?redirectTo=/portal"; return; }
      userId = user.id;

      const [profRes, bidsRes, watchRes, liveRes] = await Promise.all([
        supabase.from("profiles").select("full_name, role, country, verified").eq("id", user.id).single(),
        supabase.from("bids")
          .select("id, amount, currency, created_at, horses(id, name, breed, category, current_price, currency, images, auction_id)")
          .eq("bidder_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase.from("watchlist")
          .select("horses(id, name, breed, current_price, currency, images)")
          .eq("user_id", user.id)
          .limit(6),
        supabase.from("auctions").select("id, title, status, end_date").eq("status", "LIVE").limit(1),
      ]);

      setProfile(profRes.data ?? null);
      setBids((bidsRes.data ?? []) as unknown as BidRow[]);
      setWatchlist(
        ((watchRes.data ?? []) as unknown as { horses: WatchlistHorse | null }[]).map((r) => r.horses).filter(Boolean) as WatchlistHorse[]
      );
      setLiveAuction(liveRes.data?.[0] ?? null);
      setLoading(false);

      // Realtime: subscribe to bid changes on horses this user has bid on
      const horseIds = ((bidsRes.data ?? []) as unknown as BidRow[])
        .map(b => b.horses?.id).filter(Boolean) as string[];

      if (horseIds.length > 0) {
        supabase.channel("portal-bids")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "bids" }, (payload) => {
            const nb = payload.new as { horse_id: string; amount: number; bidder_id: string; currency: string; created_at: string; id: string };
            if (!horseIds.includes(nb.horse_id)) return;
            if (nb.bidder_id === userId) return;
            flash(nb.horse_id);
            setBids(prev => prev.map(b =>
              b.horses?.id === nb.horse_id
                ? { ...b, horses: b.horses ? { ...b.horses, current_price: nb.amount } : b.horses }
                : b
            ));
          })
          .subscribe();
      }
    })();
  }, [flash]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 animate-pulse" />
        ))}
      </div>
    );
  }

  const displayName = profile?.full_name ?? "Bidder";

  // Compute leading / outbid — deduplicate by horse (only count each horse once, use user's latest bid)
  const byHorse: Record<string, BidRow> = {};
  for (const b of bids) {
    if (!b.horses?.id) continue;
    if (!byHorse[b.horses.id]) byHorse[b.horses.id] = b;
  }
  const uniqueBids = Object.values(byHorse);
  const leading = uniqueBids.filter(b => b.horses && Number(b.amount) >= Number(b.horses.current_price));
  const outbid = uniqueBids.filter(b => b.horses && Number(b.amount) < Number(b.horses.current_price));
  const totalValue = bids.reduce((s, b) => s + Number(b.amount), 0);

  // Activity feed — mix bids + outbid events
  const activity: ActivityItem[] = bids.slice(0, 8).map(b => {
    const isLeading = b.horses ? Number(b.amount) >= Number(b.horses.current_price) : true;
    return {
      id: b.id,
      type: isLeading ? "bid" : "outbid",
      horseName: b.horses?.name ?? "Unknown",
      horseId: b.horses?.id ?? "",
      amount: Number(b.amount),
      currency: b.currency,
      currentPrice: b.horses ? Number(b.horses.current_price) : undefined,
      time: b.created_at,
    };
  });

  const kpis = [
    {
      label: "Leading",
      value: leading.length,
      sub: leading.length === 1 ? "horse" : "horses",
      color: "text-emerald-400",
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
      glow: leading.length > 0 ? "shadow-emerald-500/10 shadow-lg" : "",
      icon: CheckCircle,
    },
    {
      label: "Outbid",
      value: outbid.length,
      sub: outbid.length === 1 ? "act now" : "act now",
      color: outbid.length > 0 ? "text-red-400" : "text-[#4a5a70]",
      bg: outbid.length > 0 ? "from-red-500/10 to-red-500/5" : "from-[#0a1428] to-[#0a1428]",
      border: outbid.length > 0 ? "border-red-500/30" : "border-[#c9a84c]/10",
      glow: outbid.length > 0 ? "shadow-red-500/10 shadow-lg" : "",
      icon: AlertTriangle,
    },
    {
      label: "Watching",
      value: watchlist.length,
      sub: "on watchlist",
      color: "text-[#c9a84c]",
      bg: "from-[#c9a84c]/10 to-[#c9a84c]/5",
      border: "border-[#c9a84c]/20",
      glow: "",
      icon: Eye,
    },
    {
      label: "Bid Value",
      value: formatCurrency(totalValue),
      sub: "combined",
      color: "text-white",
      bg: "from-[#1a2d4a] to-[#0a1428]",
      border: "border-[#c9a84c]/15",
      glow: "",
      icon: TrendingUp,
      large: true,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase mb-1 font-[family-name:var(--font-inter)]">
            {greeting()}
          </p>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
            {displayName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[#7a8fa8] text-sm font-[family-name:var(--font-inter)]">
              {profile?.role ?? "Bidder"} · {profile?.country ?? "Global"}
            </p>
            {profile?.verified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-[family-name:var(--font-inter)] uppercase tracking-wider">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>
        </div>
        <Link href="/auctions"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#060c1d] text-xs font-bold tracking-wider uppercase rounded-lg hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] glow-gold">
          <Flame className="w-3.5 h-3.5" /> Browse Live
        </Link>
      </div>

      {/* Outbid alert */}
      {outbid.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-red-500/60 via-red-400/40 to-transparent" />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <span className="w-3 h-3 bg-red-400 rounded-full block animate-ping absolute" />
                <span className="w-3 h-3 bg-red-400 rounded-full block relative" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-300 font-[family-name:var(--font-inter)]">
                  You&apos;re being outbid on {outbid.length} {outbid.length === 1 ? "horse" : "horses"}
                </p>
                <p className="text-xs text-red-400/70 font-[family-name:var(--font-inter)] mt-0.5">
                  {outbid.slice(0, 2).map(b => b.horses?.name).join(" · ")}
                  {outbid.length > 2 ? ` +${outbid.length - 2} more` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {outbid.slice(0, 2).map(b => (
                <Link key={b.id} href={`/horses/${b.horses?.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-400 transition-all font-[family-name:var(--font-inter)]">
                  Bid on {b.horses?.name?.split(" ")[0]} <ArrowUpRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live auction hero */}
      {liveAuction && (
        <div className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-br from-[#0d1f38] to-[#060c1d]"
          style={{ boxShadow: "0 0 40px rgba(201,168,76,0.08)" }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="relative mt-0.5">
                <span className="w-3 h-3 bg-red-400 rounded-full block animate-ping absolute opacity-75" />
                <span className="w-3 h-3 bg-red-400 rounded-full block relative" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-400 tracking-[0.25em] uppercase mb-1 font-[family-name:var(--font-inter)]">
                  Auction Live Now
                </p>
                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  {liveAuction.title}
                </h3>
                <div className="mt-2">
                  <CountdownTimer endDate={new Date(liveAuction.end_date)} />
                </div>
              </div>
            </div>
            <Link href={`/auctions/${liveAuction.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] glow-gold shrink-0">
              Enter Auction <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all ${k.bg} ${k.border} ${k.glow}`}>
            <div className="flex items-start justify-between mb-3">
              <k.icon className={`w-4 h-4 ${k.color} opacity-80`} />
              {k.label === "Outbid" && outbid.length > 0 && (
                <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded-full font-[family-name:var(--font-inter)] uppercase tracking-wider animate-pulse">
                  urgent
                </span>
              )}
            </div>
            <div className={`font-bold font-[family-name:var(--font-playfair)] ${k.large ? "text-lg" : "text-3xl"} ${k.color}`}>
              {k.value}
            </div>
            <div className="text-[10px] text-white font-semibold mt-1 font-[family-name:var(--font-inter)] uppercase tracking-wider">{k.label}</div>
            <div className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main content: activity + watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Activity feed */}
        <div className="xl:col-span-3 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="font-bold text-white text-sm font-[family-name:var(--font-inter)]">Activity Feed</h2>
            </div>
            <Link href="/portal/bids" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-semibold font-[family-name:var(--font-inter)]">
              View all →
            </Link>
          </div>

          {activity.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Gavel className="w-8 h-8 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-3">No activity yet.</p>
              <Link href="/auctions" className="text-xs text-[#c9a84c] hover:underline font-[family-name:var(--font-inter)]">
                Browse live auctions →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#c9a84c]/5">
              {activity.map((item) => {
                const isFlashing = flashIds.has(item.horseId);
                return (
                  <div key={item.id}
                    className={`flex items-start gap-4 px-5 py-4 transition-all duration-500 ${isFlashing ? "bg-red-500/10" : "hover:bg-[#c9a84c]/2"}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === "bid" ? "bg-emerald-400" : "bg-red-400"} ${isFlashing ? "animate-ping" : ""}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">
                          {item.horseName}
                        </span>
                        {item.type === "outbid" && (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full font-[family-name:var(--font-inter)] uppercase tracking-wider">
                            Outbid
                          </span>
                        )}
                        {item.type === "bid" && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full font-[family-name:var(--font-inter)] uppercase tracking-wider">
                            Leading
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#7a8fa8] mt-0.5 font-[family-name:var(--font-inter)]">
                        {item.type === "outbid"
                          ? `Your bid ${formatCurrency(item.amount ?? 0)} · Current ${formatCurrency(item.currentPrice ?? 0)}`
                          : `Your bid ${formatCurrency(item.amount ?? 0)}`}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-[#4a5a70]" />
                        <span className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">
                          {formatDateTime(new Date(item.time))}
                        </span>
                      </div>
                    </div>
                    {item.type === "outbid" && item.horseId && (
                      <Link href={`/horses/${item.horseId}`}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all font-[family-name:var(--font-inter)] uppercase tracking-wider">
                        Bid Again <Zap className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Watchlist snapshot */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="font-bold text-white text-sm font-[family-name:var(--font-inter)]">Watchlist</h2>
            </div>
            <Link href="/portal/watchlist" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] font-semibold font-[family-name:var(--font-inter)]">
              View all →
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-8 text-center">
              <Heart className="w-8 h-8 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-3">Nothing saved yet.</p>
              <Link href="/horses" className="text-xs text-[#c9a84c] hover:underline font-[family-name:var(--font-inter)]">
                Browse horses →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {watchlist.map((horse) => {
                const images = (typeof horse.images === "string" ? JSON.parse(horse.images) : horse.images) as string[];
                const hasMyBid = uniqueBids.find(b => b.horses?.id === horse.id);
                const isLeadingHere = hasMyBid && Number(hasMyBid.amount) >= Number(horse.current_price);
                return (
                  <Link key={horse.id} href={`/horses/${horse.id}`}
                    className="flex items-center gap-3 p-3 bg-[#0a1428] border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 rounded-xl transition-all group">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&q=80"}
                        alt={horse.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate font-[family-name:var(--font-inter)] group-hover:text-[#c9a84c] transition-colors">
                        {horse.name}
                      </div>
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{horse.breed}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                        {formatCurrency(horse.current_price, horse.currency)}
                      </div>
                      {hasMyBid && (
                        <div className={`text-[10px] font-bold font-[family-name:var(--font-inter)] ${isLeadingHere ? "text-emerald-400" : "text-red-400"}`}>
                          {isLeadingHere ? "Leading" : "Outbid"}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Quick CTA */}
          <Link href="/sell"
            className="flex items-center justify-between p-4 rounded-xl border border-[#c9a84c]/20 bg-gradient-to-r from-[#c9a84c]/5 to-transparent hover:from-[#c9a84c]/10 transition-all group">
            <div>
              <p className="text-xs font-bold text-white font-[family-name:var(--font-inter)]">Have a horse to sell?</p>
              <p className="text-[10px] text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">Submit for expert review</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#c9a84c] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
