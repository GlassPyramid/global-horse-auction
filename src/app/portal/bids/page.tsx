import Link from "next/link";
import Image from "next/image";
import { Gavel, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getLang } from "@/lib/lang";
import { t } from "@/lib/i18n";

export default async function MyBidsPage() {
  const lang = await getLang();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/portal/bids");

  const { data: bids } = await supabase
    .from("bids")
    .select("id, amount, currency, created_at, horse_id, horses(id, name, breed, category, current_price, currency, images)")
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  const totalValue = bids?.reduce((sum, b) => sum + Number(b.amount), 0) ?? 0;
  const leading = bids?.filter((b) => Number(b.amount) >= Number((b.horses as unknown as { current_price: number })?.current_price)).length ?? 0;
  const outbid = (bids?.length ?? 0) - leading;

  const stats = [
    { label: t(lang, 'portal', 'statTotalBids'), value: bids?.length ?? 0 },
    { label: t(lang, 'portal', 'statLeading'), value: leading },
    { label: t(lang, 'portal', 'statOutbid'), value: outbid },
    { label: t(lang, 'portal', 'statValue'), value: formatCurrency(totalValue) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-1 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
          {t(lang, 'portal', 'clientPortal')}
        </p>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">{t(lang, 'portal', 'myBids')}</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">
          {t(lang, 'portal', 'myBidsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 p-4">
            <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{stat.value}</div>
            <div className="text-xs text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[#c9a84c]" />
          <h2 className="font-bold text-white font-[family-name:var(--font-inter)] text-sm">{t(lang, 'portal', 'allBids')}</h2>
        </div>

        {!bids || bids.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Gavel className="w-10 h-10 text-[#c9a84c]/30 mx-auto mb-4" />
            <p className="text-white font-bold mb-2 font-[family-name:var(--font-playfair)]">{t(lang, 'portal', 'noBidsYet')}</p>
            <p className="text-[#7a8fa8] text-sm mb-4 font-[family-name:var(--font-inter)]">{t(lang, 'portal', 'noBidsDesc')}</p>
            <Link href="/auctions" className="text-[#c9a84c] hover:underline text-sm font-[family-name:var(--font-inter)]">{t(lang, 'portal', 'browseAuctionsLink')}</Link>
          </div>
        ) : (
          <div className="divide-y divide-[#c9a84c]/8">
            {bids.map((bid) => {
              const horse = bid.horses as unknown as { id: string; name: string; breed: string; category: string; current_price: number; currency: string; images: string[] };
              const isLeading = horse ? Number(bid.amount) >= Number(horse.current_price) : false;
              const primaryImage = horse?.images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&q=80";

              return (
                <div key={bid.id} className="px-6 py-5 flex items-center gap-5 hover:bg-[#c9a84c]/2 transition-colors">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#c9a84c]/10">
                    <Image src={primaryImage} alt={horse?.name ?? ""} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-white font-[family-name:var(--font-inter)]">{horse?.name ?? "Unknown"}</span>
                      {horse?.category && (
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
                          {categoryLabel(horse.category)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      {horse?.breed} · {formatDateTime(new Date(bid.created_at))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
                      {formatCurrency(Number(bid.amount), bid.currency)}
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs justify-end mt-0.5", isLeading ? "text-green-400" : "text-red-400")}>
                      {isLeading ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="font-[family-name:var(--font-inter)] font-semibold">
                        {isLeading ? t(lang, 'portal', 'leadingBid') : horse ? `${t(lang, 'portal', 'outbidCurrent')} ${formatCurrency(Number(horse.current_price), horse.currency)}` : t(lang, 'portal', 'outbid')}
                      </span>
                    </div>
                  </div>
                  {horse?.id && (
                    <Link href={`/horses/${horse.id}`} className="shrink-0 p-2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors" aria-label={`View ${horse.name}`}>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
