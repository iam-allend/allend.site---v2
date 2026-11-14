'use client';

/** Upload budget per image (Supabase free plan friendly). */
export const MAX_IMAGE_BYTES = 100 * 1024;

const QUALITIES = [0.82, 0.74, 0.66, 0.58, 0.5, 0.42];
const MIN_SIDE = 480;

export type Compressed = { blob: Blob; width: number; height: number };

/**
 * Re-encode an image as WebP no larger than `maxBytes`.
 * Lowers quality first, then shrinks the image 15% at a time and tries again.
 */
export async function compressImage(file: File, maxSide: number, maxBytes = MAX_IMAGE_BYTES): Promise<Compressed> {
  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    let best: Compressed | null = null;

    for (;;) {
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, width, height);

      for (const quality of QUALITIES) {
        const blob = await canvas.convertToBlob({ type: 'image/webp', quality });
        if (!best || blob.size < best.blob.size) best = { blob, width, height };
        if (blob.size <= maxBytes) return { blob, width, height };
      }

      if (Math.max(width, height) * 0.85 < MIN_SIDE) break;
      scale *= 0.85;
    }

    if (best && best.blob.size <= maxBytes * 1.5) return best;
    throw new Error(`tidak bisa dikompres di bawah ${Math.round(maxBytes / 1024)} KB`);
  } finally {
    bitmap.close();
  }
}

export const formatBytes = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`);
