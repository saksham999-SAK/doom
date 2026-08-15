import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase Client initialized with SUPABASE_SERVICE_ROLE_KEY.
 * This client bypasses RLS and must NEVER be imported in client components!
 */
export function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      'Supabase server client missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL.'
    );
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
