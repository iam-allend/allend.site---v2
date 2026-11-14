-- allend.site v2 — schema
--
-- Lives next to the v1 tables in the same project. Every object is prefixed `v2_`
-- so nothing here touches, renames or depends on the old schema.
--
-- Conventions
--   * Bilingual text uses the `v2_i18n` domain: {"id": "...", "en": "..."}.
--   * Public visitors read through the anon key; RLS decides what they see.
--   * Writes require a signed-in user listed in `v2_admins`.
--   * Contact messages are only accepted through v2_submit_message() (rate limited).
--   * Files go to the existing public bucket `uploads` under `v2/`; v2 admins may only
--     write inside that folder. Image rows keep their bucket so v1 images in
--     `project-images` can be referenced during the data migration without copying.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create domain public.v2_i18n as jsonb
  check (
    jsonb_typeof(value) = 'object'
    and value ? 'id'
    and value ? 'en'
    and jsonb_typeof(value -> 'id') = 'string'
    and jsonb_typeof(value -> 'en') = 'string'
  );

create type public.v2_project_status as enum ('draft', 'published');
create type public.v2_skill_area as enum ('web', 'design', 'it', 'soft');
create type public.v2_message_topic as enum ('web', 'job', 'design', 'it', 'other');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create table public.v2_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.v2_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.v2_admins where user_id = auth.uid());
$$;

create function public.v2_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- A JSON array whose items are all i18n objects.
create function public.v2_is_i18n_list(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'array'
    and not exists (
      select 1 from jsonb_array_elements(value) item
      where jsonb_typeof(item -> 'id') is distinct from 'string'
         or jsonb_typeof(item -> 'en') is distinct from 'string'
    );
$$;

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table public.v2_profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null,
  headline public.v2_i18n not null,
  intro public.v2_i18n not null,
  about_title public.v2_i18n not null,
  about public.v2_i18n not null,
  occupation public.v2_i18n not null,
  open_to public.v2_i18n not null,
  location text not null,
  email text not null,
  socials jsonb not null default '{}' check (jsonb_typeof(socials) = 'object'),
  available boolean not null default true,
  avatar_path text,
  cv_path text,
  updated_at timestamptz not null default now()
);

create table public.v2_categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name public.v2_i18n not null,
  sort smallint not null default 0
);

create table public.v2_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null references public.v2_categories (slug) on update cascade,
  status public.v2_project_status not null default 'draft',
  featured boolean not null default false,
  sort integer not null default 0,
  year text check (char_length(year) <= 12),
  link text check (link ~ '^https?://'),
  title public.v2_i18n not null,
  client public.v2_i18n,
  summary public.v2_i18n not null,
  overview public.v2_i18n,
  scope public.v2_i18n,
  role public.v2_i18n,
  period public.v2_i18n,
  team public.v2_i18n,
  highlights jsonb not null default '[]' check (public.v2_is_i18n_list(highlights)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index v2_projects_listing_idx on public.v2_projects (status, sort);

create table public.v2_project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.v2_projects (id) on delete cascade,
  bucket text not null default 'uploads' check (bucket in ('uploads', 'project-images')),
  path text not null,
  alt public.v2_i18n,
  width integer check (width > 0),
  height integer check (height > 0),
  sort smallint not null default 0,
  created_at timestamptz not null default now()
);
create index v2_project_images_project_idx on public.v2_project_images (project_id, sort);

create table public.v2_skill_groups (
  id uuid primary key default gen_random_uuid(),
  area public.v2_skill_area not null,
  title public.v2_i18n not null,
  sort smallint not null default 0
);

create table public.v2_skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.v2_skill_groups (id) on delete cascade,
  name public.v2_i18n not null,
  sort smallint not null default 0
);
create index v2_skills_group_idx on public.v2_skills (group_id, sort);

create table public.v2_experiences (
  id uuid primary key default gen_random_uuid(),
  role public.v2_i18n not null,
  organization text not null,
  kind public.v2_i18n,
  area public.v2_skill_area not null default 'web',
  started_on date not null,
  ended_on date check (ended_on is null or ended_on >= started_on),
  summary public.v2_i18n,
  highlights jsonb not null default '[]' check (public.v2_is_i18n_list(highlights)),
  on_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index v2_experiences_started_idx on public.v2_experiences (started_on desc);

create table public.v2_education (
  id uuid primary key default gen_random_uuid(),
  program public.v2_i18n not null,
  institution text not null,
  started_on date not null,
  ended_on date check (ended_on is null or ended_on >= started_on),
  grade text,
  highlights jsonb not null default '[]' check (public.v2_is_i18n_list(highlights)),
  sort smallint not null default 0
);

create trigger v2_profile_touch before update on public.v2_profile
  for each row execute function public.v2_touch_updated_at();
create trigger v2_projects_touch before update on public.v2_projects
  for each row execute function public.v2_touch_updated_at();
create trigger v2_experiences_touch before update on public.v2_experiences
  for each row execute function public.v2_touch_updated_at();

-- ---------------------------------------------------------------------------
-- Messages (contact form)
-- ---------------------------------------------------------------------------

create table public.v2_messages (
  id uuid primary key default gen_random_uuid(),
  topic public.v2_message_topic not null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  organization text check (char_length(organization) <= 160),
  body text not null check (char_length(body) between 10 and 5000),
  sender_hash text not null,
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);
create index v2_messages_inbox_idx on public.v2_messages (archived_at, created_at desc);
create index v2_messages_sender_idx on public.v2_messages (sender_hash, created_at desc);

-- The only way in for visitors. Limits: 3 per sender per hour, 40 overall per hour.
create function public.v2_submit_message(
  p_topic public.v2_message_topic,
  p_name text,
  p_email text,
  p_organization text,
  p_body text,
  p_sender_hash text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.v2_messages
      where sender_hash = p_sender_hash and created_at > now() - interval '1 hour') >= 3
     or (select count(*) from public.v2_messages
         where created_at > now() - interval '1 hour') >= 40
  then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.v2_messages (topic, name, email, organization, body, sender_hash)
  values (p_topic, trim(p_name), lower(trim(p_email)), nullif(trim(p_organization), ''), trim(p_body), p_sender_hash);
end;
$$;

revoke all on function public.v2_submit_message from public;
grant execute on function public.v2_submit_message to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.v2_admins enable row level security;
alter table public.v2_profile enable row level security;
alter table public.v2_categories enable row level security;
alter table public.v2_projects enable row level security;
alter table public.v2_project_images enable row level security;
alter table public.v2_skill_groups enable row level security;
alter table public.v2_skills enable row level security;
alter table public.v2_experiences enable row level security;
alter table public.v2_education enable row level security;
alter table public.v2_messages enable row level security;

-- Public content: everyone reads, admins write.
create policy "read" on public.v2_profile for select using (true);
create policy "read" on public.v2_categories for select using (true);
create policy "read" on public.v2_skill_groups for select using (true);
create policy "read" on public.v2_skills for select using (true);
create policy "read" on public.v2_experiences for select using (true);
create policy "read" on public.v2_education for select using (true);

create policy "admin write" on public.v2_profile for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());
create policy "admin write" on public.v2_categories for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());
create policy "admin write" on public.v2_skill_groups for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());
create policy "admin write" on public.v2_skills for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());
create policy "admin write" on public.v2_experiences for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());
create policy "admin write" on public.v2_education for all to authenticated using (public.v2_is_admin()) with check (public.v2_is_admin());

-- Projects: drafts are admin-only.
create policy "read published" on public.v2_projects for select
  using (status = 'published' or public.v2_is_admin());
create policy "admin write" on public.v2_projects for all to authenticated
  using (public.v2_is_admin()) with check (public.v2_is_admin());

create policy "read published" on public.v2_project_images for select
  using (exists (
    select 1 from public.v2_projects p
    where p.id = project_id and (p.status = 'published' or public.v2_is_admin())
  ));
create policy "admin write" on public.v2_project_images for all to authenticated
  using (public.v2_is_admin()) with check (public.v2_is_admin());

-- Messages: admins only (visitors go through submit_message).
create policy "admin all" on public.v2_messages for all to authenticated
  using (public.v2_is_admin()) with check (public.v2_is_admin());

-- ---------------------------------------------------------------------------
-- Storage: existing public bucket "uploads", v2 admins write only under v2/
-- ---------------------------------------------------------------------------

create policy "v2 admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'uploads' and name like 'v2/%' and public.v2_is_admin());
create policy "v2 admin update" on storage.objects for update to authenticated
  using (bucket_id = 'uploads' and name like 'v2/%' and public.v2_is_admin());
create policy "v2 admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'uploads' and name like 'v2/%' and public.v2_is_admin());
