import type { Metadata } from 'next';
import { ActionButton, AdminForm } from '@/components/admin/AdminForm';
import { Area, Bilingual, Select, Text } from '@/components/admin/fields';
import { IconTrash } from '@/components/admin/icons';
import { deleteSkillGroup, saveSkillGroup } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import type { SkillGroup } from '@/lib/types';

export const metadata: Metadata = { title: 'Keahlian' };

const AREAS = [
  { value: 'web', label: 'Web (kartu utama)' },
  { value: 'design', label: 'Desain' },
  { value: 'it', label: 'IT support' },
  { value: 'soft', label: 'Soft skills' },
];

const SKILLS_HINT = 'satu per baris; tulis “Indonesia | English” bila namanya berbeda';

const skillLines = (g?: SkillGroup) =>
  (g?.skills ?? []).map((s) => (s.name.id === s.name.en ? s.name.id : `${s.name.id} | ${s.name.en}`)).join('\n');

function GroupFields({ group, sort }: { group?: SkillGroup; sort: number }) {
  return (
    <>
      <div className="adm-row">
        <Select name="area" label="Bidang" value={group?.area ?? 'web'} options={AREAS} />
        <Text name="sort" label="Urutan" type="number" value={group?.sort ?? sort} />
      </div>
      <Bilingual name="title" label="Judul grup" value={group?.title} required />
      <Area name="skills" label="Keahlian" hint={SKILLS_HINT} value={skillLines(group)} rows={5} />
    </>
  );
}

export default async function SkillsPage() {
  const { db } = await requireAdmin();
  const { data } = await db.from('v2_skill_groups').select('id, area, title, sort, skills:v2_skills(id, name, sort)').order('sort').order('sort', { referencedTable: 'skills' });
  const groups = (data ?? []) as SkillGroup[];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Keahlian</h1>
          <p>Grup bidang “Web” tampil di kartu utama halaman Tentang dan beranda.</p>
        </div>
      </div>

      <div className="skill-admin">
        {groups.map((g) => (
          <section key={g.id} className="adm-card" data-row>
            <div className="card-head">
              <h2>{g.title.id} <span className="status">{AREAS.find((a) => a.value === g.area)?.label}</span> <span className="muted">{g.skills.length} item</span></h2>
              <ActionButton action={deleteSkillGroup.bind(null, g.id)} label="Hapus grup" done="Grup dihapus." icon={<IconTrash />} className="icon-btn danger" confirm={`Hapus grup “${g.title.id}” dan semua isinya?`} />
            </div>
            <AdminForm action={saveSkillGroup.bind(null, g.id)} submit="Simpan grup" compact>
              <GroupFields group={g} sort={g.sort} />
            </AdminForm>
          </section>
        ))}

        <section className="adm-card dashed">
          <div className="card-head"><h2>Grup baru</h2></div>
          <AdminForm action={saveSkillGroup.bind(null, null)} submit="Tambah grup" compact>
            <GroupFields sort={groups.length} />
          </AdminForm>
        </section>
      </div>
    </>
  );
}
