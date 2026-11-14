'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Browser client for admin uploads straight to Storage (uses the session cookie). */
export const createBrowserDb = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
