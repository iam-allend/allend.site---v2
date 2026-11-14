import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionButton, AdminForm, FormSection } from '@/components/admin/AdminForm';
import { Bilingual, BilingualList, Check, Select, Text } from '@/components/admin/fields';
import { IconEdit, IconPlus, IconTrash } from '@/components/admin/icons';
import { ADMIN_PAGER_LABELS } from '@/components/admin/labels';
import { Pager } from '@/components/Pager';
import { deleteEducation, deleteExperience, saveEducation, saveExperience } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import { pageParams } from '@/lib/content';
import { period } from '@/lib/format';
import type { Education, Experience } from '@/lib/types';

export const metadata: Metadata = { title: 'Riwayat' };

const AREAS = [
  { value: 'web', label: 'Web' },
  { value: 'design', label: 'Desain' },
  { value: 'it', label: 'IT support' },
  { value: 'soft', label: 'Lainnya' },
];

const range = (start: string, end: string | null) => {
  const p = period(start, end, 'id');
  return `${p.from} – ${p.to}`;
};

type Search = { exp?: string; edu?: string; page?: string; per?: string };

export default async function HistoryPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { db } = await requireAdmin();
  const query = await searchParams;
  const { page, per } = pageParams(query.page, query.per);

  const [expList, eduList, editingExp, editingEdu] = await Promise.all([
    db.from('v2_experiences')
      .select('id, role, organization, kind, started_on, ended_on, on_home', { count: 'exact' })
      .order('started_on', { ascending: false })
      .range((page - 1) * per, page * per - 1),
    db.from('v2_education').select('id, program, institution, started_on, ended_on, sort').order('sort'),
    query.exp && query.exp !== 'new' ? db.from('v2_experiences').select('*').eq('id', query.exp).maybeSingle() : null,
    query.edu && query.edu !== 'new' ? db.from('v2_education').select('*').eq('id', query.edu).maybeSingle() : null,
  ]);
  const experiences = (expList.data ?? []) as Experience[];
  const education = (eduList.data ?? []) as Education[];
  const exp = editingExp?.data as Experience | null | undefined;
  const edu = editingEdu?.data as Education | null | undefined;
  const total = expList.count ?? 0;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Riwayat</h1>
          <p>Pengalaman kerja dan pendidikan. Tanggal selesai kosong berarti “sekarang”.</p>
        </div>
        <div className="head-actions">
          <Link className="btn ghost" href="/admin/history?edu=new"><IconPlus /> Pendidikan</Link>
          <Link className="btn solid" href="/admin/history?exp=new"><IconPlus /> Pengalaman</Link>
        </div>
      </div>

      {query.exp !== undefined && (
        <AdminForm key={query.exp} action={saveExperience.bind(null, exp?.id ?? null)} submit="Simpan pengalaman">
          <FormSection title={exp ? 'Ubah pengalaman' : 'Pengalaman baru'} help="Ringkasan dipakai di beranda; poin detail di halaman Tentang.">
            <Bilingual name="role" label="Peran" value={exp?.role} required />
            <div className="adm-row">
              <Text name="organization" label="Organisasi" value={exp?.organization} required />
              <Select name="area" label="Bidang" value={exp?.area ?? 'web'} options={AREAS} />
            </div>
            <div className="adm-row">
              <Text name="started_on" label="Mulai" type="date" value={exp?.started_on} required />
              <Text name="ended_on" label="Selesai" type="date" value={exp?.ended_on} />
            </div>
            <Bilingual name="kind" label="Jenis" hint="Kontrak, Magang, Freelance…" value={exp?.kind} />
            <Bilingual name="summary" label="Ringkasan" value={exp?.summary} multiline />
            <BilingualList name="highlights" label="Poin detail" value={exp?.highlights} />
            <Check name="on_home" label="Tampilkan di beranda" checked={exp?.on_home} />
          </FormSection>
        </AdminForm>
      )}

      {query.edu !== undefined && (
        <AdminForm key={query.edu} action={saveEducation.bind(null, edu?.id ?? null)} submit="Simpan pendidikan">
          <FormSection title={edu ? 'Ubah pendidikan' : 'Pendidikan baru'}>
            <Bilingual name="program" label="Program" value={edu?.program} required />
            <div className="adm-row">
              <Text name="institution" label="Institusi" value={edu?.institution} required />
              <Text name="grade" label="Nilai / IPK" value={edu?.grade} />
            </div>
            <div className="adm-row">
              <Text name="started_on" label="Mulai" type="date" value={edu?.started_on} required />
              <Text name="ended_on" label="Selesai" type="date" value={edu?.ended_on} />
              <Text name="sort" label="Urutan" type="number" value={edu?.sort ?? education.length} />
            </div>
            <BilingualList name="highlights" label="Prestasi & catatan" value={edu?.highlights} />
          </FormSection>
        </AdminForm>
      )}

      <section className="adm-card">
        <h2>Pengalaman</h2>
        <ul className="rows">
          {experiences.map((e) => (
            <li key={e.id} data-row className={query.exp === e.id ? 'is-active' : undefined}>
              <span className={`dot${e.ended_on ? '' : ' live'}`} aria-hidden="true" />
              <div className="grow">
                <strong>{e.role.id}</strong>
                <small>{e.organization}{e.kind ? ` · ${e.kind.id}` : ''}</small>
              </div>
              <span className="data muted hide-sm">{range(e.started_on, e.ended_on)}</span>
              {e.on_home && <span className="status on hide-sm">Beranda</span>}
              <Link className="icon-btn" href={`/admin/history?exp=${e.id}`} aria-label="Ubah" title="Ubah"><IconEdit /></Link>
              <ActionButton action={deleteExperience.bind(null, e.id)} label="Hapus" done="Pengalaman dihapus." icon={<IconTrash />} className="icon-btn danger" confirm={`Hapus “${e.role.id} — ${e.organization}”?`} />
            </li>
          ))}
        </ul>
        <Pager path="/admin/history" page={page} per={per} pages={Math.max(1, Math.ceil(total / per))} total={total} labels={ADMIN_PAGER_LABELS} />
      </section>

      <section className="adm-card">
        <h2>Pendidikan</h2>
        <ul className="rows">
          {education.map((e) => (
            <li key={e.id} data-row className={query.edu === e.id ? 'is-active' : undefined}>
              <span className="dot" aria-hidden="true" />
              <div className="grow">
                <strong>{e.program.id}</strong>
                <small>{e.institution}</small>
              </div>
              <span className="data muted hide-sm">{range(e.started_on, e.ended_on)}</span>
              <Link className="icon-btn" href={`/admin/history?edu=${e.id}`} aria-label="Ubah" title="Ubah"><IconEdit /></Link>
              <ActionButton action={deleteEducation.bind(null, e.id)} label="Hapus" done="Pendidikan dihapus." icon={<IconTrash />} className="icon-btn danger" confirm={`Hapus “${e.program.id}”?`} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
