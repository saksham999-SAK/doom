-- ============================================================
-- SUPABASE SCHEMA SETUP V2: LIVE VOTER NAME STACKS & ATOMIC VOTING
-- Execute this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Create vote_names table to track individual voter names & choices
CREATE TABLE IF NOT EXISTS vote_names (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  option text NOT NULL CHECK (option IN ('doom','avengers')),
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE vote_names ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Allow public read and insert, forbid update/delete
DROP POLICY IF EXISTS "Allow public select on vote_names" ON vote_names;
CREATE POLICY "Allow public select on vote_names" ON vote_names FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on vote_names" ON vote_names;
CREATE POLICY "Allow public insert on vote_names" ON vote_names FOR INSERT WITH CHECK (true);

-- 4. Enable Realtime on vote_names table (Make sure Realtime is enabled in Supabase replication settings)
ALTER PUBLICATION supabase_realtime ADD TABLE vote_names;

-- 5. RPC Function: Record vote with name and update aggregate counts atomically
CREATE OR REPLACE FUNCTION record_vote_with_name(option_name text, voter_name text)
RETURNS TABLE (doom_count bigint, avengers_count bigint) AS $$
BEGIN
  -- Insert individual vote with name
  INSERT INTO vote_names (name, option)
  VALUES (TRIM(voter_name), option_name);

  -- Increment aggregate vote counter in vote_counters table
  UPDATE vote_counters
  SET count = count + 1
  WHERE option = option_name;

  -- Return updated aggregate counts
  RETURN QUERY
  SELECT
    COALESCE(MAX(CASE WHEN option = 'doom' THEN count END), 0) AS doom_count,
    COALESCE(MAX(CASE WHEN option = 'avengers' THEN count END), 0) AS avengers_count
  FROM vote_counters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
