'use client';

import { setProfileFile } from '@/app/admin/actions';
import { Uploader } from './Uploader';

export function ProfileFiles({ cvUrl, avatarUrl }: { cvUrl: string | null; avatarUrl: string | null }) {
  return (
    <div className="adm-row">
      <div className="f">
        <span>CV (PDF)</span>
        {cvUrl && (
          <p style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '0 0 6px' }}>
            <a className="link" href={cvUrl} target="_blank" rel="noopener">Lihat CV sekarang</a>
            <button type="button" className="btn sm ghost" onClick={() => confirm('Hapus CV? Tombol unduh akan disembunyikan.') && setProfileFile('cv_path', null)}>Hapus</button>
          </p>
        )}
        <Uploader folder="cv" kind="pdf" label={cvUrl ? 'Ganti CV' : 'Unggah CV'} hint="PDF, maks. 2 MB" onUploaded={({ path }) => setProfileFile('cv_path', path)} />
      </div>
      <div className="f">
        <span>Foto profil</span>
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" width={96} height={120} style={{ objectFit: 'cover', borderRadius: 'var(--r-md)' }} />
        )}
        <Uploader folder="avatar" kind="image" maxSize={900} label={avatarUrl ? 'Ganti foto' : 'Unggah foto'} hint="Otomatis dikompres jadi WebP ≤100 KB" onUploaded={({ path }) => setProfileFile('avatar_path', path)} />
      </div>
    </div>
  );
}
