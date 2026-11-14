import 'server-only';
import { unstable_cache } from 'next/cache';
import { publicDb } from '@/lib/supabase/public';
import type { Category, Education, Experience, Profile, Project, ProjectCard, SkillGroup } from '@/lib/types';

/** Every public read is cached under this tag; admin writes call revalidateTag(CONTENT_TAG). */
export const CONTENT_TAG = 'content';

const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, [key], { tags: [CONTENT_TAG], revalidate: 3600 });

function must<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Could not load ${what}: ${result.error.message}`);
  return result.data as T;
}

/** Only what a card needs, with at most three images (the thumbnails). */
const CARD_FIELDS = 'id, slug, category, year, featured, sort, title, client, summary, scope, links, images:v2_project_images(id, bucket, path, width, height, alt, sort), photos:v2_project_images(count)';

const cardQuery = () =>
  publicDb
    .from('v2_projects')
    .select(CARD_FIELDS, { count: 'exact' })
    .eq('status', 'published')
    .order('sort')
    .order('sort', { referencedTable: 'images' })
    .limit(3, { referencedTable: 'images' });

export type Page<T> = { items: T[]; total: number; page: number; per: number; pages: number };

export const PER_PAGE_OPTIONS = [10, 15, 20, 50] as const;

/** Normalise ?page= and ?per= from the URL. */
export function pageParams(page?: string, per?: string) {
  const size = PER_PAGE_OPTIONS.find((n) => String(n) === per) ?? PER_PAGE_OPTIONS[0];
  const index = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
  return { page: index, per: size };
}

export const getProfile = cached('profile', async () =>
  must<Profile>(await publicDb.from('v2_profile').select('*').single(), 'profile'),
);

export const getCategories = cached('categories', async () =>
  must<Category[]>(await publicDb.from('v2_categories').select('slug, name, sort').order('sort'), 'categories'),
);

export const getFeaturedProjects = cached('projects:featured', async () =>
  must<ProjectCard[]>(await cardQuery().eq('featured', true), 'featured projects'),
);

export const getProjectPage = cached('projects:page', async (category: string | null, page: number, per: number) => {
  const from = (page - 1) * per;
  let query = cardQuery().range(from, from + per - 1);
  if (category) query = query.eq('category', category);
  const { data, count, error } = await query;
  if (error) throw new Error(`Could not load projects: ${error.message}`);
  const total = count ?? 0;
  return { items: (data ?? []) as ProjectCard[], total, page, per, pages: Math.max(1, Math.ceil(total / per)) } satisfies Page<ProjectCard>;
});

/** Published project count per category (one tiny query). */
export const getCategoryCounts = cached('projects:counts', async () => {
  const rows = must<{ category: string }[]>(
    await publicDb.from('v2_projects').select('category').eq('status', 'published'),
    'category counts',
  );
  const counts: Record<string, number> = {};
  for (const { category } of rows) counts[category] = (counts[category] ?? 0) + 1;
  return { counts, total: rows.length };
});

export const getProject = cached('project', async (slug: string) =>
  must<Project | null>(
    await publicDb
      .from('v2_projects')
      .select('*, images:v2_project_images(id, bucket, path, width, height, alt, sort)')
      .eq('slug', slug)
      .eq('status', 'published')
      .order('sort', { referencedTable: 'images' })
      .maybeSingle(),
    'project',
  ),
);

/** Previous and next published projects by display order (wrapping around). */
export const getNeighbours = cached('project:neighbours', async (sort: number) => {
  // One image per neighbour is enough for the preview card.
  const base = () =>
    publicDb
      .from('v2_projects')
      .select('id, slug, category, year, featured, sort, title, client, summary, scope, links, images:v2_project_images(id, bucket, path, width, height, alt, sort)')
      .eq('status', 'published')
      .order('sort', { referencedTable: 'images' })
      .limit(1, { referencedTable: 'images' });

  const [before, after, last, first] = await Promise.all([
    base().lt('sort', sort).order('sort', { ascending: false }).limit(1),
    base().gt('sort', sort).order('sort').limit(1),
    base().order('sort', { ascending: false }).limit(1),
    base().order('sort').limit(1),
  ]);
  const pick = (r: { data: unknown[] | null }) => ((r.data ?? [])[0] ?? null) as ProjectCard | null;
  return { prev: pick(before) ?? pick(last), next: pick(after) ?? pick(first) };
});

export const getSkillGroups = cached('skills', async () =>
  must<SkillGroup[]>(
    await publicDb
      .from('v2_skill_groups')
      .select('id, area, title, sort, skills:v2_skills(id, name, sort)')
      .order('sort')
      .order('sort', { referencedTable: 'skills' }),
    'skills',
  ),
);

export const getExperiences = cached('experiences', async (homeOnly: boolean) => {
  let query = publicDb
    .from('v2_experiences')
    .select('id, role, organization, kind, area, started_on, ended_on, summary, highlights, on_home')
    .order('started_on', { ascending: false });
  if (homeOnly) query = query.eq('on_home', true);
  return must<Experience[]>(await query, 'experience');
});

export const getEducation = cached('education', async () =>
  must<Education[]>(await publicDb.from('v2_education').select('*').order('sort'), 'education'),
);
