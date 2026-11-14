import type { I18n } from '@/lib/i18n';

// Row shapes mirror supabase/migrations/*_init.sql.

export type ProjectStatus = 'draft' | 'published';
export type SkillArea = 'web' | 'design' | 'it' | 'soft';
export type MessageTopic = 'web' | 'job' | 'design' | 'it' | 'other';

export type Profile = {
  full_name: string;
  headline: I18n;
  intro: I18n;
  about_title: I18n;
  about: I18n;
  occupation: I18n;
  open_to: I18n;
  location: string;
  email: string;
  socials: { github?: string; linkedin?: string; instagram?: string };
  available: boolean;
  avatar_path: string | null;
  cv_path: string | null;
};

export type LinkKind = 'live' | 'repo' | 'other';
/** Proof of work: live site, repository, or anything else (Figma, docs, video…). */
export type ProjectLink = { kind: LinkKind; label: string | null; url: string };

export type Category = { slug: string; name: I18n; sort: number };

/** Image fields read by the site and admin (project_id is never needed client-side). */
export type ProjectImage = {
  id: string;
  bucket: string;
  path: string;
  alt: I18n | null;
  width: number | null;
  height: number | null;
  sort: number;
};

export type Project = {
  id: string;
  slug: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  sort: number;
  year: string | null;
  links: ProjectLink[];
  title: I18n;
  client: I18n | null;
  summary: I18n;
  overview: I18n | null;
  scope: I18n | null;
  role: I18n | null;
  period: I18n | null;
  team: I18n | null;
  highlights: I18n[];
  images: ProjectImage[];
};

/** Lean project shape used by lists and cards (see CARD_FIELDS in lib/content). */
export type ProjectCard = Pick<Project, 'id' | 'slug' | 'category' | 'year' | 'featured' | 'sort' | 'title' | 'client' | 'summary' | 'scope' | 'links' | 'images'> & {
  /** Total image count (lists only load the first three images). */
  photos?: { count: number }[];
};

/** Minimal project reference (index, neighbours). */
export type ProjectRef = Pick<Project, 'id' | 'slug' | 'sort' | 'category' | 'title' | 'summary' | 'images'>;

export type SkillGroup = { id: string; area: SkillArea; title: I18n; sort: number; skills: Skill[] };
export type Skill = { id: string; name: I18n; sort: number };

export type Experience = {
  id: string;
  role: I18n;
  organization: string;
  kind: I18n | null;
  area: SkillArea;
  started_on: string;
  ended_on: string | null;
  summary: I18n | null;
  highlights: I18n[];
  on_home: boolean;
};

export type Education = {
  id: string;
  program: I18n;
  institution: string;
  started_on: string;
  ended_on: string | null;
  grade: string | null;
  highlights: I18n[];
  sort: number;
};

export type Message = {
  id: string;
  topic: MessageTopic;
  name: string;
  email: string;
  organization: string | null;
  body: string;
  read_at: string | null;
  archived_at: string | null;
  created_at: string;
};
