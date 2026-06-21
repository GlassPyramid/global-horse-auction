import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (caller?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const {
    name, breed, age, gender, color, height_cm, country,
    sire, dam, discipline, category, description,
    starting_price, currency, vet_checked, featured,
    images, video_url, auction_id, lot_number,
  } = body;

  if (!name || !breed || !age || !gender || !color || !height_cm || !country || !discipline || !category || !description || !starting_price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("horses")
    .insert({
      name, breed,
      age: Number(age),
      gender, color,
      height_cm: Number(height_cm),
      country,
      sire: sire || null,
      dam: dam || null,
      discipline, category, description,
      starting_price: Number(starting_price),
      current_price: Number(starting_price),
      currency: currency ?? "EUR",
      vet_checked: vet_checked ?? false,
      featured: featured ?? false,
      images: images ?? [],
      video_url: video_url || null,
      auction_id: auction_id || null,
      lot_number: lot_number ? Number(lot_number) : null,
      seller_id: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, horse: data }, { status: 201 });
}
