import { createClient } from "@/lib/supabase/server";
import { toHorse, type DbHorse } from "@/lib/types";
import { mockHorses } from "@/lib/mock-data";
import { HorsesClient } from "./HorsesClient";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HorsesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("horses")
    .select("*, bids(id, amount, bidder_id, created_at)")
    .order("created_at", { ascending: false });

  const horses =
    rows && rows.length > 0
      ? rows.map((h) => toHorse(h as unknown as DbHorse))
      : mockHorses;

  return <HorsesClient horses={horses} initialCategory={category ?? ""} />;
}
