import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Gavel, Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toHorse, toAuction, type DbHorse, type DbAuction } from "@/lib/types";
import { mockAuctions, mockHorses } from "@/lib/mock-data";
import { formatDate, categoryLabel, categoryClass } from "@/lib/utils";
import { HorseCard } from "@/components/horses/horse-card";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("auctions")
    .select("*, horses(*, bids(id, amount, bidder_id, created_at))")
    .eq("id", id)
    .single();

  let auction;
  let horses;

  if (row) {
    auction = toAuction(row as unknown as DbAuction);
    horses = auction.horses;
  } else {
    const mock = mockAuctions.find((a) => a.id === id);
    if (!mock) notFound();
    auction = { ...mock, startDate: mock.startDate, endDate: mock.endDate, coverImage: mock.coverImage, horses: mock.horses };
    horses = mockHorses.filter((h) => h.auctionId === id);
  }

  const isLive = auction.status === "LIVE";

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <section className="relative h-72 md:h-96 overflow-hidden">
        {auction.coverImage && (
          <Image src={auction.coverImage} alt={auction.title} fill className="object-cover opacity-50" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060c1d] via-[#060c1d]/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-10 w-full">
            <Link href="/auctions" className="inline-flex items-center gap-2 text-xs text-[#7a8fa8] hover:text-[#c9a84c] transition-colors mb-6 font-[family-name:var(--font-inter)]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Auctions
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase font-[family-name:var(--font-inter)]",
                isLive ? "bg-red-500/20 border-red-500/40 text-red-300" : "bg-blue-500/20 border-blue-500/40 text-blue-300"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-red-400 animate-pulse" : "bg-blue-400")} />
                {isLive ? "Live Now" : auction.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">{auction.title}</h1>
          </div>
        </div>
      </section>

      <div className="bg-[#0a1428] border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              <Gavel className="w-4 h-4 text-[#c9a84c]" /><span>{horses.length} Lots</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              <Clock className="w-4 h-4 text-[#c9a84c]" /><span>{formatDate(auction.startDate)} – {formatDate(auction.endDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
              <MapPin className="w-4 h-4 text-[#c9a84c]" /><span>Live & Online Worldwide</span>
            </div>
          </div>
          {isLive && <CountdownTimer endDate={auction.endDate} compact />}
        </div>
      </div>

      {auction.description && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <p className="text-[#a8bfd4] text-lg leading-relaxed max-w-3xl font-[family-name:var(--font-inter)]">{auction.description}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(horses.map((h) => h.category))).map((cat) => {
            const count = horses.filter((h) => h.category === cat).length;
            return (
              <span key={cat} className={cn("text-xs font-bold px-3 py-1.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(cat))}>
                {categoryLabel(cat)} ({count})
              </span>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {horses.map((horse) => (
            <HorseCard key={horse.id} horse={horse} />
          ))}
        </div>
      </div>
    </div>
  );
}
