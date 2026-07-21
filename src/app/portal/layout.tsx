"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Gavel, Heart, Settings, LogOut, LayoutDashboard, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [bidsCount, setBidsCount] = useState(0);
  const [watchCount, setWatchCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?redirectTo=/portal"); return; }
      setDisplayName(user.user_metadata?.full_name ?? user.email ?? "");
      supabase.from("profiles").select("full_name, role").eq("id", user.id).single().then(({ data }) => {
        if (data?.full_name) setDisplayName(data.full_name);
        if (data?.role) setRole(data.role);
      });
      supabase.from("bids").select("id", { count: "exact", head: true }).eq("bidder_id", user.id).then(({ count }) => setBidsCount(count ?? 0));
      supabase.from("watchlist").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => setWatchCount(count ?? 0));
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
    { href: "/portal/bids", label: t('portal', 'myBids'), icon: Gavel },
    { href: "/portal/horses", label: t('portal', 'myPawPrints'), icon: PawPrint },
    { href: "/portal/watchlist", label: t('portal', 'watchlist'), icon: Heart },
    { href: "/portal/profile", label: t('portal', 'profile'), icon: User },
    { href: "/portal/settings", label: t('portal', 'settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
              <div className="p-6 border-b border-[#c9a84c]/10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c] flex items-center justify-center text-lg font-bold text-[#060c1d] font-[family-name:var(--font-inter)] shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm font-[family-name:var(--font-inter)] truncate">{displayName}</div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] capitalize">{role?.toLowerCase() || "Bidder"}</div>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {navItems.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all font-[family-name:var(--font-inter)] ${
                        active ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5"
                      }`}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#c9a84c]/10 grid grid-cols-2 gap-3">
                <div className="bg-[#060c1d]/60 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{bidsCount}</div>
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-0.5">{t('portal', 'bids')}</div>
                </div>
                <div className="bg-[#060c1d]/60 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{watchCount}</div>
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-0.5">{t('portal', 'watching')}</div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/5 transition-all font-[family-name:var(--font-inter)]">
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
