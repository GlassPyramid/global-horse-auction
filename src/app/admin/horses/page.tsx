import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Plus, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AdminHorseActions } from "./AdminHorseActions";

export default async function AdminHorsesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/admin/horses");

  const { data: horses } = await supabase
    .from("horses")
    .select("id, name, breed, age, gender, country, category, current_price, currency, vet_checked, featured, images, bids(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Horses</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{horses?.length ?? 0} lots in the system</p>
        </div>
        <Link href="/admin/horses/new" className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl">
          <Plus className="w-4 h-4" /> Add Horse
        </Link>
      </div>

      <div className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/10">
                {["Horse", "Details", "Category", "Price / Bids", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {(horses ?? []).map((horse) => {
                const primaryImage = horse.images?.[0] ?? "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&q=80";
                const bidCount = (horse.bids as unknown as { count: number }[])?.[0]?.count ?? 0;
                return (
                  <tr key={horse.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-[#c9a84c]/10">
                          <Image src={primaryImage} alt={horse.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <div className="font-bold text-white font-[family-name:var(--font-inter)]">{horse.name}</div>
                          <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{horse.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#7a8fa8] font-[family-name:var(--font-inter)] text-xs">
                      {horse.breed} · {horse.age}yr · {horse.gender}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border font-[family-name:var(--font-inter)]", categoryClass(horse.category))}>
                        {categoryLabel(horse.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">{formatCurrency(Number(horse.current_price))}</div>
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{bidCount} bids</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {horse.vet_checked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 font-[family-name:var(--font-inter)]">Vet ✓</span>
                        )}
                        {horse.featured && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 font-[family-name:var(--font-inter)]">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/horses/${horse.id}`} className="p-1.5 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors" title="View public page">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <AdminHorseActions horseId={horse.id} horseName={horse.name} />
                      </div>
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
