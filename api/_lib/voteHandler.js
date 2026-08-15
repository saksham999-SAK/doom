import crypto from 'crypto';
import { getSupabaseServerClient } from './supabaseServer.js';

// Configurable vote deduplication window (in hours). Set to null for permanent 1 vote per IP.
export const VOTE_COOLDOWN_HOURS = 24;

/**
 * Extracts requester IP address from headers or socket.
 */
export function getRequesterIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Computes SHA-256 hash of the requester IP. Never store raw IPs!
 */
export function hashIp(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Parses cookies from HTTP Cookie header string.
 */
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    if (name) cookies[name] = value;
  });
  return cookies;
}

/**
 * Handles GET /api/vote/status request.
 */
export async function handleVoteStatus(req, res) {
  try {
    const cookies = parseCookies(req.headers['cookie']);
    const cookieVote = cookies['has_voted'];

    if (cookieVote && (cookieVote === 'doom' || cookieVote === 'avengers')) {
      return res.status(200).json({ hasVoted: true, option: cookieVote });
    }

    const supabaseServer = getSupabaseServerClient();
    if (!supabaseServer) {
      return res.status(200).json({ hasVoted: false, option: null });
    }

    const ip = getRequesterIp(req);
    const ipHash = hashIp(ip);

    let query = supabaseServer
      .from('vote_names')
      .select('option, created_at')
      .eq('ip_hash', ipHash)
      .order('created_at', { ascending: false })
      .limit(1);

    if (VOTE_COOLDOWN_HOURS !== null && VOTE_COOLDOWN_HOURS > 0) {
      const cooldownDate = new Date(
        Date.now() - VOTE_COOLDOWN_HOURS * 60 * 60 * 1000
      ).toISOString();
      query = query.gte('created_at', cooldownDate);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const userVote = data[0].option;
      return res.status(200).json({ hasVoted: true, option: userVote });
    }

    return res.status(200).json({ hasVoted: false, option: null });
  } catch (err) {
    console.error('Error in vote status check:', err);
    return res.status(200).json({ hasVoted: false, option: null });
  }
}

/**
 * Handles POST /api/vote request.
 */
export async function handleVoteSubmit(req, res, body) {
  try {
    const { option, name } = body || {};

    // 1. Input Validation
    if (option !== 'doom' && option !== 'avengers') {
      return res.status(400).json({
        error: 'invalid_option',
        message: "Option must be 'doom' or 'avengers'.",
      });
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName || trimmedName.length > 20) {
      return res.status(400).json({
        error: 'invalid_name',
        message: 'Name must be non-empty and 20 characters or fewer.',
      });
    }

    // 2. IP Extraction & Hashing
    const ip = getRequesterIp(req);
    const ipHash = hashIp(ip);

    const supabaseServer = getSupabaseServerClient();
    if (!supabaseServer) {
      console.error('[API /api/vote] Server error: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL not found in env.');
      return res.status(500).json({
        error: 'server_error',
        message: 'Supabase service role client unavailable. Check Vercel environment variables.',
      });
    }

    // 3. Deduplication Check by ip_hash within cooldown window
    let dupQuery = supabaseServer
      .from('vote_names')
      .select('id, option, created_at')
      .eq('ip_hash', ipHash)
      .order('created_at', { ascending: false })
      .limit(1);

    if (VOTE_COOLDOWN_HOURS !== null && VOTE_COOLDOWN_HOURS > 0) {
      const cooldownDate = new Date(
        Date.now() - VOTE_COOLDOWN_HOURS * 60 * 60 * 1000
      ).toISOString();
      dupQuery = dupQuery.gte('created_at', cooldownDate);
    }

    const { data: existingVotes, error: dupError } = await dupQuery;

    if (dupError) {
      console.warn('[API /api/vote] Notice: Error checking ip_hash (table/column may need v3 SQL migration):', dupError.message);
    } else if (existingVotes && existingVotes.length > 0) {
      console.log('[API /api/vote] Blocked duplicate vote from ip_hash:', ipHash.substring(0, 8));
      return res.status(409).json({
        error: 'already_voted',
        message: 'You have already voted within the 24-hour window.',
        option: existingVotes[0].option,
      });
    }

    // 4. Insert into vote_names table (Service Role client bypasses RLS)
    let insertResult = await supabaseServer
      .from('vote_names')
      .insert({
        name: trimmedName,
        option,
        ip_hash: ipHash,
      });

    // If insertion failed because ip_hash column doesn't exist yet on production DB, fallback to basic insert
    if (insertResult.error && insertResult.error.code === '42703') {
      console.warn('[API /api/vote] Column ip_hash missing on vote_names, attempting fallback insert without ip_hash...');
      insertResult = await supabaseServer
        .from('vote_names')
        .insert({
          name: trimmedName,
          option,
        });
    }

    if (insertResult.error) {
      console.error('[API /api/vote] FAILED to insert into vote_names table:', {
        code: insertResult.error.code,
        message: insertResult.error.message,
        details: insertResult.error.details,
        hint: insertResult.error.hint,
      });
      return res.status(500).json({
        error: 'db_insert_failed',
        message: `Failed to record vote name: ${insertResult.error.message}`,
      });
    }

    console.log(`[API /api/vote] SUCCESS: Recorded vote "${trimmedName}" for ${option}`);

    // 5. Increment aggregate counter in vote_counters table
    const { data: countData, error: counterSelectError } = await supabaseServer
      .from('vote_counters')
      .select('option, count');

    let currentDoom = 0;
    let currentAvengers = 0;

    if (!counterSelectError && countData) {
      countData.forEach((row) => {
        if (row.option === 'doom') currentDoom = Number(row.count);
        if (row.option === 'avengers') currentAvengers = Number(row.count);
      });
    }

    const newCount = (option === 'doom' ? currentDoom : currentAvengers) + 1;

    await supabaseServer
      .from('vote_counters')
      .update({ count: newCount })
      .eq('option', option);

    if (option === 'doom') currentDoom += 1;
    if (option === 'avengers') currentAvengers += 1;

    const total = currentDoom + currentAvengers;
    const doomPercent = total > 0 ? Math.round((currentDoom / total) * 100) : 50;
    const avengersPercent = total > 0 ? 100 - doomPercent : 50;

    // 6. Set HttpOnly Cookie
    const maxAgeSeconds = VOTE_COOLDOWN_HOURS ? VOTE_COOLDOWN_HOURS * 3600 : 31536000;
    const cookieValue = `has_voted=${option}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax; Secure`;
    res.setHeader('Set-Cookie', cookieValue);

    return res.status(200).json({
      success: true,
      option,
      doomCount: currentDoom,
      avengersCount: currentAvengers,
      totalVotes: total,
      doomPercent,
      avengersPercent,
    });
  } catch (err) {
    console.error('[API /api/vote] Critical error in vote submission:', err);
    return res.status(500).json({
      error: 'internal_error',
      message: err.message,
    });
  }
}
