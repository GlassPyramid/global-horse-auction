import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = await createServiceClient();

  // Fetch the submission
  const { data: sub, error: fetchErr } = await service
    .from("horse_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  if (sub.status === "published") return NextResponse.json({ error: "Already published" }, { status: 400 });

  const { data: adminNotes } = await req.json().catch(() => ({ data: null }));

  // Map submission → horses table
  const horse = {
    name: sub.name,
    breed: sub.breed,
    age: sub.age ?? 0,
    gender: sub.gender ?? "MARE",
    color: sub.color ?? "Bay",
    height_cm: sub.height_cm ?? 160,
    country: sub.country_origin ?? "Unknown",
    sire: sub.sire ?? null,
    dam: sub.dam ?? null,
    discipline: sub.discipline ?? "Other",
    category: sub.category ?? "COMPETITION_READY",
    description: sub.description ?? sub.competition_results ?? sub.health_notes ?? "",
    starting_price: sub.asking_price ?? 0,
    current_price: sub.asking_price ?? 0,
    currency: "EUR",
    vet_checked: sub.vaccinations_current ?? false,
    featured: false,
    images: sub.images ?? [],
    video_url: sub.video_url ?? null,
    seller_id: sub.seller_id,
  };

  // Create the horse listing
  const { data: newHorse, error: horseErr } = await service
    .from("horses")
    .insert(horse)
    .select("id")
    .single();

  if (horseErr) return NextResponse.json({ error: horseErr.message }, { status: 500 });

  // Mark submission as published
  await service.from("horse_submissions").update({
    status: "published",
    admin_notes: adminNotes ?? sub.admin_notes,
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
  }).eq("id", id);

  // Upgrade seller profile role to SELLER if they're still BIDDER
  await service
    .from("profiles")
    .update({ role: "SELLER" })
    .eq("id", sub.seller_id)
    .eq("role", "BIDDER");

  return NextResponse.json({ horse_id: newHorse.id });
}
