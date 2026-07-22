"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Gavel, Heart, Settings, LogOut, LayoutDashboard, PawPrint, CheckCircle, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState(false);
  const [bidsCount, setBidsCount] = useState(0);
  const [watchCount, setWatchCount] = useState(0);
  const [outbidCount, setOutbidCount] = useState(0);
  const [hasLiveAuction, setHasLiveAuction] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login?redirectTo=/portal"); return; }

      setDisplayName(user.user_metadata?.full_name ?? user.email ?? "");

      const [profRes, bidsRes, watchRes, liveRes] = await Promise.all([
        supabase.from("profiles").select("full_name, role, verified").eq("id", user.id).single(),
        supabase.from("bids")
          .select("id, amount, horses(id, current_price)")
          .eq("bidder_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("watchlist").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("auctions").select("id").eq("status", "LIVE").limit(1),
      ]);

      if (profRes.data?.full_name) setDisplayName(profRes.data.full_name);
      if (profRes.data?.role) setRole(profRes.data.role);
      if (profRes.data?.verified) setVerified(true);

      // Deduplicate bids by horse
      const bids = ((bidsRes.data ?? []) as unknown) as { id: string; amount: number; horses: { id: string; current_price: number } | null }[];
      const byHorse: Record<string, typeof bids[0]> = {};
      for (const b of bids) {
        if (b.horses?.id && !byHorse[b.horses.id]) byHorse[b.horses.id] = b;
      }
      const unique = Object.values(byHorse);
      setBidsCount(unique.length);
      setOutbidCount(unique.filter(b => b.horses && Number(b.amount) < Number(b.horses.current_price)).length);
      setWatchCount(watchRes.count ?? 0);
      setHasLiveAuction((liveRes.data?.length ?? 0) > 0);
    });
  }, [router]);

  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/portal", label: t('portal', 'dashboard'), icon: LayoutDashboard, exact: true },
    { href: "/portal/bids", label: t('portal', 'myBids'), icon: Gavel, badge: outbidCount > 0 ? outbidCount : undefined, badgeColor: "bg-red-500" },
    { href: "/portal/horses", label: t('portal', 'myHorses'), icon: PawPrint },
    { href: "/portal/watchlist", label: t('portal', 'watchlist'), icon: Heart, badge: watchCount > 0 ? watchCount : undefined, badgeColor: "bg-[#c9a84c]/80" },
    { href: "/portal/profile", label: t('portal', 'profile'), icon: User },
    { href: "/portal/settings", label: t('portal', 'settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden sticky top-28">

              {/* User card */}
              <div className="p-5 border-b border-[#c9a84c]/10 bg-gradient-to-br from-[#0d1f38] to-[#0a1428]">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e2c97e] flex items-center justify-center text-sm font-bold text-[#060c1d] font-[family-name:var(--font-inter)]">
                      {initials}
                    </div>
                    {hasLiveAuction && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full border-2 border-[#0a1428] animate-pulse" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm font-[family-name:var(--font-inter)] truncate">{displayName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#7a8fa8] font-[family-name:var(--font-inter)] capitalize">{role?.toLowerCase() || "Bidder"}</span>
                      {verified && (
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {hasLiveAuction && (
                  <Link href="/auctions"
                    className="mt-3 flex items-center gap-2 w-full px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/20 transition-all font-[family-name:var(--font-inter)]">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    Auction Live Now
                    <span className="ml-auto w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  </Link>
                )}
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all font-[family-name:var(--font-inter)] ${
                        active
                          ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/15"
                          : "text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 border border-transparent"
                      }`}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Stats strip */}
              <div className="mx-3 mb-3 p-3 bg-[#060c1d]/60 rounded-xl grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{bidsCount}</div>
                  <div className="text-[9px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)]">{t('portal', 'bids')}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{watchCount}</div>
                  <div className="text-[9px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)]">{t('portal', 'watching')}</div>
                </div>
              </div>

              {/* Sign out */}
              <div className="p-3 pt-0">
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#4a5a70] hover:text-red-400 hover:bg-red-400/5 transition-all font-[family-name:var(--font-inter)]">
                  <LogOut className="w-4 h-4" />
                  {t('portal', 'signOut')}
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
