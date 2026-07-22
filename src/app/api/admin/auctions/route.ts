import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data } = await createServiceClient().from("auctions").select("id, title, status, start_date, end_date").order("start_date", { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (caller?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { title, description, start_date, end_date, status, featured, cover_image } = body;

  if (!title || !start_date || !end_date) {
    return NextResponse.json({ error: "Title, start date and end date are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("auctions")
    .insert({ title, description, start_date, end_date, status: status ?? "UPCOMING", featured: featured ?? false, cover_image: cover_image || null, created_by: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, auction: data }, { status: 201 });
}
