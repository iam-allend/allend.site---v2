import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Cookie-less anon client for public, cacheable reads.
 * RLS limits it to published content.
 */
export const publicDb = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
