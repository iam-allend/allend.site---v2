'use client';

import { useState, useTransition } from 'react';
import { addProjectImage, deleteProjectImage, moveProjectImage } from '@/app/admin/actions';
import type { ProjectImage } from '@/lib/types';
import { toast } from '@/lib/toast';
import { IconTrash } from './icons';
import { Uploader } from './Uploader';

type Image = ProjectImage & { url: string };

export function ProjectImages({ projectId, images }: { projectId: string; images: Image[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, start] = useTransition();

  const run = (id: string, task: () => Promise<void>, done: string) => {
    setBusyId(id);
    start(async () => {
      try {
        await task();
        toast(done);
      } catch {
        toast('Gagal memproses gambar.', 'err');
      } finally {
        setBusyId(null);
      }
    });
  };

  return (
    <div className="images-manager">
      {images.length > 0 && (
        <div className="media-grid">
          {images.map((img, i) => (
            <figure key={img.id} className={`media-item${busyId === img.id ? ' is-busy' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" loading="lazy" />
              {i === 0 && <span className="media-tag">Sampul</span>}
              {busyId === img.id && <span className="media-wait"><span className="spin" /></span>}
              <div className="bar">
                <span className="data">#{i + 1}</span>
                <span className="bar-actions">
                  <button type="button" disabled={i === 0 || !!busyId} onClick={() => run(img.id, () => moveProjectImage(projectId, img.id, -1), 'Urutan diubah.')} aria-label="Geser ke kiri">←</button>
                  <button type="button" disabled={i === images.length - 1 || !!busyId} onClick={() => run(img.id, () => moveProjectImage(projectId, img.id, 1), 'Urutan diubah.')} aria-label="Geser ke kanan">→</button>
                  <button
                    type="button"
                    className="danger"
                    disabled={!!busyId}
                    aria-label="Hapus gambar"
                    onClick={() => confirm('Hapus gambar ini?') && run(img.id, () => deleteProjectImage(img.id), 'Gambar dihapus.')}
                  >
                    <IconTrash />
                  </button>
                </span>
              </div>
            </figure>
          ))}
        </div>
      )}
      <Uploader
        folder={`projects/${projectId}`}
        kind="image"
        multiple
        label="Tambah gambar"
        hint="Seret ke sini atau klik. Otomatis dikompres jadi WebP ≤100 KB. Gambar pertama jadi sampul."
        onUploaded={({ path, width, height }) => addProjectImage(projectId, path, width, height)}
      />
    </div>
  );
}
