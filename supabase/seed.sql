-- Seed data for Global Horse Auction
-- Run this in Supabase SQL Editor after schema.sql

-- Auctions
insert into auctions (id, title, description, start_date, end_date, status, featured, cover_image) values
(
  'a1111111-0000-0000-0000-000000000001',
  'Summer Elite Collection 2026',
  'Our most prestigious collection to date — 24 hand-selected horses representing the pinnacle of global sport horse breeding. From elite Grand Prix competitors to future stars, this collection defines the global standard.',
  '2026-06-15T10:00:00Z',
  '2026-06-28T20:00:00Z',
  'LIVE',
  true,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600&q=90'
),
(
  'a2222222-0000-0000-0000-000000000002',
  'International Sport Horse Auction — July 2026',
  'A carefully curated selection of international sport horses from Belgium, Spain, Germany, and the Netherlands. Competition-ready horses and future stars for riders of every ambition.',
  '2026-07-05T10:00:00Z',
  '2026-07-15T20:00:00Z',
  'UPCOMING',
  false,
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1600&q=90'
);

-- Horses
insert into horses (name, breed, age, gender, color, height_cm, country, sire, dam, discipline, category, description, starting_price, current_price, currency, vet_checked, featured, images, auction_id) values
(
  'Valeria W', 'KWPN', 7, 'MARE', 'Bay', 168, 'Netherlands', 'Vivaldi', 'Ulrike W', 'Dressage', 'ELITE_SPORT',
  'A breathtaking KWPN mare with exceptional gaits and outstanding rideability. Valeria W has competed successfully at Grand Prix level and is a genuine 10-mover. Her three gaits are of the highest quality, and she has a winning mentality that sets her apart. Already proven at international level with multiple top-3 placings. This mare represents a once-in-a-decade opportunity for the serious Grand Prix rider.',
  280000, 320000, 'EUR', true, true,
  ARRAY['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=90','https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&q=90','https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=90'],
  'a1111111-0000-0000-0000-000000000001'
),
(
  'Don Royale', 'Hanoverian', 5, 'STALLION', 'Dark Bay', 172, 'Germany', 'Desperados FRH', 'Dolce Vita', 'Dressage', 'FUTURE_STARS',
  'An extraordinary young stallion with three world-class gaits and an incredible work ethic. Don Royale is by the legendary Desperados FRH and shows all the hallmarks of a future Grand Prix champion. His walk is a 10, his trot groundcovers the arena with exceptional suspension, and his canter is pure quality. This is a rare investment opportunity in a horse with limitless potential.',
  95000, 145000, 'EUR', true, true,
  ARRAY['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=90','https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=90'],
  'a1111111-0000-0000-0000-000000000001'
),
(
  'Spartacus Z', 'Zangersheide', 9, 'GELDING', 'Grey', 175, 'Belgium', 'Sheraton', 'Una Z', 'Show Jumping', 'ELITE_SPORT',
  'A proven 1.50m+ international show jumper with an exceptional record at Grand Prix level. Spartacus Z has competed at CSIO 5* events across Europe and the Americas with multiple winning rounds. He is careful, brave, and has a natural ability to read distances. An honest competitor that any professional rider would be proud to represent at the highest level.',
  350000, 420000, 'EUR', true, true,
  ARRAY['https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=90','https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1200&q=90'],
  'a1111111-0000-0000-0000-000000000001'
),
(
  'Floriana', 'Oldenburg', 12, 'MARE', 'Chestnut', 165, 'Germany', 'Fürst Romancier', 'Lady Florence', 'Breeding', 'BREEDING_INVESTMENT',
  'A premium Oldenburg broodmare with flawless bloodlines and an impeccable breeding record. Floriana has produced four licensed offspring, two of which have competed at international level. Her pedigree combines the best of modern Oldenburg breeding with proven sport genetics. An exceptional investment for any serious breeding program.',
  45000, 62000, 'EUR', true, false,
  ARRAY['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=90','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=90'],
  'a1111111-0000-0000-0000-000000000001'
),
(
  'Casino Royal V', 'Belgian Warmblood', 6, 'STALLION', 'Bay', 170, 'Belgium', 'Canturo', 'Radina V', 'Show Jumping', 'COMPETITION_READY',
  'A spectacular 6-year-old BWP stallion ready to compete at 1.40–1.45m level. Casino Royal V has exceptional scope, a fantastic mind, and a powerful engine. He has been produced by one of Belgium''s top yards and is ready to step up to the big league immediately. His bascule and technique over fences is exceptional — a horse that can reach the very top.',
  75000, 98000, 'EUR', true, false,
  ARRAY['https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1200&q=90','https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=90'],
  'a2222222-0000-0000-0000-000000000002'
),
(
  'Estrella Negra', 'PRE (Andalusian)', 8, 'MARE', 'Black', 162, 'Spain', 'Emboscado IV', 'Noche Oscura', 'Dressage', 'COMPETITION_READY',
  'A stunning pure PRE mare with exceptional movement and the classic baroque beauty of the Spanish horse. Estrella Negra has competed at Prix St. Georges level and is also schooled in Working Equitation. Her expressive trot and powerful piaffe make her a standout performer. An extraordinary opportunity to acquire one of the finest PRE mares on the market.',
  55000, 78000, 'EUR', true, false,
  ARRAY['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=90','https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=90'],
  'a2222222-0000-0000-0000-000000000002'
);
