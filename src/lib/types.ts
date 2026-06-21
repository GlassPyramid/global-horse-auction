// Supabase DB row types (snake_case)
export type DbHorse = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  color: string;
  height_cm: number;
  country: string;
  sire: string | null;
  dam: string | null;
  discipline: string;
  category: string;
  description: string;
  starting_price: number;
  current_price: number;
  currency: string;
  vet_checked: boolean;
  featured: boolean;
  images: string[];
  video_url: string | null;
  lot_number: number | null;
  auction_id: string | null;
  seller_id: string | null;
  created_at: string;
  updated_at: string;
  bids?: { id: string; amount: number; bidder_id: string; created_at: string }[];
};

export type DbAuction = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string;
  featured: boolean;
  cover_image: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  horses?: DbHorse[];
};

// App-level Horse shape (camelCase — matches what all components expect)
export type Horse = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  color: string;
  heightCm: number;
  country: string;
  sire: string | null;
  dam: string | null;
  discipline: string;
  category: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  currency: string;
  vetChecked: boolean;
  featured: boolean;
  images: string; // JSON string for HorseCard compatibility
  videoUrl: string | null;
  auctionId: string | null;
  bids: { id: string; amount: number; userId: string; createdAt: Date }[];
};

export type Auction = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  status: string;
  featured: boolean;
  coverImage: string | null;
  horses: Horse[];
};

// Transforms a Supabase DB row to the app Horse shape
export function toHorse(db: DbHorse): Horse {
  return {
    id: db.id,
    name: db.name,
    breed: db.breed,
    age: db.age,
    gender: db.gender,
    color: db.color,
    heightCm: Number(db.height_cm),
    country: db.country,
    sire: db.sire,
    dam: db.dam,
    discipline: db.discipline,
    category: db.category,
    description: db.description,
    startingPrice: Number(db.starting_price),
    currentPrice: Number(db.current_price),
    currency: db.currency,
    vetChecked: db.vet_checked,
    featured: db.featured,
    images: JSON.stringify(db.images.length ? db.images : [
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=90",
    ]),
    videoUrl: db.video_url,
    auctionId: db.auction_id,
    bids: (db.bids ?? []).map((b) => ({
      id: b.id,
      amount: Number(b.amount),
      userId: b.bidder_id,
      createdAt: new Date(b.created_at),
    })),
  };
}

export function toAuction(db: DbAuction): Auction {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    startDate: new Date(db.start_date),
    endDate: new Date(db.end_date),
    status: db.status,
    featured: db.featured,
    coverImage: db.cover_image,
    horses: (db.horses ?? []).map(toHorse),
  };
}
