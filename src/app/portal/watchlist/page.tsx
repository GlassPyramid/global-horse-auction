import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toHorse, type DbHorse } from "@/lib/types";
import { HorseCard } from "@/components/horses/horse-card";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/portal/watchlist");

  const { data: rows } = await supabase
    .from("watchlist")
    .select("horses(*, bids(id, amount, bidder_id, created_at))")
    .eq("user_id", user.id);

  const horses = (rows ?? [])
    .map((r) => r.horses)
    .filter(Boolean)
    .map((h) => toHorse(h as unknown as DbHorse));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">My Watchlist</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          {horses.length} horses saved to your watchlist.
        </p>
      </div>

      {horses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10">
          <Heart className="w-10 h-10 text-[#c9a84c]/30 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">Your watchlist is empty</h3>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            Browse our auctions and click the heart icon to save horses you&apos;re interested in.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {horses.map((horse) => (
            <HorseCard key={horse.id} horse={horse} />
          ))}
        </div>
      )}
    </div>
  );
}
