import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Check if admin action (status change, admin_notes)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "ADMIN";

  if (!isAdmin) {
    // Sellers can only edit pending/rejected submissions, can't change status
    delete body.status;
    delete body.admin_notes;
    delete body.reviewed_at;
    delete body.reviewed_by;
  }

  const client = isAdmin ? createServiceClient() : supabase;
  const update = isAdmin
    ? { ...body, reviewed_at: new Date().toISOString(), reviewed_by: user.id }
    : body;

  const { data, error } = await (await client)
    .from("horse_submissions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("horse_submissions")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
