-- v2: several proof links per project (live site, repository, anything else)
-- replacing the single `link` column. Run after 20261114000000_v2_init.sql and seed.sql.
--
-- Shape: [{"kind": "live" | "repo" | "other", "label": "..." | null, "url": "https://..."}]

create function public.v2_is_link_list(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'array'
    and jsonb_array_length(value) <= 12
    and not exists (
      select 1 from jsonb_array_elements(value) item
      where jsonb_typeof(item) <> 'object'
         or (item ->> 'kind') is null
         or (item ->> 'kind') not in ('live', 'repo', 'other')
         or (item ->> 'url') is null
         or (item ->> 'url') !~ '^https?://'
         or char_length(item ->> 'url') > 500
         or char_length(coalesce(item ->> 'label', '')) > 60
    );
$$;

alter table public.v2_projects
  add column links jsonb not null default '[]'
  constraint v2_projects_links_check check (public.v2_is_link_list(links));

update public.v2_projects
set links = jsonb_build_array(jsonb_build_object('kind', 'live', 'label', null, 'url', link))
where link is not null;

alter table public.v2_projects drop column link;
