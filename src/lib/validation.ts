import { z } from 'zod';

// Schemas shared by server actions. Limits match the database CHECK constraints.

const trimmed = (max: number) => z.string().trim().max(max);
const optional = (max: number) => trimmed(max).transform((v) => v || null);

export const messageSchema = z.object({
  topic: z.enum(['web', 'job', 'design', 'it', 'other']),
  name: trimmed(120).min(1),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  organization: optional(160),
  body: trimmed(5000).min(10),
});

export const slugSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

/** Bilingual field from two inputs; `required` demands the Indonesian text. */
export const i18nField = (required: boolean, max = 4000) =>
  z.object({ id: trimmed(max), en: trimmed(max) })
    .refine((v) => !required || v.id.length > 0, { message: 'required' })
    .transform((v) => (v.id || v.en ? { id: v.id, en: v.en || v.id } : null));

/** One item per line, ID and EN lines paired by position. */
export const i18nList = z.object({ id: z.string(), en: z.string() }).transform(({ id, en }) => {
  const ids = id.split('\n').map((s) => s.trim()).filter(Boolean);
  const ens = en.split('\n').map((s) => s.trim());
  return ids.map((text, i) => ({ id: text, en: ens[i] || text }));
});

const HTTP_URL = /^https?:\/\/\S+$/;
const url = optional(500).refine((v) => v === null || HTTP_URL.test(v), { message: 'url' });

/** "Label | https://…" per line (label optional) → other proof links. */
const otherLinks = z.string().max(4000).transform((text, ctx) =>
  text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [first, second] = line.split('|').map((s) => s.trim());
    const [label, href] = second ? [first, second] : [null, first];
    if (!HTTP_URL.test(href)) ctx.addIssue({ code: 'custom', message: 'url' });
    return { kind: 'other' as const, label: label ? label.slice(0, 60) : null, url: href };
  }),
);

export const projectSchema = z.object({
  slug: slugSchema,
  category: slugSchema,
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
  sort: z.coerce.number().int().min(0).max(100000),
  year: optional(12),
  live: url,
  repo: url,
  other_links: otherLinks,
  title: i18nField(true, 160),
  client: i18nField(false, 160),
  summary: i18nField(true, 300),
  overview: i18nField(false),
  scope: i18nField(false, 300),
  role: i18nField(false, 160),
  period: i18nField(false, 80),
  team: i18nField(false, 80),
  highlights: i18nList,
}).transform(({ live, repo, other_links, ...project }) => ({
  ...project,
  // One entry per URL (the first wins, so live/repo beat a repeated "other" line).
  links: [
    ...(live ? [{ kind: 'live' as const, label: null, url: live }] : []),
    ...(repo ? [{ kind: 'repo' as const, label: null, url: repo }] : []),
    ...other_links,
  ]
    .filter((link, i, all) => all.findIndex((x) => x.url.replace(/\/$/, '') === link.url.replace(/\/$/, '')) === i)
    .slice(0, 12),
}));

export const experienceSchema = z.object({
  role: i18nField(true, 160),
  organization: trimmed(160).min(1),
  kind: i18nField(false, 60),
  area: z.enum(['web', 'design', 'it', 'soft']),
  started_on: z.iso.date(),
  ended_on: z.union([z.iso.date(), z.literal('')]).transform((v) => v || null),
  summary: i18nField(false, 600),
  highlights: i18nList,
  on_home: z.boolean(),
});

export const educationSchema = z.object({
  program: i18nField(true, 160),
  institution: trimmed(160).min(1),
  started_on: z.iso.date(),
  ended_on: z.union([z.iso.date(), z.literal('')]).transform((v) => v || null),
  grade: optional(40),
  highlights: i18nList,
  sort: z.coerce.number().int().min(0).max(1000),
});

export const profileSchema = z.object({
  full_name: trimmed(120).min(1),
  headline: i18nField(true, 80),
  intro: i18nField(true, 400),
  about_title: i18nField(true, 200),
  about: i18nField(true, 2000),
  occupation: i18nField(true, 160),
  open_to: i18nField(true, 160),
  location: trimmed(120).min(1),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  available: z.boolean(),
  github: optional(300),
  linkedin: optional(300),
  instagram: optional(300),
});

export const skillGroupSchema = z.object({
  area: z.enum(['web', 'design', 'it', 'soft']),
  title: i18nField(true, 80),
  sort: z.coerce.number().int().min(0).max(1000),
  /** One skill per line; "Indonesian | English" when the names differ. */
  skills: z.string().transform((text) =>
    text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const [id, en] = line.split('|').map((s) => s.trim());
      return { id, en: en || id };
    }),
  ),
});
