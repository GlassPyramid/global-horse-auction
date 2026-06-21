import Link from "next/link";
import Image from "next/image";
import { Gavel, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { mockUser } from "@/lib/mock-data";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MyBidsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">My Bids</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          Your complete bidding history across all Global Horse Auction events.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Bids", value: mockUser.bids.length },
          { label: "Active", value: mockUser.bids.filter((b) => b.amount === b.horse.currentPrice).length },
          { label: "Outbid", value: mockUser.bids.filter((b) => b.amount < b.horse.currentPrice).length },
          {
            label: "Value",
            value: formatCurrency(mockUser.bids.reduce((sum, b) => sum + b.amount, 0)),
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 p-4">
            <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
              {stat.value}
            </div>
            <div className="text-xs text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bids table */}
      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[#c9a84c]" />
          <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">All Bids</h2>
        </div>

        <div className="divide-y divide-[#c9a84c]/8">
          {mockUser.bids.map((bid) => {
            const isLeading = bid.amount === bid.horse.currentPrice;
            const images = JSON.parse(bid.horse.images) as string[];

            return (
              <div key={bid.id} className="px-6 py-5 flex items-center gap-5 hover:bg-[#c9a84c]/2 transition-colors">
                {/* Horse image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#c9a84c]/10">
                  <Image
                    src={images[0]}
                    alt={bid.horse.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">
                      {bid.horse.name}
                    </span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(bid.horse.category))}>
                      {categoryLabel(bid.horse.category)}
                    </span>
                  </div>
                  <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                    {bid.horse.breed} · {formatDateTime(bid.createdAt)}
                  </div>
                </div>

                {/* Bid amount */}
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                    {formatCurrency(bid.amount, bid.currency)}
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs justify-end mt-0.5", isLeading ? "text-green-400" : "text-red-400")}>
                    {isLeading ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-[family-name:var(--font-inter)] font-semibold">
                      {isLeading ? "Leading Bid" : `Outbid — Current: ${formatCurrency(bid.horse.currentPrice, bid.currency)}`}
                    </span>
                  </div>
                </div>

                {/* View button */}
                <Link
                  href={`/horses/${bid.horseId}`}
                  className="shrink-0 p-2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors"
                  aria-label={`View ${bid.horse.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
