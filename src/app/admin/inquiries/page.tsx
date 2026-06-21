import { MessageSquare, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

const mockInquiries = [
  { id: "i1", name: "Antoine Moreau", email: "a.moreau@cavalier.fr", horseName: "Diamant Noir", breed: "Selle Français", age: 8, discipline: "Show Jumping", askingPrice: 180000, country: "France", status: "PENDING", createdAt: new Date("2026-06-20") },
  { id: "i2", name: "Katarina Brandt", email: "k.brandt@dresseurbrand.de", horseName: "Weltfürst B", breed: "Hanoverian", age: 6, discipline: "Dressage", askingPrice: 95000, country: "Germany", status: "REVIEWING", createdAt: new Date("2026-06-19") },
  { id: "i3", name: "James Fitzpatrick", email: "j.fitz@irishsport.ie", horseName: "Connemara Warrior", breed: "Irish Sport Horse", age: 9, discipline: "Eventing", askingPrice: 65000, country: "Ireland", status: "ACCEPTED", createdAt: new Date("2026-06-17") },
  { id: "i4", name: "Ana Rodrigues", email: "ana@haras-portugal.pt", horseName: "Lusitana Pura", breed: "Lusitano", age: 11, discipline: "Dressage", askingPrice: 45000, country: "Portugal", status: "REJECTED", createdAt: new Date("2026-06-15") },
];

const statusConfig = {
  PENDING: { label: "Pending", icon: Clock, class: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  REVIEWING: { label: "Reviewing", icon: Eye, class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, class: "bg-green-400/10 text-green-400 border-green-400/20" },
  REJECTED: { label: "Rejected", icon: XCircle, class: "bg-red-400/10 text-red-400 border-red-400/20" },
};

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Seller Inquiries</h1>
        <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{mockInquiries.length} applications received</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = mockInquiries.filter((i) => i.status === key).length;
          return (
            <div key={key} className={`rounded-xl border p-4 ${cfg.class}`}>
              <div className="text-xl font-bold font-[family-name:var(--font-playfair)]">{count}</div>
              <div className="text-xs font-[family-name:var(--font-inter)] mt-0.5 opacity-80">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {mockInquiries.map((inquiry) => {
          const cfg = statusConfig[inquiry.status as keyof typeof statusConfig];
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
                      Received {formatDate(inquiry.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] mb-1">{inquiry.horseName}</h3>
                  <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                    {inquiry.breed} · {inquiry.age} years · {inquiry.discipline} · {inquiry.country}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm font-[family-name:var(--font-inter)]">
                    <span className="text-[#c9a84c] font-bold">€{inquiry.askingPrice.toLocaleString()}</span>
                    <span className="text-[#7a8fa8]">{inquiry.name}</span>
                    <a href={`mailto:${inquiry.email}`} className="text-[#c9a84c] hover:underline text-xs">{inquiry.email}</a>
                  </div>
                </div>

                {inquiry.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-all font-[family-name:var(--font-inter)]">
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-400/20 transition-all font-[family-name:var(--font-inter)]">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
