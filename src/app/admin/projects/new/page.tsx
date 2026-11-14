import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/auth';
import type { Category } from '@/lib/types';

export const metadata: Metadata = { title: 'Proyek baru' };

export default async function NewProjectPage() {
  const { db } = await requireAdmin();
  const [{ data: categories }, { data: last }] = await Promise.all([
    db.from('v2_categories').select('*').order('sort'),
    db.from('v2_projects').select('sort').order('sort', { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-crumb"><Link href="/admin/projects">Proyek</Link> /</p>
          <h1>Proyek baru</h1>
          <p>Gambar bisa ditambahkan setelah proyek dibuat.</p>
        </div>
      </div>
      <ProjectForm categories={(categories ?? []) as Category[]} nextSort={(last?.sort ?? 0) + 10} />
    </>
  );
}
