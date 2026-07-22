import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmissionActions from "@/components/admin/SubmissionActions";
import { formatCurrency } from "@/lib/utils";

type Status = "all" | "pending" | "under_review" | "approved" | "rejected";

const statusColors: Record<string, string> = {
  pending: "#F59E0B",
  under_review: "#3B82F6",
  approved: "#10B981",
  rejected: "#EF4444",
  published: "#8B5CF6",
};

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") redirect("/portal");

  const params = await searchParams;
  const statusFilter = params.status as Status ?? "all";

  const service = createServiceClient();
  let query = (await service)
    .from("horse_submissions")
    .select("*, profiles!seller_id(full_name, email)")
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: submissions } = await query;

  const tabs: { value: Status; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Horse Submissions</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">Review and approve seller submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0a1428] p-1 rounded-xl border border-[#c9a84c]/10 w-fit">
        {tabs.map((tab) => (
          <a key={tab.value} href={`/admin/submissions?status=${tab.value}`}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase font-[family-name:var(--font-inter)] transition-all ${
              statusFilter === tab.value
                ? "bg-[#c9a84c] text-[#060c1d]"
                : "text-[#7a8fa8] hover:text-[#c9a84c]"
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      {/* Submissions list */}
      <div className="space-y-4">
        {!submissions?.length ? (
          <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-12 text-center text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            No submissions found.
          </div>
        ) : (
          submissions.map((s) => {
            const seller = s.profiles as { full_name?: string; email?: string } | null;
            return (
              <div key={s.id} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
                <div className="flex items-start gap-5 p-5">
                  {/* Cover image */}
                  <div className="w-24 h-24 rounded-xl bg-[#060c1d] border border-[#c9a84c]/10 overflow-hidden shrink-0">
                    {s.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#4a5a70] text-xs font-[family-name:var(--font-inter)]">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-white text-lg font-[family-name:var(--font-inter)]">{s.name}</h3>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-[family-name:var(--font-inter)]"
                            style={{ background: `${statusColors[s.status]}20`, color: statusColors[s.status] }}>
                            {s.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                          {s.breed} · {s.age ? `${s.age}y` : "?"} · {s.gender} · {s.discipline}
                        </p>
                        <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                          {s.country_origin} · {s.category?.replace("_", " ")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {s.asking_price && (
                          <p className="text-lg font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)]">
                            {formatCurrency(s.asking_price)}
                          </p>
                        )}
                        {s.reserve_price && (
                          <p className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                            Reserve: {formatCurrency(s.reserve_price)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
                      <span>By: <span className="text-[#7a8fa8]">{seller?.full_name ?? seller?.email ?? "Unknown"}</span></span>
                      <span>Submitted: <span className="text-[#7a8fa8]">{new Date(s.created_at).toLocaleDateString()}</span></span>
                      {s.ueln && <span>UELN: <span className="text-[#7a8fa8]">{s.ueln}</span></span>}
                      {s.vaccinations_current && <span className="text-green-400">✓ Vaccinated</span>}
                      {s.xrays_available && <span className="text-green-400">✓ X-rays</span>}
                      {s.images?.length > 0 && <span>{s.images.length} photos</span>}
                      {s.video_url && <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">Video ↗</a>}
                    </div>

                    {s.description && (
                      <p className="mt-3 text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)] line-clamp-2">{s.description}</p>
                    )}

                    {s.admin_notes && (
                      <div className="mt-3 p-3 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg">
                        <p className="text-xs text-[#a8bfd4] font-[family-name:var(--font-inter)]">
                          <span className="font-bold text-[#c9a84c]">Admin notes: </span>{s.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-[#c9a84c]/10 px-5 py-3">
                  <SubmissionActions
                  id={s.id}
                  currentStatus={s.status}
                  currentNotes={s.admin_notes ?? ""}
                  submission={{
                    name: s.name,
                    breed: s.breed,
                    age: s.age,
                    gender: s.gender,
                    color: s.color,
                    height_cm: s.height_cm,
                    category: s.category,
                    discipline: s.discipline,
                    description: s.description,
                    asking_price: s.asking_price,
                    sire: s.sire,
                    dam: s.dam,
                  }}
                />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
