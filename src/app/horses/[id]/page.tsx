import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toHorse, toAuction, type DbHorse, type DbAuction } from "@/lib/types";
import { mockHorses, mockAuctions } from "@/lib/mock-data";
import { HorseDetailClient } from "./HorseDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HorsePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: horseRow }, ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("horses")
      .select("*, bids(id, amount, bidder_id, created_at)")
      .eq("id", id)
      .single(),
  ]);

  let horse;
  let auction = null;

  if (horseRow) {
    horse = toHorse(horseRow as unknown as DbHorse);
    if (horse.auctionId) {
      const { data: auctionRow } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", horse.auctionId)
        .single();
      if (auctionRow) auction = toAuction({ ...auctionRow, horses: [] } as unknown as DbAuction);
    }
  } else {
    // Fallback to mock data
    const mockHorse = mockHorses.find((h) => h.id === id);
    if (!mockHorse) notFound();
    horse = {
      ...mockHorse,
      heightCm: mockHorse.heightCm,
      startingPrice: mockHorse.startingPrice,
      currentPrice: mockHorse.currentPrice,
      vetChecked: mockHorse.vetChecked,
      videoUrl: mockHorse.videoUrl,
      auctionId: mockHorse.auctionId,
      bids: mockHorse.bids.map((b) => ({ ...b, userId: b.userId, createdAt: b.createdAt })),
    };
    const mockAuction = mockAuctions.find((a) => a.id === mockHorse.auctionId);
    if (mockAuction) {
      auction = {
        ...mockAuction,
        startDate: mockAuction.startDate,
        endDate: mockAuction.endDate,
        coverImage: mockAuction.coverImage,
        horses: [],
      };
    }
  }

  return (
    <HorseDetailClient
      horse={horse}
      auction={auction}
      isAuthenticated={!!user}
    />
  );
}
