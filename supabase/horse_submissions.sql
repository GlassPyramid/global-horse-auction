-- Run this after unpausing the project

CREATE TABLE IF NOT EXISTS horse_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  color TEXT,
  height_cm DECIMAL(5,1),
  country_origin TEXT,
  discipline TEXT,
  category TEXT,
  sire TEXT,
  dam TEXT,
  studbook_number TEXT,
  ueln TEXT,
  passport_type TEXT,
  vet_check_date DATE,
  vaccinations_current BOOLEAN DEFAULT FALSE,
  xrays_available BOOLEAN DEFAULT FALSE,
  health_notes TEXT,
  competition_level TEXT,
  competition_results TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  asking_price DECIMAL(12,2),
  reserve_price DECIMAL(12,2),
  accept_offers BOOLEAN DEFAULT TRUE,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','published')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS horse_submissions_seller_id_idx ON horse_submissions(seller_id);
CREATE INDEX IF NOT EXISTS horse_submissions_status_idx ON horse_submissions(status);

CREATE OR REPLACE FUNCTION update_horse_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER horse_submissions_updated_at
  BEFORE UPDATE ON horse_submissions
  FOR EACH ROW EXECUTE FUNCTION update_horse_submissions_updated_at();

ALTER TABLE horse_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY seller_select ON horse_submissions FOR SELECT TO authenticated USING (seller_id = auth.uid());
CREATE POLICY seller_insert ON horse_submissions FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid());
CREATE POLICY seller_update ON horse_submissions FOR UPDATE TO authenticated USING (seller_id = auth.uid() AND status IN ('pending','rejected'));
CREATE POLICY seller_delete ON horse_submissions FOR DELETE TO authenticated USING (seller_id = auth.uid() AND status = 'pending');
CREATE POLICY admin_all ON horse_submissions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));
