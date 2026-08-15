import { getSupabaseServerClient } from './supabaseServer.js';

/**
 * Handles GET /api/vote/status request.
 * Unrestricted voting — always returns hasVoted: false so users can vote repeatedly.
 */
export async function handleVoteStatus(req, res) {
  return res.status(200).json({ hasVoted: false, option: null });
}

/**
 * Handles POST /api/vote request.
 * Basic unrestricted vote insertion — inserts name + option into vote_names without deduplication.
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

    const supabaseServer = getSupabaseServerClient();
    if (!supabaseServer) {
      console.error('[API /api/vote] Server error: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL not found in env.');
      return res.status(500).json({
        error: 'server_error',
        message: 'Supabase service role client unavailable. Check Vercel environment variables.',
      });
    }

    // 2. Direct insert into vote_names table (option + name + timestamp)
    const insertResult = await supabaseServer
      .from('vote_names')
      .insert({
        name: trimmedName,
        option,
      });

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

    // 3. Increment aggregate counter in vote_counters table
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
