import Link from 'next/link';
import { copy } from '@/lib/copy';
import { translator, type Lang } from '@/lib/i18n';
import type { ProjectCard } from '@/lib/types';
import { FrameView, projectFrames } from './ProjectMedia';

/** Work grid card: 16:9 media (second image on hover), category + photo count, and the facts a recruiter scans for. */
export function WorkCard({ project, lang, categoryName, eager = false }: {
  project: ProjectCard;
  lang: Lang;
  categoryName: string;
  eager?: boolean;
}) {
  const t = translator(lang);
  const [cover, hover] = projectFrames(project, lang, 2);
  const photos = project.photos?.[0]?.count ?? project.images.length;
  const scope = t(project.scope).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const hasLive = project.links.some((l) => l.kind === 'live');
  const hasRepo = project.links.some((l) => l.kind === 'repo');
  const meta = [t(project.client), project.year].filter(Boolean).join(' · ');

  return (
    <Link className="wcard rv" href={`/portfolio/${project.slug}`}>
      <div className="wcard-media">
        <FrameView frame={cover} eager={eager} />
        {photos > 1 && <FrameView frame={hover} />}
        <span className="wcard-cat">{categoryName}</span>
        {photos > 0 && <span className="wcard-count data">{photos} {t(copy.work.photos)}</span>}
      </div>
      <div className="wcard-body">
        {meta && <p className="wcard-meta">{meta}</p>}
        <h3>{t(project.title)}</h3>
        <p className="wcard-summary">{t(project.summary)}</p>
        {scope.length > 0 && <ul className="wcard-tags">{scope.map((s) => <li key={s}>{s}</li>)}</ul>}
      </div>
      <div className="wcard-foot">
        <span className="wcard-proof">
          {hasLive && <span>Live</span>}
          {hasRepo && <span>GitHub</span>}
        </span>
        <span className="wcard-go">{t(copy.work.details)} →</span>
      </div>
    </Link>
  );
}
