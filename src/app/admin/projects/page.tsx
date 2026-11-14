import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionButton } from '@/components/admin/AdminForm';
import { IconEdit, IconExternal, IconImage, IconPlus, IconSearch, IconStar, IconTrash } from '@/components/admin/icons';
import { ADMIN_PAGER_LABELS } from '@/components/admin/labels';
import { Pager } from '@/components/Pager';
import { FrameView, projectFrames } from '@/components/site/ProjectMedia';
import { deleteProject } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import { pageParams } from '@/lib/content';
import type { Category, ProjectCard, ProjectStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'Proyek' };

type Search = { q?: string; status?: string; page?: string; per?: string };
type Row = ProjectCard & { status: ProjectStatus; image_count: { count: number }[] };

const STATUSES = [
  { value: '', label: 'Semua' },
  { value: 'published', label: 'Terbit' },
  { value: 'draft', label: 'Draf' },
];

/** Characters that would break a PostgREST filter expression. */
const clean = (q: string) => q.replace(/[,()%*\\]/g, ' ').trim().slice(0, 60);

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { db } = await requireAdmin();
  const query = await searchParams;
  const { page, per } = pageParams(query.page, query.per);
  const q = clean(query.q ?? '');
  const status = query.status === 'published' || query.status === 'draft' ? query.status : '';

  let list = db
    .from('v2_projects')
    .select(
      'id, slug, category, year, featured, sort, status, title, client, summary, images:v2_project_images(id, bucket, path, width, height, alt, sort), image_count:v2_project_images(count)',
      { count: 'exact' },
    )
    .order('sort')
    .order('sort', { referencedTable: 'images' })
    .limit(1, { referencedTable: 'images' })
    .range((page - 1) * per, page * per - 1);
  if (status) list = list.eq('status', status);
  if (q) list = list.or(`slug.ilike.%${q}%,title->>id.ilike.%${q}%,title->>en.ilike.%${q}%`);

  const [{ data, count, error }, { data: categories }] = await Promise.all([
    list,
    db.from('v2_categories').select('slug, name').order('sort'),
  ]);
  const rows = (data ?? []) as Row[];
  const total = count ?? 0;
  const categoryName = (slug: string) => (categories as Pick<Category, 'slug' | 'name'>[] | null)?.find((c) => c.slug === slug)?.name.id ?? slug;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Proyek</h1>
          <p>Urutan tampil mengikuti angka urutan (kecil di atas). Bintang = tampil di beranda.</p>
        </div>
        <Link className="btn solid" href="/admin/projects/new"><IconPlus /> Proyek baru</Link>
      </div>

      <div className="toolbar">
        <form className="search" role="search">
          <IconSearch />
          <input name="q" defaultValue={q} placeholder="Cari judul atau slug…" aria-label="Cari proyek" />
          {status && <input type="hidden" name="status" value={status} />}
          {per !== 10 && <input type="hidden" name="per" value={per} />}
        </form>
        <nav className="tabs" aria-label="Status">
          {STATUSES.map((s) => {
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (s.value) params.set('status', s.value);
            return (
              <Link key={s.value} href={`/admin/projects${params.size ? `?${params}` : ''}`} aria-current={status === s.value ? 'page' : undefined}>
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {error && <p className="notice err">Gagal memuat proyek: {error.message}</p>}

      {rows.length === 0 ? (
        <p className="empty-state">{q || status ? 'Tidak ada proyek yang cocok.' : 'Belum ada proyek.'}</p>
      ) : (
        <div className="adm-cards">
          {rows.map((p) => {
            const images = p.image_count[0]?.count ?? 0;
            return (
              <article key={p.id} className="pcard" data-row>
                <Link href={`/admin/projects/${p.id}`} className="pcard-media">
                  <FrameView frame={projectFrames(p, 'id', 1)[0]} />
                  <span className={`status${p.status === 'published' ? ' on' : ''}`}>{p.status === 'published' ? 'Terbit' : 'Draf'}</span>
                  {p.featured && <span className="pcard-star" title="Tampil di beranda"><IconStar /></span>}
                </Link>
                <div className="pcard-body">
                  <h3><Link href={`/admin/projects/${p.id}`}>{p.title.id}</Link></h3>
                  <p>{p.summary.id}</p>
                  <ul className="pcard-meta">
                    <li>{categoryName(p.category)}</li>
                    {p.year && <li>{p.year}</li>}
                    <li><IconImage /> {images}</li>
                    <li className="data">#{p.sort}</li>
                  </ul>
                </div>
                <div className="pcard-actions">
                  <Link className="btn sm ghost" href={`/admin/projects/${p.id}`}><IconEdit /> Ubah</Link>
                  {p.status === 'published' && (
                    <Link className="icon-btn" href={`/portfolio/${p.slug}`} target="_blank" aria-label="Lihat di situs" title="Lihat di situs"><IconExternal /></Link>
                  )}
                  <ActionButton
                    action={deleteProject.bind(null, p.id)}
                    label="Hapus"
                    icon={<IconTrash />}
                    className="icon-btn danger"
                    confirm={`Hapus “${p.title.id}” beserta ${images} gambarnya? Tindakan ini tidak bisa dibatalkan.`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Pager
        path="/admin/projects"
        params={{ q: q || undefined, status: status || undefined }}
        page={page}
        per={per}
        pages={Math.max(1, Math.ceil(total / per))}
        total={total}
        labels={ADMIN_PAGER_LABELS}
      />
    </>
  );
}
