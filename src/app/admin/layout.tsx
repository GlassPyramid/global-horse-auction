import Link from "next/link";
import { LayoutDashboard, Footprints, Gavel, Users, MessageSquare, TrendingUp, Settings, ClipboardList } from "lucide-react";
import { AdminSignOut } from "./AdminSignOut";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/horses", label: "Horses", icon: Footprints },
  { href: "/admin/submissions", label: "Submissions", icon: ClipboardList },
  { href: "/admin/auctions", label: "Auctions", icon: Gavel },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bids", label: "All Bids", icon: TrendingUp },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060c1d] flex">
      <aside className="w-60 shrink-0 bg-[#040a18] border-r border-[#c9a84c]/10 flex flex-col pt-20">
        <div className="px-4 py-6 border-b border-[#c9a84c]/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#c9a84c] rounded-full" />
            <span className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.2em" }}>
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7a8fa8] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all font-[family-name:var(--font-inter)] group"
            >
              <item.icon className="w-4 h-4 group-hover:text-[#c9a84c] transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[#c9a84c]/10">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-[#4a5a70] hover:text-[#7a8fa8] transition-all font-[family-name:var(--font-inter)]">
            ← Back to site
          </Link>
          <AdminSignOut />
        </div>
      </aside>

      <div className="flex-1 pt-20 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
