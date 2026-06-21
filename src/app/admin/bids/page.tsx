import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { mockHorses } from "@/lib/mock-data";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

const allBids = mockHorses
  .flatMap((h) => h.bids.map((b) => ({ ...b, horse: h })))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const totalVolume = allBids.reduce((sum, b) => sum + b.amount, 0);
const avgBid = totalVolume / allBids.length;
const highestBid = Math.max(...allBids.map((b) => b.amount));

export default function AdminBidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">All Bids</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{allBids.length} bids across all auctions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bids", value: allBids.length.toString() },
          { label: "Total Volume", value: formatCurrency(totalVolume) },
          { label: "Average Bid", value: formatCurrency(avgBid) },
          { label: "Highest Bid", value: formatCurrency(highestBid) },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 p-4">
            <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{s.value}</div>
            <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
          <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Bid Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/10">
                {["Horse", "Category", "Amount", "Bidder", "Time", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {allBids.map((bid) => {
                const images = JSON.parse(bid.horse.images) as string[];
                const isLeading = bid.amount === bid.horse.currentPrice;

                return (
                  <tr key={bid.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-8 rounded overflow-hidden shrink-0 border border-[#c9a84c]/10">
                          <Image src={images[0]} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="font-semibold text-white font-[family-name:var(--font-inter)] text-xs">{bid.horse.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(bid.horse.category))}>
                        {categoryLabel(bid.horse.category)}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                      {formatCurrency(bid.amount)}
                    </td>
                    <td className="px-6 py-3 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      #{bid.userId.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      {formatDateTime(bid.createdAt)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)] ${
                        isLeading
                          ? "bg-green-400/10 text-green-400 border-green-400/20"
                          : "bg-[#7a8fa8]/10 text-[#7a8fa8] border-[#7a8fa8]/20"
                      }`}>
                        {isLeading ? "Leading" : "Outbid"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
