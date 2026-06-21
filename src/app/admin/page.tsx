import Link from "next/link";
import { redirect } from "next/navigation";
import { Gavel, Users, TrendingUp, Clock, Plus, ArrowRight, Footprints } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin");

  const [
    { count: totalBids },
    { count: totalHorses },
    { count: totalUsers },
    { data: liveAuctions },
    { data: recentBids },
    { data: horses },
    { data: bidVolume },
  ] = await Promise.all([
    supabase.from("bids").select("*", { count: "exact", head: true }),
    supabase.from("horses").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("auctions").select("id, title, end_date, status").eq("status", "LIVE"),
    supabase.from("bids").select("id, amount, created_at, horses(name), profiles(full_name, email)").order("created_at", { ascending: false }).limit(6),
    supabase.from("horses").select("id, name, breed, category, current_price, currency, featured, bids(count)").order("created_at", { ascending: false }),
    supabase.from("bids").select("amount"),
  ]);

  const totalVolume = (bidVolume ?? []).reduce((sum, b) => sum + Number(b.amount), 0);
  const estRevenue = totalVolume * 0.1;

  const kpis = [
    { icon: Gavel, label: "Total Bids", value: (totalBids ?? 0).toString(), sub: "Across all auctions", color: "text-[#c9a84c]" },
    { icon: TrendingUp, label: "Est. Revenue", value: formatCurrency(estRevenue), sub: "10% buyer's premium", color: "text-green-400" },
    { icon: Footprints, label: "Active Lots", value: (totalHorses ?? 0).toString(), sub: `${liveAuctions?.length ?? 0} auction live`, color: "text-blue-400" },
    { icon: Users, label: "Registered Users", value: (totalUsers ?? 0).toString(), sub: "Total profiles", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Admin Dashboard</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">Global Horse Auction control panel</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/horses/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-lg">
            <Plus className="w-3.5 h-3.5" /> Add Horse
          </Link>
          <Link href="/admin/auctions/new" className="flex items-center gap-2 px-4 py-2.5 border border-[#c9a84c]/30 text-[#c9a84c] font-bold text-xs tracking-wider uppercase hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] rounded-lg">
            <Plus className="w-3.5 h-3.5" /> New Auction
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-5">
            <kpi.icon className={`w-5 h-5 ${kpi.color} mb-3`} />
            <div className={`text-2xl font-bold font-[family-name:var(--font-playfair)] ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs font-semibold text-white mt-1 font-[family-name:var(--font-inter)]">{kpi.label}</div>
            <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Live Auctions</h2>
            </div>
            <Link href="/admin/auctions" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] font-[family-name:var(--font-inter)] font-semibold">View all →</Link>
          </div>
          {!liveAuctions || liveAuctions.length === 0 ? (
            <div className="px-6 py-8 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">No live auctions right now.</div>
          ) : (
            liveAuctions.map((auction) => (
              <div key={auction.id} className="px-6 py-4 border-b border-[#c9a84c]/8 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm font-[family-name:var(--font-inter)]">{auction.title}</div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Closes {new Date(auction.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/admin/auctions`} className="text-[#c9a84c] hover:text-[#e2c97e]">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#c9a84c]" />
              <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Recent Bids</h2>
            </div>
            <Link href="/admin/bids" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] font-[family-name:var(--font-inter)] font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-[#c9a84c]/8">
            {(recentBids ?? []).map((bid) => {
              const horse = bid.horses as unknown as { name: string } | null;
              const bidder = bid.profiles as unknown as { full_name: string | null; email: string } | null;
              return (
                <div key={bid.id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white font-[family-name:var(--font-inter)] truncate">{horse?.name ?? "Unknown"}</div>
                    <div className="text-[10px] text-[#4a5a70] font-[family-name:var(--font-inter)]">
                      {bidder?.full_name ?? bidder?.email ?? "Bidder"} · {formatDateTime(new Date(bid.created_at))}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#c9a84c] font-[family-name:var(--font-inter)] shrink-0">
                    {formatCurrency(Number(bid.amount))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-[#c9a84c]" />
            <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">Horse Lots</h2>
          </div>
          <Link href="/admin/horses" className="text-xs text-[#c9a84c] hover:text-[#e2c97e] font-[family-name:var(--font-inter)] font-semibold">Manage →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/8">
                {["Name", "Breed", "Category", "Current Bid", "Bids", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {(horses ?? []).map((horse) => {
                const bidCount = (horse.bids as unknown as { count: number }[])?.[0]?.count ?? 0;
                return (
                  <tr key={horse.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/horses/${horse.id}`} className="font-semibold text-white hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">{horse.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-[#7a8fa8] font-[family-name:var(--font-inter)]">{horse.breed}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 font-[family-name:var(--font-inter)]">
                        {horse.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">{formatCurrency(Number(horse.current_price))}</td>
                    <td className="px-6 py-4 text-[#7a8fa8] font-[family-name:var(--font-inter)]">{bidCount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${horse.featured ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-[#7a8fa8]/10 text-[#7a8fa8] border border-[#7a8fa8]/20"} font-[family-name:var(--font-inter)]`}>
                        {horse.featured ? "Featured" : "Standard"}
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
