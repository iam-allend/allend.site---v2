import { NextResponse, type NextRequest } from 'next/server';
import { createSessionClient } from '@/lib/supabase/server';

// Signs out and returns to the login page. GET is used by requireAdmin() for non-admin sessions.
async function signOut(request: NextRequest) {
  const db = await createSessionClient();
  await db.auth.signOut();
  const url = new URL('/login', request.url);
  const reason = request.nextUrl.searchParams.get('reason');
  if (reason) url.searchParams.set('reason', reason);
  return NextResponse.redirect(url, { status: 303 });
}

export const GET = signOut;
export const POST = signOut;
