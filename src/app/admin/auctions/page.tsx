import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Eye, Gavel } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/auctions/countdown-timer";
import { AuctionActions } from "./AuctionActions";

const statusConfig = {
  LIVE: { label: "Live", class: "bg-red-400/10 text-red-400 border-red-400/20" },
  UPCOMING: { label: "Upcoming", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  COMPLETED: { label: "Completed", class: "bg-[#7a8fa8]/10 text-[#7a8fa8] border-[#7a8fa8]/20" },
  CLOSED: { label: "Closed", class: "bg-[#7a8fa8]/10 text-[#7a8fa8] border-[#7a8fa8]/20" },
};

export default async function AdminAuctionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin/auctions");

  const { data: auctions } = await supabase
    .from("auctions")
    .select("*, horses(count)")
    .order("start_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Auctions</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{auctions?.length ?? 0} auctions in the system</p>
        </div>
        <Link href="/admin/auctions/new" className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
          <Plus className="w-4 h-4" /> New Auction
        </Link>
      </div>

      <div className="space-y-4">
        {(auctions ?? []).map((auction) => {
          const cfg = statusConfig[auction.status as keyof typeof statusConfig] ?? statusConfig.UPCOMING;
          const isLive = auction.status === "LIVE";
          const horseCount = (auction.horses as unknown as { count: number }[])?.[0]?.count ?? 0;

          return (
            <div key={auction.id} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/25 transition-all p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border font-[family-name:var(--font-inter)]", cfg.class)}>
                      {isLive && <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5 animate-pulse" />}
                      {cfg.label}
                    </span>
                    {auction.featured && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20 font-[family-name:var(--font-inter)]">Featured</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-1">{auction.title}</h3>
                  {auction.description && (
                    <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] line-clamp-2 mb-3">{auction.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                    <span>Opens: {formatDate(new Date(auction.start_date))}</span>
                    <span>Closes: {formatDate(new Date(auction.end_date))}</span>
                    <span className="flex items-center gap-1"><Gavel className="w-3.5 h-3.5" />{horseCount} lots</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  {isLive && <CountdownTimer endDate={new Date(auction.end_date)} compact />}
                  <div className="flex gap-2">
                    <Link href={`/auctions/${auction.id}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c]/20 text-[#7a8fa8] hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all text-xs font-[family-name:var(--font-inter)] rounded-lg">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </div>
                </div>
              </div>
              <AuctionActions auctionId={auction.id} currentStatus={auction.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
