import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { EditHorseForm } from "./EditHorseForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHorsePage({ params }: Props) {
  const { id } = await params;
  const service = createServiceClient();

  const [{ data: horse }, { data: auctions }] = await Promise.all([
    service.from("horses").select("*").eq("id", id).single(),
    service.from("auctions").select("id, title, status").order("start_date", { ascending: false }),
  ]);

  if (!horse) notFound();

  return <EditHorseForm horse={horse} auctions={auctions ?? []} />;
}
