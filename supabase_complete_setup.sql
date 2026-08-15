-- ============================================================
-- COMPLETE SUPABASE SETUP SCRIPT (Run this in Supabase SQL Editor)
-- Creates all tables, sets up RLS policies, and enables Realtime
-- ============================================================

-- 1. Create vote_counters table for aggregate percentage counts
CREATE TABLE IF NOT EXISTS vote_counters (
  option text PRIMARY KEY CHECK (option IN ('doom', 'avengers')),
  count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Insert initial counter rows if they don't exist
INSERT INTO vote_counters (option, count)
VALUES ('doom', 4820), ('avengers', 6150)
ON CONFLICT (option) DO NOTHING;

-- 2. Create vote_names table for live voter name stacks & IP deduplication
CREATE TABLE IF NOT EXISTS vote_names (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  option text NOT NULL CHECK (option IN ('doom', 'avengers')),
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

-- Index on ip_hash for fast 24-hour deduplication lookups
CREATE INDEX IF NOT EXISTS idx_vote_names_ip_hash ON vote_names(ip_hash);
CREATE INDEX IF NOT EXISTS idx_vote_names_created_at ON vote_names(created_at DESC);

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE vote_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_names ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies: Allow public SELECT (read-only for browser), revoke direct INSERT
DROP POLICY IF EXISTS "Allow public select on vote_counters" ON vote_counters;
CREATE POLICY "Allow public select on vote_counters" ON vote_counters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on vote_names" ON vote_names;
CREATE POLICY "Allow public select on vote_names" ON vote_names FOR SELECT USING (true);

-- Revoke direct anon insert (only the server-side API route using Service Role Key can insert)
DROP POLICY IF EXISTS "Allow public insert on vote_names" ON vote_names;

-- 5. Add tables to Supabase Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'vote_names'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE vote_names;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'vote_counters'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE vote_counters;
  END IF;
END $$;
