import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'OK' : 'MISSING'}\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'OK' : 'MISSING'}`
  );
}

// Client for browser (public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server (admin operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase; // Fallback to regular client if service key not available