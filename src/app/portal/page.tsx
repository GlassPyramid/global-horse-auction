import Link from "next/link";
import { Gavel, Heart, TrendingUp, Clock, ChevronRight, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toHorse, type DbHorse } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { HorseCard } from "@/components/horses/horse-card";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/portal");

  const [{ data: profile }, { data: bidsData }, { data: watchlistData }, { data: liveAuctions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("bids")
      .select("id, amount, currency, created_at, horses(id, name, breed, category, current_price, currency, images, height_cm, age, gender, country, discipline, vet_checked, featured, starting_price, auction_id, bids(id, amount))")
      .eq("bidder_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("watchlist")
      .select("horses(*, bids(id, amount, bidder_id, created_at))")
      .eq("user_id", user.id)
      .limit(4),
    supabase.from("auctions").select("id, title, status").eq("status", "LIVE").limit(1),
  ]);

  const displayName = profile?.full_name ?? user.email ?? "Bidder";
  const totalBidValue = bidsData?.reduce((sum, b) => sum + Number(b.amount), 0) ?? 0;
  const liveAuction = liveAuctions?.[0] ?? null;

  const watchlistHorses = (watchlistData ?? [])
    .map((w) => w.horses)
    .filter(Boolean)
    .map((h) => toHorse(h as unknown as DbHorse));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Welcome Back
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">{displayName}</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          {profile?.role ?? "Bidder"} · {profile?.country ?? "Global"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Gavel, label: "Total Bids Placed", value: (bidsData?.length ?? 0).toString(), sub: "Across all auctions", color: "text-[#c9a84c]" },
          { icon: TrendingUp, label: "Total Bid Value", value: formatCurrency(totalBidValue), sub: "Combined bid amount", color: "text-green-400" },
          { icon: Heart, label: "Watchlist", value: (watchlistData?.length ?? 0).toString(), sub: "Horses saved", color: "text-pink-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-5">
            <div className="flex items-start justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className={`text-2xl font-bold font-[family-name:var(--font-playfair)] ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs font-semibold text-white mt-1 font-[family-name:var(--font-inter)]">{kpi.label}</div>
            <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {liveAuction && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{liveAuction.title} is Live Now</p>
              <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">Bidding is open — don&apos;t miss out</p>
            </div>
          </div>
          <Link href={`/auctions/${liveAuction.id}`} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold text-xs tracking-wider uppercase hover:bg-red-400 transition-all font-[family-name:var(--font-inter)] rounded-lg shrink-0">
            Bid Now <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#c9a84c]" />
            <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Recent Bids</h2>
          </div>
          <Link href="/portal/bids" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)] font-semibold">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#c9a84c]/8">
          {!bidsData || bidsData.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              No bids placed yet. <Link href="/auctions" className="text-[#c9a84c] hover:underline">Browse auctions →</Link>
            </div>
          ) : (
            bidsData.map((bid) => {
              const horse = bid.horses as unknown as { name: string; breed: string; current_price: number; currency: string };
              return (
                <div key={bid.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#060c1d] border border-[#c9a84c]/10 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-[#c9a84c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)] truncate">{horse?.name ?? "Unknown"}</div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{horse?.breed} · {formatDateTime(new Date(bid.created_at))}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">{formatCurrency(Number(bid.amount), bid.currency)}</div>
                    <div className="flex items-center gap-1 text-[10px] justify-end">
                      <Clock className="w-3 h-3 text-[#7a8fa8]" />
                      <span className={`font-[family-name:var(--font-inter)] ${Number(bid.amount) >= Number(horse?.current_price) ? "text-green-400" : "text-red-400"}`}>
                        {Number(bid.amount) >= Number(horse?.current_price) ? "Leading" : "Outbid"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {watchlistHorses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">My Watchlist</h2>
            </div>
            <Link href="/portal/watchlist" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)] font-semibold">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {watchlistHorses.map((horse) => (
              <HorseCard key={horse.id} horse={horse} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
