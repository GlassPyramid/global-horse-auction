import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminUserActions } from "./AdminUserActions";
import { CheckCircle, Clock } from "lucide-react";

const roleConfig = {
  BIDDER: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  SELLER: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  ADMIN: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin/users");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, country, role, verified, created_at, bids(count)")
    .order("created_at", { ascending: false });

  const total = profiles?.length ?? 0;
  const verified = profiles?.filter((p) => p.verified).length ?? 0;
  const pending = total - verified;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Users</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{total} registered users</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: total },
          { label: "Verified", value: verified },
          { label: "Pending Review", value: pending },
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
              {(profiles ?? []).map((profile) => {
                const initials = (profile.full_name ?? profile.email ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                const bidCount = (profile.bids as unknown as { count: number }[])?.[0]?.count ?? 0;
                return (
                  <tr key={profile.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-xs font-bold text-[#060c1d] shrink-0 font-[family-name:var(--font-inter)]">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white font-[family-name:var(--font-inter)]">{profile.full_name ?? "—"}</div>
                          <div className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">{profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#7a8fa8] font-[family-name:var(--font-inter)]">{profile.country ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border font-[family-name:var(--font-inter)] ${roleConfig[profile.role as keyof typeof roleConfig] ?? roleConfig.BIDDER}`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {profile.verified
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <Clock className="w-4 h-4 text-amber-400" />}
                    </td>
                    <td className="px-6 py-4 text-[#a8bfd4] font-[family-name:var(--font-inter)]">{bidCount}</td>
                    <td className="px-6 py-4 text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <AdminUserActions userId={profile.id} verified={profile.verified} role={profile.role} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
