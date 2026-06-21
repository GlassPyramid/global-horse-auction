import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Runs every 5 minutes — auto-updates auction status based on dates
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  // Open auctions that should now be LIVE
  await supabase
    .from("auctions")
    .update({ status: "LIVE" })
    .eq("status", "UPCOMING")
    .lte("start_date", now)
    .gte("end_date", now);

  // Live auctions that should be CLOSED
  await supabase
    .from("auctions")
    .update({ status: "COMPLETED" })
    .eq("status", "LIVE")
    .lt("end_date", now);

  return NextResponse.json({ success: true, timestamp: now });
}
