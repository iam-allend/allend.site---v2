import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';

/**
 * Gate for admin pages and actions. Returns a session-bound client whose writes
 * still pass through RLS (v2_is_admin()), so a bypassed check cannot leak data.
 * Memoised per request, so the layout and the page share one auth round-trip.
 */
export const requireAdmin = cache(async () => {
  const db = await createSessionClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect('/login');

  const { data: isAdmin } = await db.rpc('v2_is_admin');
  if (!isAdmin) redirect('/auth/signout?reason=denied');

  return { db, user };
});
