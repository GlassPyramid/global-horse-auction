import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Gavel } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toHorse, toAuction, type DbHorse, type DbAuction } from "@/lib/types";
import { mockAuctions, mockHorses } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { HorseCard } from "@/components/horses/horse-card";
import { CountdownTimer } from "@/components/auctions/countdown-timer";

const statusConfig = {
  LIVE: { label: "Live Now", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", dot: "bg-red-400" },
  UPCOMING: { label: "Upcoming", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", dot: "bg-blue-400" },
  COMPLETED: { label: "Completed", color: "text-[#7a8fa8]", bg: "bg-[#7a8fa8]/10 border-[#7a8fa8]/30", dot: "bg-[#7a8fa8]" },
  CLOSED: { label: "Closed", color: "text-[#7a8fa8]", bg: "bg-[#7a8fa8]/10 border-[#7a8fa8]/30", dot: "bg-[#7a8fa8]" },
};

export default async function AuctionsPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("auctions")
    .select("*, horses(*, bids(id, amount, bidder_id, created_at))")
    .order("start_date", { ascending: false });

  const auctions =
    rows && rows.length > 0
      ? rows.map((a) => toAuction(a as unknown as DbAuction))
      : mockAuctions.map((a) => ({
          ...a,
          startDate: a.startDate,
          endDate: a.endDate,
          coverImage: a.coverImage,
          horses: a.horses,
        }));

  const liveAuctions = auctions.filter((a) => a.status === "LIVE");
  const upcomingAuctions = auctions.filter((a) => a.status === "UPCOMING");
  const liveHorses = liveAuctions[0]?.horses ?? mockHorses.filter((h) => h.auctionId === "a1");

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <section className="relative py-20 overflow-hidden border-b border-[#c9a84c]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1428] to-[#060c1d]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            Global Horse Auction
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Current Auctions
          </h1>
          <p className="text-lg text-[#7a8fa8] font-[family-name:var(--font-inter)] max-w-xl">
            Hand-selected exceptional horses available for bidding. Every horse is vet-checked, fully documented, and ready for its next chapter.
          </p>
        </div>
      </section>

      {liveAuctions.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Live Now</h2>
          </div>

          {liveAuctions.map((auction) => {
            const cfg = statusConfig[auction.status as keyof typeof statusConfig] ?? statusConfig.LIVE;
            return (
              <div key={auction.id} className="relative rounded-2xl overflow-hidden border border-[#c9a84c]/20 mb-8 bg-[#0a1428]">
                <div className="relative h-72 md:h-96">
                  {auction.coverImage && (
                    <Image src={auction.coverImage} alt={auction.title} fill className="object-cover opacity-60" sizes="100vw" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a1428] via-[#0a1428]/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-10 py-8 max-w-lg">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase mb-4 font-[family-name:var(--font-inter)] ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                        {cfg.label}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">{auction.title}</h3>
                      <p className="text-[#a8bfd4] text-sm leading-relaxed mb-6 font-[family-name:var(--font-inter)]">{auction.description}</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                          <Clock className="w-4 h-4 text-[#c9a84c]" />
                          Closes: {formatDate(auction.endDate)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                          <Gavel className="w-4 h-4 text-[#c9a84c]" />
                          {auction.horses.length} Lots
                        </div>
                      </div>
                      <CountdownTimer endDate={auction.endDate} />
                    </div>
                  </div>
                </div>
                <div className="px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#c9a84c]/10">
                  <div className="flex items-center gap-6">
                    {auction.horses.slice(0, 3).map((horse) => (
                      <div key={horse.id} className="text-center">
                        <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] truncate max-w-24">{horse.name}</div>
                        <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                          {formatCurrency(horse.currentPrice, horse.currency)}
                        </div>
                      </div>
                    ))}
                    {auction.horses.length > 3 && (
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">+{auction.horses.length - 3} more</div>
                    )}
                  </div>
                  <Link href={`/auctions/${auction.id}`} className="flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)]">
                    Enter Auction <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">All Current Lots</h2>
            <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
              {liveHorses.length} horses available
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveHorses.map((horse) => (
            <HorseCard key={horse.id} horse={horse} />
          ))}
        </div>
      </section>

      {upcomingAuctions.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-10">Upcoming Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAuctions.map((auction) => {
              const cfg = statusConfig[auction.status as keyof typeof statusConfig] ?? statusConfig.UPCOMING;
              return (
                <div key={auction.id} className="relative rounded-xl overflow-hidden border border-[#c9a84c]/10 bg-[#0a1428] hover:border-[#c9a84c]/30 transition-all group">
                  <div className="relative h-48">
                    {auction.coverImage && (
                      <Image src={auction.coverImage} alt={auction.title} fill className="object-cover opacity-50 group-hover:opacity-60 transition-opacity" sizes="(max-width: 768px) 100vw, 50vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase mb-3 font-[family-name:var(--font-inter)] ${cfg.bg} ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">{auction.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#7a8fa8] mb-4 font-[family-name:var(--font-inter)]">
                      <span>Opens: {formatDate(auction.startDate)}</span>
                      <span>{auction.horses.length} Lots</span>
                    </div>
                    <Link href={`/auctions/${auction.id}`} className="inline-flex items-center gap-2 text-sm text-[#c9a84c] hover:text-[#e2c97e] font-semibold tracking-wider uppercase transition-colors font-[family-name:var(--font-inter)] group-hover:gap-3">
                      Preview Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
