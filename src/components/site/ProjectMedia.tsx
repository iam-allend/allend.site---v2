import { mediaUrl } from '@/lib/format';
import { tr, type Lang } from '@/lib/i18n';
import type { ProjectCard } from '@/lib/types';
import { placeholderKinds, Shot, type ShotKind } from './Shot';

export type Frame = { src: string | null; width: number | null; height: number | null; alt: string; kind: ShotKind };

/**
 * Frames for a project: uploaded images first, drawn placeholders fill the rest.
 * `count` = null returns every uploaded image (at least one frame).
 */
export function projectFrames(project: Pick<ProjectCard, 'category' | 'title' | 'images'>, lang: Lang, count: number | null = 3): Frame[] {
  const total = count ?? Math.max(project.images.length, 1);
  const kinds = placeholderKinds(project.category);
  const title = tr(project.title, lang);
  return Array.from({ length: total }, (_, i) => {
    const image = project.images[i];
    return {
      src: image ? mediaUrl(image.path, image.bucket) : null,
      width: image?.width ?? null,
      height: image?.height ?? null,
      alt: image?.alt ? tr(image.alt, lang) : `${title} ${i + 1}`,
      kind: kinds[i % kinds.length],
    };
  });
}

export function FrameView({ frame, eager = false }: { frame: Frame; eager?: boolean }) {
  if (!frame.src) return <Shot kind={frame.kind} />;
  return (
    // Plain <img>: images are already resized to WebP on upload, no optimizer needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="shot shot-img"
      src={frame.src}
      alt={frame.alt}
      width={frame.width ?? 1200}
      height={frame.height ?? 900}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
