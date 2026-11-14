'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { compressImage, formatBytes, MAX_IMAGE_BYTES } from '@/lib/compress';
import { MEDIA_BUCKET, MEDIA_ROOT } from '@/lib/format';
import { createBrowserDb } from '@/lib/supabase/browser';
import { toast } from '@/lib/toast';

const MAX_PDF_BYTES = 2 * 1024 * 1024;

type Uploaded = { path: string; width: number; height: number };
type Item = { name: string; state: 'wait' | 'work' | 'done' | 'fail'; note: string };

/**
 * Uploads straight from the browser to Storage (RLS: admins only), then lets a
 * server action record the file. Images are compressed to ≤100 KB WebP first.
 */
export function Uploader({ folder, kind, label, hint, multiple = false, maxSize = 1600, onUploaded }: {
  folder: string;
  kind: 'image' | 'pdf';
  label: string;
  hint: string;
  multiple?: boolean;
  maxSize?: number;
  onUploaded: (file: Uploaded) => Promise<void>;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [, start] = useTransition();

  const update = (i: number, patch: Partial<Item>) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  const upload = async (files: FileList | null) => {
    if (!files?.length || busy) return;
    const list = [...files].slice(0, multiple ? 12 : 1);
    setItems(list.map((f) => ({ name: f.name, state: 'wait', note: formatBytes(f.size) })));
    setBusy(true);
    const db = createBrowserDb();
    let ok = 0;

    for (const [i, file] of list.entries()) {
      try {
        let body: Blob = file;
        let width = 0;
        let height = 0;
        let ext = 'pdf';
        if (kind === 'image') {
          if (!file.type.startsWith('image/')) throw new Error('bukan gambar');
          update(i, { state: 'work', note: 'Mengompres…' });
          ({ blob: body, width, height } = await compressImage(file, maxSize, MAX_IMAGE_BYTES));
          ext = 'webp';
        } else {
          if (file.type !== 'application/pdf') throw new Error('bukan PDF');
          if (file.size > MAX_PDF_BYTES) throw new Error('PDF maksimal 2 MB');
        }
        update(i, { state: 'work', note: `${formatBytes(file.size)} → ${formatBytes(body.size)}, mengunggah…` });
        const path = `${MEDIA_ROOT}/${folder}/${crypto.randomUUID()}.${ext}`;
        const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, body, {
          contentType: kind === 'image' ? 'image/webp' : 'application/pdf',
          cacheControl: '31536000',
        });
        if (error) throw new Error(error.message);
        await onUploaded({ path, width, height });
        update(i, { state: 'done', note: `${formatBytes(file.size)} → ${formatBytes(body.size)}` });
        ok++;
      } catch (err) {
        update(i, { state: 'fail', note: err instanceof Error ? err.message : 'gagal' });
      }
    }

    setBusy(false);
    if (ok) toast(ok === list.length ? `${ok} berkas terunggah.` : `${ok} dari ${list.length} berkas terunggah.`, ok === list.length ? 'ok' : 'info');
    else toast('Unggahan gagal.', 'err');
    start(() => router.refresh());
  };

  return (
    <div className="uploader">
      <label
        className={`drop${over ? ' over' : ''}${busy ? ' busy' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files); }}
      >
        <input type="file" disabled={busy} accept={kind === 'image' ? 'image/*' : 'application/pdf'} multiple={multiple} onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
        {busy ? <span className="spin" aria-hidden="true" /> : <UploadIcon />}
        <strong>{busy ? 'Memproses…' : label}</strong>
        <small>{hint}</small>
      </label>
      {items.length > 0 && (
        <ul className="upload-list" aria-live="polite">
          {items.map((it, i) => (
            <li key={i} className={it.state}>
              {it.state === 'work' ? <span className="spin sm" aria-hidden="true" /> : <i aria-hidden="true" />}
              <span className="name">{it.name}</span>
              <span className="note">{it.note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V4M6 10l6-6 6 6M5 20h14" />
    </svg>
  );
}
