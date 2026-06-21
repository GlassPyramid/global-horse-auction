import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { horse_id, amount, currency = "EUR" } = body;

  if (!horse_id || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
  }

  // Check current price
  const { data: horse } = await supabase
    .from("horses")
    .select("current_price, auction_id, auctions(status)")
    .eq("id", horse_id)
    .single();

  if (!horse) {
    return NextResponse.json({ error: "Horse not found" }, { status: 404 });
  }

  // Type-safe status check
  const auctionData = horse.auctions as unknown as { status: string } | null;
  if (auctionData?.status !== "LIVE") {
    return NextResponse.json({ error: "Auction is not currently live" }, { status: 400 });
  }

  if (amount <= horse.current_price) {
    return NextResponse.json(
      { error: `Bid must exceed current price of €${horse.current_price.toLocaleString()}` },
      { status: 400 }
    );
  }

  // Place bid
  const { data: bid, error } = await supabase
    .from("bids")
    .insert({
      horse_id,
      bidder_id: user.id,
      amount,
      currency,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, bid }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const horseId = searchParams.get("horse_id");

  const query = supabase
    .from("bids")
    .select("id, amount, currency, bidder_id, created_at")
    .order("created_at", { ascending: false });

  if (horseId) {
    query.eq("horse_id", horseId);
  } else {
    query.eq("bidder_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
