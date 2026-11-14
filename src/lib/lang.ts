import 'server-only';
import { cookies } from 'next/headers';
import { LANG_COOKIE, type Lang } from '@/lib/i18n';

/** Visitor language from the cookie set by the ID/EN switch. Defaults to Indonesian. */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return value === 'en' ? 'en' : 'id';
}
