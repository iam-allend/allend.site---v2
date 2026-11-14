import type { Metadata } from 'next';
import { AdminForm, FormSection } from '@/components/admin/AdminForm';
import { Bilingual, Check, Text } from '@/components/admin/fields';
import { ProfileFiles } from '@/components/admin/ProfileFiles';
import { saveProfile } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import { mediaUrl } from '@/lib/format';
import type { Profile } from '@/lib/types';

export const metadata: Metadata = { title: 'Profil & CV' };

export default async function ProfilePage() {
  const { db } = await requireAdmin();
  const { data } = await db.from('v2_profile').select('*').eq('id', 1).single();
  const p = data as Profile;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Profil & CV</h1>
          <p>Teks hero, halaman Tentang, kontak, dan berkas yang bisa diunduh pengunjung.</p>
        </div>
      </div>

      <section className="form-section">
        <header>
          <h2>Berkas</h2>
          <p>CV muncul sebagai tombol unduh; foto dipakai di halaman Tentang.</p>
        </header>
        <div className="form-section-body">
          <ProfileFiles
            cvUrl={p.cv_path ? mediaUrl(p.cv_path) : null}
            avatarUrl={p.avatar_path ? mediaUrl(p.avatar_path) : null}
          />
        </div>
      </section>

      <AdminForm action={saveProfile} submit="Simpan profil">
        <FormSection title="Identitas" help="Nama, judul hero, dan status yang dilihat pengunjung pertama kali.">
          <div className="adm-row">
            <Text name="full_name" label="Nama" value={p.full_name} required />
            <Text name="location" label="Lokasi" value={p.location} required />
            <Text name="email" label="Email publik" type="email" value={p.email} required />
          </div>
          <Bilingual name="headline" label="Peran utama (judul hero)" value={p.headline} required />
          <Bilingual name="intro" label="Kalimat hero" value={p.intro} multiline required />
          <Bilingual name="occupation" label="Sekarang" value={p.occupation} required />
          <Bilingual name="open_to" label="Terbuka untuk" value={p.open_to} required />
          <Check name="available" label="Sedang menerima tawaran kerja" checked={p.available} />
        </FormSection>

        <FormSection title="Halaman Tentang" help="Judul dan paragraf pembuka.">
          <Bilingual name="about_title" label="Judul" hint="apit kata dengan *bintang* untuk warna aksen" value={p.about_title} required />
          <Bilingual name="about" label="Paragraf" value={p.about} multiline rows={6} required />
        </FormSection>

        <FormSection title="Tautan" help="Kosongkan yang tidak dipakai.">
          <div className="adm-row">
            <Text name="github" label="GitHub" type="url" value={p.socials.github} />
            <Text name="linkedin" label="LinkedIn" type="url" value={p.socials.linkedin} />
            <Text name="instagram" label="Instagram" type="url" value={p.socials.instagram} />
          </div>
        </FormSection>
      </AdminForm>
    </>
  );
}
