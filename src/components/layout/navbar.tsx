"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Heart, Gavel, LayoutDashboard, Shield, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const navLinks = [
    {
      label: t('nav', 'auctions'),
      href: "/auctions",
      children: [
        { label: t('nav', 'liveAuctions'), href: "/auctions?status=live" },
        { label: t('nav', 'upcomingAuctions'), href: "/auctions?status=upcoming" },
        { label: t('nav', 'pastResults'), href: "/auctions?status=completed" },
      ],
    },
    {
      label: t('nav', 'horses'),
      href: "/horses",
      children: [
        { label: t('nav', 'futureStars'), href: "/horses?category=FUTURE_STARS" },
        { label: t('nav', 'competitionReady'), href: "/horses?category=COMPETITION_READY" },
        { label: t('nav', 'eliteSport'), href: "/horses?category=ELITE_SPORT" },
        { label: t('nav', 'breedingInvestment'), href: "/horses?category=BREEDING_INVESTMENT" },
      ],
    },
    { label: t('nav', 'howItWorks'), href: "/how-it-works" },
    { label: t('nav', 'about'), href: "/about" },
    { label: t('nav', 'contact'), href: "/contact" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setDisplayName(user.user_metadata?.full_name ?? user.email ?? "");
        supabase.from("profiles").select("role, full_name").eq("id", user.id).single().then(({ data }) => {
          if (data?.role === "ADMIN") setIsAdmin(true);
          if (data?.full_name) setDisplayName(data.full_name);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) { setIsAdmin(false); setDisplayName(""); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#060c1d]/95 backdrop-blur-md border-b border-[#c9a84c]/15 shadow-2xl"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <GHALogo />
            <div className="hidden sm:block">
              <div className="text-lg font-bold tracking-widest text-white leading-none font-[family-name:var(--font-playfair)]" style={{ letterSpacing: "0.25em" }}>
                GLOBAL
              </div>
              <div className="text-sm tracking-widest font-bold leading-none" style={{ color: "#c9a84c", letterSpacing: "0.35em", fontFamily: "var(--font-inter)" }}>
                HORSE AUCTION
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex flex-1 justify-center items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href={link.href}
                  className={cn("flex items-center gap-1 px-3 py-2 text-[11px] tracking-wide font-[family-name:var(--font-inter)] font-medium text-[#a8bfd4] hover:text-[#c9a84c] transition-colors duration-200 uppercase whitespace-nowrap", openDropdown === link.label && "text-[#c9a84c]")}
                >
                  {link.label}
                  {link.children && <ChevronDown className={cn("w-3 h-3 transition-transform shrink-0", openDropdown === link.label && "rotate-180")} />}
                </Link>
                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-[#0a1428]/98 backdrop-blur-md border border-[#c9a84c]/20 rounded-lg overflow-hidden shadow-2xl min-w-52">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="block px-5 py-3 text-sm text-[#a8bfd4] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors font-[family-name:var(--font-inter)] border-b border-[#c9a84c]/10 last:border-0">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/sell" className="px-3 py-1.5 text-[11px] font-bold text-[#c9a84c] border border-[#c9a84c]/30 rounded hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] tracking-normal uppercase whitespace-nowrap">
                  {t('nav', 'sellHorse')}
                </Link>
                <Link href="/portal/watchlist" className="p-2 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors" aria-label="Watchlist">
                  <Heart className="w-5 h-5" />
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c]/30 text-[#c9a84c] text-[11px] font-bold rounded-lg hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)] uppercase tracking-normal">
                    <Shield className="w-3.5 h-3.5" /> {t('nav', 'admin')}
                  </Link>
                )}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-all">
                    <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center text-xs font-bold text-[#060c1d] font-[family-name:var(--font-inter)]">
                      {initials}
                    </div>
                    <ChevronDown className={cn("w-3 h-3 text-[#c9a84c] transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[#0a1428]/98 backdrop-blur-md border border-[#c9a84c]/20 rounded-lg overflow-hidden shadow-2xl">
                      <div className="px-4 py-3 border-b border-[#c9a84c]/10">
                        <p className="text-sm font-semibold text-white font-[family-name:var(--font-inter)]">{displayName}</p>
                        <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{isAdmin ? t('nav', 'admin') : "Bidder"}</p>
                      </div>
                      {[
                        { href: "/portal", label: t('nav', 'myPortal'), icon: <User className="w-4 h-4" /> },
                        { href: "/portal/bids", label: t('nav', 'myBids'), icon: <Gavel className="w-4 h-4" /> },
                        { href: "/portal/horses", label: t('nav', 'myHorses'), icon: <PawPrint className="w-4 h-4" /> },
                        { href: "/portal/watchlist", label: t('nav', 'watchlist'), icon: <Heart className="w-4 h-4" /> },
                        ...(isAdmin ? [{ href: "/admin", label: t('nav', 'adminPanel'), icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
                      ].map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#a8bfd4] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors font-[family-name:var(--font-inter)] border-b border-[#c9a84c]/10 last:border-0">
                          <span className="text-[#c9a84c]/60">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/5 transition-colors font-[family-name:var(--font-inter)]">
                        <LogOut className="w-4 h-4" /> {t('nav', 'signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-[11px] font-medium text-[#a8bfd4] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)] tracking-normal uppercase whitespace-nowrap">
                  {t('nav', 'signIn')}
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-[11px] font-semibold bg-[#c9a84c] text-[#060c1d] rounded hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] tracking-normal uppercase whitespace-nowrap">
                  {t('nav', 'register')}
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[#a8bfd4] hover:text-[#c9a84c] transition-colors" aria-label="Menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0a1428]/98 backdrop-blur-md border-t border-[#c9a84c]/15">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-[#a8bfd4] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)] tracking-widest uppercase border-b border-[#c9a84c]/10">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1">
              <LanguageSwitcher />
            </div>
            {user ? (
              <div className="pt-2 flex gap-3">
                <Link href="/portal" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium border border-[#c9a84c]/30 text-[#c9a84c] rounded hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
                  {t('nav', 'myPortal')}
                </Link>
                <button onClick={handleSignOut} className="flex-1 text-center py-2.5 text-sm font-medium border border-red-400/30 text-red-400 rounded hover:bg-red-400/5 transition-all font-[family-name:var(--font-inter)]">
                  {t('nav', 'signOut')}
                </button>
              </div>
            ) : (
              <div className="pt-2 flex gap-3">
                <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-[#c9a84c]/30 text-[#a8bfd4] rounded hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all font-[family-name:var(--font-inter)]">
                  {t('nav', 'signIn')}
                </Link>
                <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-semibold bg-[#c9a84c] text-[#060c1d] rounded hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)]">
                  {t('nav', 'register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function GHALogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4C20 4 14 8 13 14C12 18 14 20 16 21C14 22 12 24 13 28C14 33 19 36 20 36C21 36 26 33 27 28C28 24 26 22 24 21C26 20 28 18 27 14C26 8 20 4 20 4Z" fill="#c9a84c" opacity="0.9" />
      <path d="M16 18C16 18 18 17 20 17C22 17 24 18 24 18" stroke="#060c1d" strokeWidth="1" strokeLinecap="round" />
      <circle cx="17" cy="14" r="1.5" fill="#060c1d" />
    </svg>
  );
}
