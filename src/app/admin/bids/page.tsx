import Image from "next/image";
import { redirect } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function AdminBidsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin/bids");

  const { data: bids } = await supabase
    .from("bids")
    .select("id, amount, currency, created_at, horses(id, name, category, current_price, images), profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const totalVolume = (bids ?? []).reduce((sum, b) => sum + Number(b.amount), 0);
  const avgBid = bids && bids.length > 0 ? totalVolume / bids.length : 0;
  const highestBid = bids && bids.length > 0 ? Math.max(...bids.map((b) => Number(b.amount))) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">All Bids</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{bids?.length ?? 0} bids across all auctions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bids", value: (bids?.length ?? 0).toString() },
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
        {!bids || bids.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">No bids placed yet.</div>
        ) : (
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
                {bids.map((bid) => {
                  const horse = bid.horses as unknown as { id: string; name: string; category: string; current_price: number; images: string[] } | null;
                  const bidder = bid.profiles as unknown as { full_name: string | null; email: string } | null;
                  const primaryImage = horse?.images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=80&q=60";
                  const isLeading = horse ? Number(bid.amount) >= Number(horse.current_price) : false;

                  return (
                    <tr key={bid.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-8 rounded overflow-hidden shrink-0 border border-[#c9a84c]/10">
                            <Image src={primaryImage} alt="" fill className="object-cover" sizes="40px" />
                          </div>
                          <span className="font-semibold text-white font-[family-name:var(--font-inter)] text-xs">{horse?.name ?? "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {horse?.category && (
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
                            {categoryLabel(horse.category)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">{formatCurrency(Number(bid.amount))}</td>
                      <td className="px-6 py-3 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                        {bidder?.full_name ?? bidder?.email ?? "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{formatDateTime(new Date(bid.created_at))}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)] ${isLeading ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-[#7a8fa8]/10 text-[#7a8fa8] border-[#7a8fa8]/20"}`}>
                          {isLeading ? "Leading" : "Outbid"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
