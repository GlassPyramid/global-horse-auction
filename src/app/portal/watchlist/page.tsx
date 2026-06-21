import { Heart } from "lucide-react";
import { mockUser } from "@/lib/mock-data";
import { HorseCard } from "@/components/horses/horse-card";

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">My Watchlist</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          {mockUser.watchlist.length} horses saved to your watchlist.
        </p>
      </div>

      {mockUser.watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10">
          <Heart className="w-10 h-10 text-[#c9a84c]/30 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
            Your watchlist is empty
          </h3>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            Browse our auctions and click the heart icon to save horses you&apos;re interested in.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockUser.watchlist.map(({ horse }) => (
            <HorseCard key={horse.id} horse={horse} />
          ))}
        </div>
      )}
    </div>
  );
}
