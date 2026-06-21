import Link from "next/link";
import { User, Gavel, Heart, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/bids", label: "My Bids", icon: Gavel },
  { href: "/portal/watchlist", label: "Watchlist", icon: Heart },
  { href: "/portal/profile", label: "Profile", icon: User },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
              {/* User info */}
              <div className="p-6 border-b border-[#c9a84c]/10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c] flex items-center justify-center text-lg font-bold text-[#060c1d] font-[family-name:var(--font-inter)] shrink-0">
                    {mockUser.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm font-[family-name:var(--font-inter)] truncate">
                      {mockUser.name}
                    </div>
                    <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      Premium Bidder
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all font-[family-name:var(--font-inter)] group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-[#c9a84c] transition-colors" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Stats */}
              <div className="p-4 border-t border-[#c9a84c]/10 grid grid-cols-2 gap-3">
                <div className="bg-[#060c1d]/60 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                    {mockUser.bids.length}
                  </div>
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-0.5">
                    Bids
                  </div>
                </div>
                <div className="bg-[#060c1d]/60 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                    {mockUser.watchlist.length}
                  </div>
                  <div className="text-[10px] text-[#4a5a70] uppercase tracking-wider font-[family-name:var(--font-inter)] mt-0.5">
                    Watching
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <div className="p-4 pt-0">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/5 transition-all font-[family-name:var(--font-inter)]">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
