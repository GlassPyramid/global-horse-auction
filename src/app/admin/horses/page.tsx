import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { mockHorses } from "@/lib/mock-data";
import { formatCurrency, categoryLabel, categoryClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminHorsesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">Horses</h1>
          <p className="text-[#7a8fa8] text-sm mt-1 font-[family-name:var(--font-inter)]">{mockHorses.length} lots in the system</p>
        </div>
        <Link
          href="/admin/horses/new"
          className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-[#060c1d] font-bold text-xs tracking-wider uppercase hover:bg-[#e2c97e] transition-all font-[family-name:var(--font-inter)] rounded-xl"
        >
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
              {mockHorses.map((horse) => {
                const images = JSON.parse(horse.images) as string[];
                return (
                  <tr key={horse.id} className="hover:bg-[#c9a84c]/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-[#c9a84c]/10">
                          <Image src={images[0]} alt={horse.name} fill className="object-cover" sizes="48px" />
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
                      <div className="font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">{formatCurrency(horse.currentPrice)}</div>
                      <div className="text-xs text-[#7a8fa8] font-[family-name:var(--font-inter)]">{horse.bids.length} bids</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {horse.vetChecked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 font-[family-name:var(--font-inter)]">
                            Vet ✓
                          </span>
                        )}
                        {horse.featured && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 font-[family-name:var(--font-inter)]">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/horses/${horse.id}`} className="p-1.5 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors" title="View public page">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/horses/${horse.id}/edit`} className="p-1.5 text-[#7a8fa8] hover:text-[#c9a84c] transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-[#7a8fa8] hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
