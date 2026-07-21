"use client";

import Link from "next/link";
import { Mail, Phone, Globe, ExternalLink, Rss, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#040a18] border-t border-[#c9a84c]/10 mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="text-2xl font-bold tracking-widest text-white font-[family-name:var(--font-playfair)]" style={{ letterSpacing: "0.2em" }}>
                GLOBAL
              </div>
              <div className="text-sm font-bold tracking-widest" style={{ color: "#c9a84c", letterSpacing: "0.3em", fontFamily: "var(--font-inter)" }}>
                HORSE AUCTION
              </div>
              <div className="text-xs mt-1" style={{ color: "#7a8fa8", fontFamily: "var(--font-inter)", letterSpacing: "0.15em" }}>
                {t('footer', 'tagline')}
              </div>
            </div>
            <p className="text-[#7a8fa8] text-sm leading-relaxed font-[family-name:var(--font-inter)]">
              {t('footer', 'description')}
            </p>
            <div className="flex gap-4 mt-6">
              {[ExternalLink, Rss, Share2].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-full border border-[#c9a84c]/20 flex items-center justify-center text-[#7a8fa8] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase mb-5 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
              {t('footer', 'auctions')}
            </h4>
            <ul className="space-y-3">
              {[
                [t('nav', 'liveAuctions'), "/auctions?status=live"],
                [t('nav', 'upcomingAuctions'), "/auctions?status=upcoming"],
                [t('nav', 'pastResults'), "/auctions?status=completed"],
                [t('footer', 'howToBid'), "/how-it-works"],
                [t('footer', 'sellYourHorse'), "/sell"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase mb-5 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
              {t('footer', 'categories')}
            </h4>
            <ul className="space-y-3">
              {[
                [t('nav', 'futureStars'), "/horses?category=FUTURE_STARS"],
                [t('nav', 'competitionReady'), "/horses?category=COMPETITION_READY"],
                [t('nav', 'eliteSport'), "/horses?category=ELITE_SPORT"],
                [t('nav', 'breedingInvestment'), "/horses?category=BREEDING_INVESTMENT"],
                [t('footer', 'myWatchlist'), "/portal/watchlist"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#c9a84c] uppercase mb-5 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
              {t('footer', 'contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                <a href="mailto:info@globalhorseauction.com" className="text-sm text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                  info@globalhorseauction.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                <a href="tel:+31201234567" className="text-sm text-[#7a8fa8] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                  +31 20 123 4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                <span className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                  {t('footer', 'operatingIn')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#c9a84c]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
            &copy; {new Date().getFullYear()} Global Horse Auction. {t('footer', 'allRightsReserved')}
          </p>
          <div className="flex gap-6">
            {[
              [t('footer', 'privacyPolicy'), "/privacy"],
              [t('footer', 'termsConditions'), "/terms"],
              [t('footer', 'cookiePolicy'), "/cookies"],
              [t('footer', 'buyersGuide'), "/buyers-guide"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs text-[#4a5a70] hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-inter)]">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
