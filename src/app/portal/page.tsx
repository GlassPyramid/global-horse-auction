import Link from "next/link";
import { Gavel, Heart, TrendingUp, Clock, ChevronRight, Trophy } from "lucide-react";
import { mockUser, mockAuctions } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { HorseCard } from "@/components/horses/horse-card";

export default function PortalDashboard() {
  const totalBidValue = mockUser.bids.reduce((sum, b) => sum + b.amount, 0);
  const liveAuction = mockAuctions.find((a) => a.status === "LIVE");

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <p
          className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]"
          style={{ letterSpacing: "0.2em" }}
        >
          Welcome Back
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
          {mockUser.name}
        </h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          Premium Bidder · {mockUser.country}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Gavel,
            label: "Total Bids Placed",
            value: mockUser.bids.length.toString(),
            sub: "Across all auctions",
            color: "text-[#c9a84c]",
          },
          {
            icon: TrendingUp,
            label: "Total Bid Value",
            value: formatCurrency(totalBidValue),
            sub: "Combined bid amount",
            color: "text-green-400",
          },
          {
            icon: Heart,
            label: "Watchlist",
            value: mockUser.watchlist.length.toString(),
            sub: "Horses saved",
            color: "text-pink-400",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className={`text-2xl font-bold font-[family-name:var(--font-playfair)] ${kpi.color}`}>
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-white mt-1 font-[family-name:var(--font-inter)]">
              {kpi.label}
            </div>
            <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Live auction alert */}
      {liveAuction && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">
                {liveAuction.title} is Live Now
              </p>
              <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                {liveAuction.horses.length} lots available for bidding
              </p>
            </div>
          </div>
          <Link
            href={`/auctions/${liveAuction.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold text-xs tracking-wider uppercase hover:bg-red-400 transition-all font-[family-name:var(--font-inter)] rounded-lg shrink-0"
          >
            Bid Now <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent bids */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#c9a84c]" />
            <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">
              Recent Bids
            </h2>
          </div>
          <Link
            href="/portal/bids"
            className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)] font-semibold"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#c9a84c]/8">
          {mockUser.bids.map((bid) => (
            <div key={bid.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#060c1d] border border-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-[#c9a84c]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white font-[family-name:var(--font-inter)] truncate">
                  {bid.horse.name}
                </div>
                <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                  {bid.horse.breed} · {formatDateTime(bid.createdAt)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                  {formatCurrency(bid.amount, bid.currency)}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#7a8fa8] justify-end">
                  <Clock className="w-3 h-3" />
                  <span className="font-[family-name:var(--font-inter)]">
                    {bid.amount === bid.horse.currentPrice ? "Leading" : "Outbid"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist preview */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#c9a84c]" />
            <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">
              My Watchlist
            </h2>
          </div>
          <Link
            href="/portal/watchlist"
            className="text-xs text-[#c9a84c] hover:text-[#e2c97e] transition-colors font-[family-name:var(--font-inter)] font-semibold"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockUser.watchlist.map(({ horse }) => (
            <HorseCard key={horse.id} horse={horse} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
