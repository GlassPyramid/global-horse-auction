import { Search, Shield, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock users — replace with Supabase query
const users = [
  { id: "u1", name: "Gianni Doncarlo", email: "info@glasspyramid.com", country: "Italy", role: "BIDDER", verified: true, bids: 3, joinedAt: new Date("2026-01-15") },
  { id: "u2", name: "Sophie van Dijke", email: "s.dijke@equinvest.nl", country: "Netherlands", role: "BIDDER", verified: true, bids: 5, joinedAt: new Date("2026-03-02") },
  { id: "u3", name: "Marcus Eberhardt", email: "m.eberhardt@sportpferde.de", country: "Germany", role: "SELLER", verified: true, bids: 4, joinedAt: new Date("2026-02-20") },
  { id: "u4", name: "Isabella Ferraro", email: "i.ferraro@equitalia.it", country: "Italy", role: "BIDDER", verified: false, bids: 0, joinedAt: new Date("2026-06-18") },
  { id: "u5", name: "Pierre Beaumont", email: "p.beaumont@haras-france.fr", country: "France", role: "SELLER", verified: true, bids: 2, joinedAt: new Date("2026-04-10") },
];

const roleConfig = {
  BIDDER: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  SELLER: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  ADMIN: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Users</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{users.length} registered users (showing sample)</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8fa8]" />
        <input
          placeholder="Search users..."
          className="w-full bg-[#0a1428] border border-[#c9a84c]/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: "12,847", icon: "👤" },
          { label: "Verified", value: "11,203", icon: "✅" },
          { label: "Pending Review", value: "1,644", icon: "⏳" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a1428] rounded-xl border border-[#c9a84c]/10 p-4">
            <div className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">{s.value}</div>
            <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/10">
                {["User", "Country", "Role", "Verified", "Bids", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-xs font-bold text-[#060c1d] shrink-0 font-[family-name:var(--font-inter)]">
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white font-[family-name:var(--font-inter)]">{user.name}</div>
                        <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#7a8fa8] font-[family-name:var(--font-inter)]">{user.country}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border font-[family-name:var(--font-inter)] ${roleConfig[user.role as keyof typeof roleConfig]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#a8bfd4] font-[family-name:var(--font-inter)]">{user.bids}</td>
                  <td className="px-6 py-4 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                    {user.joinedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border border-green-400/20 text-green-400 hover:bg-green-400/10 rounded-lg transition-all font-[family-name:var(--font-inter)]">
                        <Shield className="w-3 h-3" /> Verify
                      </button>
                      <button className="p-1.5 text-[#7a8fa8] hover:text-red-400 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
