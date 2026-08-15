-- ============================================================
-- SUPABASE SCHEMA SETUP V3: SERVER-ENFORCED DEDUPLICATION & RLS LOCKDOWN
-- Execute this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Add ip_hash column & index to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS ip_hash text;
CREATE INDEX IF NOT EXISTS idx_votes_ip_hash ON votes(ip_hash);

-- 2. Add ip_hash column & index to vote_names table
ALTER TABLE vote_names ADD COLUMN IF NOT EXISTS ip_hash text;
CREATE INDEX IF NOT EXISTS idx_vote_names_ip_hash ON vote_names(ip_hash);

-- 3. LOCK DOWN RLS: Revoke direct anonymous INSERT access
-- The server-side API route (using SUPABASE_SERVICE_ROLE_KEY) is now the ONLY writer.
-- Direct browser inserts into Supabase REST API will now be blocked with RLS violation.
DROP POLICY IF EXISTS "Allow public insert on vote_names" ON vote_names;
DROP POLICY IF EXISTS "Allow public insert on votes" ON votes;

-- 4. Maintain public SELECT read access for live vote counts & voter name stacks
DROP POLICY IF EXISTS "Allow public select on vote_names" ON vote_names;
CREATE POLICY "Allow public select on vote_names" ON vote_names FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on votes" ON votes;
CREATE POLICY "Allow public select on votes" ON votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on vote_counters" ON vote_counters;
CREATE POLICY "Allow public select on vote_counters" ON vote_counters FOR SELECT USING (true);
