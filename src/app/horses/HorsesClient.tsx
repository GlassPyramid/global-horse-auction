"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { HorseCard } from "@/components/horses/horse-card";
import { cn } from "@/lib/utils";
import type { Horse } from "@/lib/types";

const categories = [
  { key: "", label: "All" },
  { key: "FUTURE_STARS", label: "Future Stars" },
  { key: "COMPETITION_READY", label: "Competition Ready" },
  { key: "ELITE_SPORT", label: "Elite Sport" },
  { key: "BREEDING_INVESTMENT", label: "Breeding & Investment" },
];

const disciplines = ["All", "Dressage", "Show Jumping", "Eventing", "Breeding", "Working Equitation"];
const genders = ["All", "STALLION", "MARE", "GELDING"];

export function HorsesClient({ horses, initialCategory = "" }: { horses: Horse[]; initialCategory?: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [discipline, setDiscipline] = useState("All");
  const [gender, setGender] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "newest" | "name">("newest");

  const filtered = useMemo(() => {
    return horses
      .filter((h) => {
        if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
            !h.breed.toLowerCase().includes(search.toLowerCase())) return false;
        if (category && h.category !== category) return false;
        if (discipline !== "All" && !h.discipline.toLowerCase().includes(discipline.toLowerCase())) return false;
        if (gender !== "All" && h.gender !== gender) return false;
        if (h.currentPrice < minPrice || h.currentPrice > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.currentPrice - b.currentPrice;
        if (sortBy === "price_desc") return b.currentPrice - a.currentPrice;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [horses, search, category, discipline, gender, minPrice, maxPrice, sortBy]);

  const hasFilters = search || category || discipline !== "All" || gender !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDiscipline("All");
    setGender("All");
    setMinPrice(0);
    setMaxPrice(1000000);
  };

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <section className="py-16 bg-[#0a1428] border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            Browse Collection
          </p>
          <h1 className="text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">
            All Horses
          </h1>

          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8fa8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, breed, discipline..."
                className="w-full bg-[#060c1d] border border-[#c9a84c]/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#4a5a70]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all font-[family-name:var(--font-inter)]",
                showFilters ? "bg-[#c9a84c] text-[#060c1d] border-[#c9a84c]" : "border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-400/30 text-red-400 hover:bg-red-400/5 text-sm font-semibold transition-all font-[family-name:var(--font-inter)]"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all font-[family-name:var(--font-inter)]",
                  category === cat.key
                    ? "bg-[#c9a84c] text-[#060c1d]"
                    : "border border-[#c9a84c]/20 text-[#7a8fa8] hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="mt-5 p-5 bg-[#060c1d] rounded-xl border border-[#c9a84c]/10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Discipline</label>
                <select value={discipline} onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-[#0a1428] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c]">
                  {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#0a1428] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c]">
                  {genders.map((g) => <option key={g} value={g}>{g === "All" ? "All" : g.charAt(0) + g.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Min Price (€)</label>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))}
                  min={0} step={5000}
                  className="w-full bg-[#0a1428] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-2 block">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full bg-[#0a1428] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-sm text-white font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#c9a84c]">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            <span className="text-white font-semibold">{filtered.length}</span> horses found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7a8fa8] text-lg font-[family-name:var(--font-inter)]">No horses match your criteria.</p>
            <button onClick={clearFilters} className="mt-4 text-[#c9a84c] hover:underline text-sm font-[family-name:var(--font-inter)]">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((horse) => (
              <HorseCard key={horse.id} horse={horse} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
