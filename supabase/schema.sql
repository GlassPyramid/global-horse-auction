-- ============================================================
-- Global Horse Auction — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────────
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  phone       text,
  country     text,
  avatar_url  text,
  role        text not null default 'BIDDER', -- BIDDER | SELLER | ADMIN
  verified    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ──────────────────────────────────────────────
-- AUCTIONS
-- ──────────────────────────────────────────────
create table if not exists auctions (
  id           uuid default uuid_generate_v4() primary key,
  title        text not null,
  description  text,
  start_date   timestamptz not null,
  end_date     timestamptz not null,
  status       text not null default 'UPCOMING', -- UPCOMING | LIVE | CLOSED | COMPLETED
  featured     boolean not null default false,
  cover_image  text,
  created_by   uuid references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table auctions enable row level security;

create policy "Auctions are publicly viewable" on auctions
  for select using (true);

create policy "Only admins can insert/update auctions" on auctions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

-- ──────────────────────────────────────────────
-- HORSES
-- ──────────────────────────────────────────────
create table if not exists horses (
  id             uuid default uuid_generate_v4() primary key,
  name           text not null,
  breed          text not null,
  age            int not null,
  gender         text not null, -- STALLION | MARE | GELDING
  color          text not null,
  height_cm      numeric(5,1) not null,
  country        text not null,
  sire           text,
  dam            text,
  discipline     text not null,
  category       text not null, -- FUTURE_STARS | COMPETITION_READY | ELITE_SPORT | BREEDING_INVESTMENT
  description    text not null,
  starting_price numeric(12,2) not null,
  current_price  numeric(12,2) not null,
  currency       text not null default 'EUR',
  vet_checked    boolean not null default false,
  featured       boolean not null default false,
  images         text[] not null default '{}', -- array of storage URLs
  video_url      text,
  lot_number     int,
  auction_id     uuid references auctions(id) on delete set null,
  seller_id      uuid references profiles(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table horses enable row level security;

create policy "Horses are publicly viewable" on horses
  for select using (true);

create policy "Admins and sellers can manage horses" on horses
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('ADMIN', 'SELLER'))
  );

create index horses_auction_id_idx on horses(auction_id);
create index horses_category_idx on horses(category);
create index horses_featured_idx on horses(featured);

-- ──────────────────────────────────────────────
-- BIDS
-- ──────────────────────────────────────────────
create table if not exists bids (
  id         uuid default uuid_generate_v4() primary key,
  amount     numeric(12,2) not null,
  currency   text not null default 'EUR',
  bidder_id  uuid references profiles(id) on delete cascade not null,
  horse_id   uuid references horses(id) on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table bids enable row level security;

create policy "Bidders can view their own bids" on bids
  for select using (auth.uid() = bidder_id);

create policy "Admins can view all bids" on bids
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

create policy "Authenticated users can place bids" on bids
  for insert with check (
    auth.uid() = bidder_id
    and auth.uid() is not null
  );

create index bids_horse_id_idx on bids(horse_id);
create index bids_bidder_id_idx on bids(bidder_id);

-- Function to update horse current_price when a new bid is placed
create or replace function update_horse_price()
returns trigger language plpgsql as $$
begin
  update horses
  set current_price = new.amount,
      updated_at = now()
  where id = new.horse_id
    and new.amount > current_price;
  return new;
end;
$$;

create trigger on_new_bid
  after insert on bids
  for each row execute function update_horse_price();

-- ──────────────────────────────────────────────
-- WATCHLIST
-- ──────────────────────────────────────────────
create table if not exists watchlist (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles(id) on delete cascade not null,
  horse_id   uuid references horses(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, horse_id)
);

alter table watchlist enable row level security;

create policy "Users can manage their own watchlist" on watchlist
  for all using (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- SELLER INQUIRIES
-- ──────────────────────────────────────────────
create table if not exists seller_inquiries (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  email        text not null,
  phone        text,
  country      text,
  horse_name   text,
  breed        text,
  age          int,
  discipline   text,
  asking_price numeric(12,2),
  description  text,
  status       text not null default 'PENDING', -- PENDING | REVIEWING | ACCEPTED | REJECTED
  created_at   timestamptz not null default now()
);

alter table seller_inquiries enable row level security;

create policy "Anyone can submit seller inquiries" on seller_inquiries
  for insert with check (true);

create policy "Admins can view all inquiries" on seller_inquiries
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

-- ──────────────────────────────────────────────
-- CONTACT MESSAGES
-- ──────────────────────────────────────────────
create table if not exists contact_messages (
  id         uuid default uuid_generate_v4() primary key,
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  status     text not null default 'UNREAD',
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "Anyone can send contact messages" on contact_messages
  for insert with check (true);

create policy "Admins can view all messages" on contact_messages
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

-- ──────────────────────────────────────────────
-- ENABLE REALTIME on bids table
-- (so live bidding works without polling)
-- ──────────────────────────────────────────────
alter publication supabase_realtime add table bids;
alter publication supabase_realtime add table horses;
