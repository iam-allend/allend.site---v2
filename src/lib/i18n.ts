export const LANGS = ['id', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Bilingual text. Same shape as the `i18n` domain in the database. */
export type I18n = { id: string; en: string };
export type Text = I18n | string | null | undefined;

export const LANG_COOKIE = 'lang';

/** Resolve a bilingual (or plain) value for a language. */
export function tr(value: Text, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.id;
}

/** Bind `tr` to one language: `const t = translator(lang); t(copy.nav.home)`. */
export const translator = (lang: Lang) => (value: Text) => tr(value, lang);

export const l = (id: string, en: string = id): I18n => ({ id, en });
