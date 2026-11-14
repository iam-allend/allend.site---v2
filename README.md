# allend.site

Portfolio Anur Mustakim — Next.js 15 (App Router) + Supabase (Postgres, Auth, Storage).
Bilingual (ID/EN), light/dark theme, admin dashboard at `/admin`.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15, React 19, TypeScript | Server Components + server actions; tiny client JS |
| Data | Supabase Postgres with RLS, tables prefixed `v2_` | Lives beside the v1 tables in the same project; RLS hides drafts and messages |
| Auth | Supabase Auth (`@supabase/ssr`) | Cookie sessions; admins listed in `v2_admins` |
| Files | Existing public bucket `uploads`, folder `v2/` | Images are resized to WebP in the browser before upload |
| Styling | Plain CSS with tokens (`src/styles`) | No CSS framework; one design system for site and admin |
| Validation | zod (`src/lib/validation.ts`) | Same limits as the database CHECK constraints |

Runtime dependencies: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`.

## Setup

1. **Same Supabase project as v1.** Every v2 object is prefixed `v2_`; nothing in v1 is changed or dropped,
   so the current site keeps running while v2 is built.
2. **Run the SQL** in the Supabase SQL editor, in order:
   - `supabase/migrations/20261114000000_v2_init.sql`
   - `supabase/seed.sql` (content from the CV)
   - `supabase/migrations/20261114010000_v2_project_links.sql` (proof links: live, repo, others)
3. **Create the admin user** in Supabase → Authentication → Users → *Add user* (email + password), then run:
   ```sql
   insert into public.v2_admins (user_id)
   select id from auth.users where email = 'your-admin-email@example.com';
   ```
4. **Environment**: the existing `.env.local` already points at the project. v2 only needs
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`); no service-role key.
5. `npm install` then `npm run dev` → http://localhost:3000

## Project layout

```
src/
  app/
    (site)/          public pages: /, /portfolio, /portfolio/[slug], /about, /contact
    admin/           dashboard (projects, history, skills, messages, profile) + actions.ts
    login/           sign-in page and action
    auth/signout/    sign-out route
  components/
    site/ home/      public UI (header, thumbnails + lightbox, timeline, mascot, hero laptop)
    admin/           form fields, AdminForm, uploader
  lib/
    content.ts       cached public queries (tag "content", refreshed by admin writes)
    copy.ts          interface text in ID/EN
    i18n.ts lang.ts  bilingual helpers; language comes from the `lang` cookie
    validation.ts    zod schemas shared by actions
    mascot/ hero-scenes.ts   client-only animations
  styles/            site.css, hero.css, admin.css
supabase/            migration + seed
```

## Conventions

- **Bilingual data** is stored as `{"id": "...", "en": "..."}` (Postgres domain `v2_i18n`). Render with `tr(value, lang)`.
- **Reads** for public pages go through `lib/content.ts` (anon client, cached). **Writes** only happen in
  `app/admin/actions.ts`, each starting with `requireAdmin()` and ending with `revalidateTag('content')`.
- **Contact messages** enter through `v2_submit_message()`, which rate-limits per sender.
- **Files**: v2 uploads go to `uploads/v2/…`. `v2_project_images.bucket` lets migrated v1 images keep
  pointing at `project-images`; the admin never deletes files outside `uploads/v2/`.
- **v1 → v2 data migration** is a separate, later step (v1 tables: projects, project_images, technologies,
  fields, settings, users, contacts).
- Respect `prefers-reduced-motion`: the mascot stands still and the hero shows a static frame.
