import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, country, horse_name, breed, age, discipline, asking_price, description } = body;

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Name, email and description are required" }, { status: 400 });
  }

  const { error } = await createServiceClient()
    .from("seller_inquiries")
    .insert({ name, email, phone, country, horse_name, breed, age: age ? Number(age) : null, discipline, asking_price: asking_price ? Number(asking_price) : null, description });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
