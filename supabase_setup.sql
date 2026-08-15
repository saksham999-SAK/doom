-- ==============================================================================
-- AVENGERS: DOOMSDAY VOTING POLL — SUPABASE DATABASE SETUP
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create the vote counters table
CREATE TABLE IF NOT EXISTS public.vote_counters (
  option text PRIMARY KEY,
  count bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Seed initial counters for 'doom' and 'avengers'
INSERT INTO public.vote_counters (option, count)
VALUES 
  ('doom', 4820),
  ('avengers', 6150)
ON CONFLICT (option) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.vote_counters ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow anyone (anon + authenticated) to READ vote counts
CREATE POLICY "Allow public read access to vote_counters"
ON public.vote_counters
FOR SELECT
TO anon, authenticated
USING (true);

-- Note: We intentionally do NOT create INSERT, UPDATE, or DELETE policies for anon users.
-- All vote updates MUST go through the security definer RPC function below to prevent vote manipulation.

-- 5. Create atomic vote increment Postgres function (RPC)
CREATE OR REPLACE FUNCTION public.increment_vote(option_name text)
RETURNS TABLE (
  doom_count bigint,
  avengers_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate option name
  IF option_name NOT IN ('doom', 'avengers') THEN
    RAISE EXCEPTION 'Invalid vote option: %', option_name;
  END IF;

  -- Increment the target counter atomically
  UPDATE public.vote_counters
  SET count = count + 1
  WHERE option = option_name;

  -- Return updated counts for both options
  RETURN QUERY
  SELECT
    COALESCE(MAX(CASE WHEN option = 'doom' THEN count END), 0)::bigint AS doom_count,
    COALESCE(MAX(CASE WHEN option = 'avengers' THEN count END), 0)::bigint AS avengers_count
  FROM public.vote_counters;
END;
$$;

-- 6. Grant execute permissions on the RPC function to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_vote(text) TO anon, authenticated;

-- ==============================================================================
-- SETUP COMPLETE
-- ==============================================================================
