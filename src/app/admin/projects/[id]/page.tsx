import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActionButton } from '@/components/admin/AdminForm';
import { IconExternal } from '@/components/admin/icons';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ProjectImages } from '@/components/admin/ProjectImages';
import { deleteProject } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import { mediaUrl } from '@/lib/format';
import type { Category, Project } from '@/lib/types';

export const metadata: Metadata = { title: 'Ubah proyek' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const [{ data: project }, { data: categories }] = await Promise.all([
    db.from('v2_projects').select('*, images:v2_project_images(*)').eq('id', id).order('sort', { referencedTable: 'images' }).maybeSingle(),
    db.from('v2_categories').select('slug, name, sort').order('sort'),
  ]);
  if (!project) notFound();
  const p = project as Project;

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-crumb"><Link href="/admin/projects">Proyek</Link> /</p>
          <h1>{p.title.id}</h1>
          <p>
            <span className={`status${p.status === 'published' ? ' on' : ''}`}>{p.status === 'published' ? 'Terbit' : 'Draf'}</span>
            {' '}/portfolio/{p.slug}
          </p>
        </div>
        <div className="head-actions">
          {p.status === 'published' && <Link className="btn ghost" href={`/portfolio/${p.slug}`} target="_blank"><IconExternal /> Lihat</Link>}
          <ActionButton
            action={deleteProject.bind(null, p.id)}
            label="Hapus proyek"
            className="btn danger"
            confirm={`Hapus “${p.title.id}” beserta semua gambarnya? Tindakan ini tidak bisa dibatalkan.`}
          />
        </div>
      </div>

      <section className="form-section">
        <header>
          <h2>Gambar</h2>
          <p>{p.images.length} gambar. Tiga pertama jadi thumbnail; semuanya tampil di galeri detail.</p>
        </header>
        <div className="form-section-body">
          <ProjectImages projectId={p.id} images={p.images.map((img) => ({ ...img, url: mediaUrl(img.path, img.bucket) }))} />
        </div>
      </section>

      <ProjectForm project={p} categories={(categories ?? []) as Category[]} nextSort={p.sort} />
    </>
  );
}
