import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { AdminInquiryActions } from "./AdminInquiryActions";

const statusConfig = {
  PENDING: { label: "Pending", icon: Clock, class: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  REVIEWING: { label: "Reviewing", icon: Eye, class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, class: "bg-green-400/10 text-green-400 border-green-400/20" },
  REJECTED: { label: "Rejected", icon: XCircle, class: "bg-red-400/10 text-red-400 border-red-400/20" },
};

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin/inquiries");

  const { data: inquiries } = await supabase
    .from("seller_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Seller Inquiries</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{inquiries?.length ?? 0} applications received</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = inquiries?.filter((i) => i.status === key).length ?? 0;
          return (
            <div key={key} className={`rounded-xl border p-4 ${cfg.class}`}>
              <div className="text-xl font-bold font-[family-name:var(--font-playfair)]">{count}</div>
              <div className="text-xs font-[family-name:var(--font-inter)] mt-0.5 opacity-80">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {(!inquiries || inquiries.length === 0) ? (
        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-16 text-center text-[#7a8fa8] font-[family-name:var(--font-inter)] text-sm">
          No seller inquiries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const cfg = statusConfig[inquiry.status as keyof typeof statusConfig] ?? statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <div key={inquiry.id} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 hover:border-[#c9a84c]/25 transition-all">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border font-[family-name:var(--font-inter)] ${cfg.class}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
                        Received {formatDate(new Date(inquiry.created_at))}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-1">{inquiry.horse_name ?? "Unnamed Horse"}</h3>
                    <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                      {[inquiry.breed, inquiry.age ? `${inquiry.age} years` : null, inquiry.discipline, inquiry.country].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm font-[family-name:var(--font-inter)]">
                      {inquiry.asking_price && <span className="text-[#c9a84c] font-bold">€{Number(inquiry.asking_price).toLocaleString()}</span>}
                      <span className="text-[#7a8fa8]">{inquiry.name}</span>
                      <a href={`mailto:${inquiry.email}`} className="text-[#c9a84c] hover:underline text-xs">{inquiry.email}</a>
                    </div>
                  </div>
                  <AdminInquiryActions inquiryId={inquiry.id} status={inquiry.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
