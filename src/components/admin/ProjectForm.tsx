import { saveProject } from '@/app/admin/actions';
import type { Category, LinkKind, Project } from '@/lib/types';
import { AdminForm, FormSection } from './AdminForm';
import { Area, Bilingual, BilingualList, Check, Select, Text } from './fields';

const linkOf = (project: Project | undefined, kind: LinkKind) => project?.links.find((x) => x.kind === kind)?.url;

const otherLinkLines = (project?: Project) =>
  (project?.links ?? [])
    .filter((x) => x.kind === 'other')
    .map((x) => (x.label ? `${x.label} | ${x.url}` : x.url))
    .join('\n');

export function ProjectForm({ project, categories, nextSort }: { project?: Project; categories: Category[]; nextSort: number }) {
  return (
    <AdminForm action={saveProject.bind(null, project?.id ?? null)} submit={project ? 'Simpan perubahan' : 'Buat proyek'}>
      <FormSection title="Dasar" help="Judul, alamat, dan di mana proyek ini tampil.">
        <Bilingual name="title" label="Judul" value={project?.title} required />
        <div className="adm-row">
          <Text name="slug" label="Slug" hint="alamat /portfolio/slug" value={project?.slug} required />
          <Select name="category" label="Kategori" value={project?.category ?? categories[0]?.slug} options={categories.map((c) => ({ value: c.slug, label: c.name.id }))} />
        </div>
        <div className="adm-row">
          <Select name="status" label="Status" value={project?.status ?? 'draft'} options={[{ value: 'draft', label: 'Draf' }, { value: 'published', label: 'Terbit' }]} />
          <Text name="sort" label="Urutan" type="number" value={project?.sort ?? nextSort} />
        </div>
        <Check name="featured" label="Unggulan — tampil di beranda" checked={project?.featured} />
      </FormSection>

      <FormSection title="Cerita" help="Ringkasan singkat muncul di kartu; sisanya di halaman detail.">
        <Bilingual name="summary" label="Ringkasan singkat" value={project?.summary} required />
        <Bilingual name="overview" label="Ringkasan lengkap" value={project?.overview} multiline rows={5} />
        <BilingualList name="highlights" label="Yang saya kerjakan" value={project?.highlights} rows={5} />
      </FormSection>

      <FormSection title="Tautan bukti" help="Bukti proyek untuk pengunjung dan perekrut. Semua opsional; yang kosong tidak ditampilkan.">
        <div className="adm-row">
          <Text name="live" label="Situs / aplikasi live" type="url" placeholder="https://" value={linkOf(project, 'live')} />
          <Text name="repo" label="Repository (GitHub)" type="url" placeholder="https://github.com/…" value={linkOf(project, 'repo')} />
        </div>
        <Area
          name="other_links"
          label="Tautan lain"
          hint="satu per baris, “Label | https://…” — mis. Figma, dokumentasi, video demo"
          rows={3}
          value={otherLinkLines(project)}
        />
      </FormSection>

      <FormSection title="Detail" help="Ditampilkan sebagai fakta di samping judul. Kosongkan yang tidak relevan.">
        <Bilingual name="client" label="Klien" value={project?.client} />
        <Bilingual name="role" label="Peran" value={project?.role} />
        <Text name="year" label="Tahun" hint="mis. 2025 atau 2023–" value={project?.year} />
        <Bilingual name="period" label="Periode" value={project?.period} />
        <Bilingual name="team" label="Tim" value={project?.team} />
        <Bilingual name="scope" label="Lingkup" value={project?.scope} />
      </FormSection>
    </AdminForm>
  );
}
