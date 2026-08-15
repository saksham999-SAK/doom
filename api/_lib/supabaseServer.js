import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to auto-load .env / .env.local file in Node environment if process.env values are missing
function loadEnvFromFile() {
  const envPaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
              const key = trimmed.substring(0, eqIdx).trim();
              const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
              if (key && !process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        });
      } catch (e) {
        console.warn('Could not read env file:', e.message);
      }
    }
  }
}

/**
 * Server-only Supabase Client initialized with SUPABASE_SERVICE_ROLE_KEY.
 * This client bypasses RLS and must NEVER be imported in client components!
 */
export function getSupabaseServerClient() {
  loadEnvFromFile();

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
