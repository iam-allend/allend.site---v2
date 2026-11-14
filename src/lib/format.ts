import type { Lang } from '@/lib/i18n';
import { env } from '@/lib/env';

const LOCALE: Record<Lang, string> = { id: 'id-ID', en: 'en-GB' };

const monthYear = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

/** "Sep 2026 – Des 2026", "Jul 2023 – sekarang". */
export function period(start: string, end: string | null, lang: Lang): { from: string; to: string; current: boolean } {
  const current = end == null;
  return {
    from: monthYear(start, lang),
    to: current ? (lang === 'en' ? 'present' : 'sekarang') : monthYear(end, lang),
    current,
  };
}

export const dateTime = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(iso));

/** v2 files live in the existing public `uploads` bucket, under `v2/`. */
export const MEDIA_BUCKET = 'uploads';
export const MEDIA_ROOT = 'v2';

/** Public URL of a stored file. Migrated v1 images may still point at `project-images`. */
export const mediaUrl = (path: string, bucket: string = MEDIA_BUCKET) =>
  `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
