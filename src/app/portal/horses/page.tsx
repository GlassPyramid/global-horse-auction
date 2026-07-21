"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, Plus, Clock, CheckCircle, XCircle, Eye, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  breed: string;
  age: number | null;
  gender: string | null;
  discipline: string | null;
  asking_price: number | null;
  status: "pending" | "under_review" | "approved" | "rejected" | "published";
  admin_notes: string | null;
  images: string[];
};

const statusConfig = {
  pending: { icon: Clock, color: "#F59E0B", bg: "#F59E0B15" },
  under_review: { icon: Eye, color: "#3B82F6", bg: "#3B82F615" },
  approved: { icon: CheckCircle, color: "#10B981", bg: "#10B98115" },
  rejected: { icon: XCircle, color: "#EF4444", bg: "#EF444415" },
  published: { icon: CheckCircle, color: "#8B5CF6", bg: "#8B5CF615" },
};

export default function MyPawPrintsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => { setSubmissions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('portal', 'deleteConfirm'))) return;
    setDeleting(id);
    await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    setSubmissions((s) => s.filter((x) => x.id !== id));
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            {t('portal', 'myPawPrints')}
          </h1>
          <p className="text-sm text-[#7a8fa8] mt-1 font-[family-name:var(--font-inter)]">
            {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
          </p>
        </div>
        <Link href="/sell"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
          <Plus className="w-4 h-4" />
          {t('portal', 'submitPawPrint')}
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-16 text-center">
          <PawPrint className="w-12 h-12 text-[#c9a84c]/30 mx-auto mb-4" />
          <p className="text-[#7a8fa8] font-[family-name:var(--font-inter)] mb-6">{t('portal', 'noPawPrints')}</p>
          <Link href="/sell"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-widest uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
            <Plus className="w-4 h-4" /> {t('portal', 'submitPawPrint')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => {
            const cfg = statusConfig[s.status];
            const Icon = cfg.icon;
            return (
              <div key={s.id} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
                <div className="flex items-start gap-5 p-5">
                  {/* Cover image */}
                  <div className="w-20 h-20 rounded-xl bg-[#060c1d] border border-[#c9a84c]/10 overflow-hidden shrink-0">
                    {s.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PawPrint className="w-8 h-8 text-[#c9a84c]/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white font-[family-name:var(--font-inter)]">{s.name}</h3>
                        <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                          {s.breed}{s.age ? ` · ${s.age}y` : ""}{s.gender ? ` · ${s.gender}` : ""}{s.discipline ? ` · ${s.discipline}` : ""}
                        </p>
                        {s.asking_price && (
                          <p className="text-sm font-semibold text-[#c9a84c] font-[family-name:var(--font-inter)] mt-1">
                            €{s.asking_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-[family-name:var(--font-inter)]"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          <Icon className="w-3.5 h-3.5" />
                          {t('portal', s.status)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)]">
                        {t('portal', 'submittedOn')} {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {s.admin_notes && (
                      <div className="mt-3 p-3 rounded-lg flex items-start gap-2"
                        style={{ background: s.status === 'rejected' ? '#EF444410' : '#c9a84c10', border: `1px solid ${s.status === 'rejected' ? '#EF444430' : '#c9a84c30'}` }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: s.status === 'rejected' ? '#EF4444' : '#c9a84c' }} />
                        <p className="text-xs font-[family-name:var(--font-inter)]" style={{ color: s.status === 'rejected' ? '#EF4444' : '#a8bfd4' }}>
                          <span className="font-bold">{t('portal', 'adminNotes')}: </span>{s.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(s.status === 'pending' || s.status === 'rejected') && (
                      <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50">
                        {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
