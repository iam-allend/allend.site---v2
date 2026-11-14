import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectGallery } from '@/components/site/ProjectGallery';
import { FrameView, projectFrames } from '@/components/site/ProjectMedia';
import { copy } from '@/lib/copy';
import { getCategories, getNeighbours, getProject } from '@/lib/content';
import { translator, tr, type Lang } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import type { ProjectCard, ProjectLink } from '@/lib/types';
import '@/styles/viewer.css';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [lang, project] = await Promise.all([getLang(), getProject((await params).slug)]);
  if (!project) return {};
  return { title: tr(project.title, lang), description: tr(project.summary, lang) };
}

const hostOf = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

export default async function ProjectPage({ params }: Props) {
  const lang = await getLang();
  const t = translator(lang);
  const { slug } = await params;
  const [project, categories] = await Promise.all([getProject(slug), getCategories()]);
  if (!project) notFound();

  const { prev, next } = await getNeighbours(project.sort);
  const category = categories.find((c) => c.slug === project.category);
  const c = copy.project;

  const linkLabel = (link: ProjectLink) => {
    if (link.label) return link.label;
    if (link.kind === 'live') return t(c.visit);
    if (link.kind === 'repo') return /github\.com/.test(link.url) ? 'GitHub' : t(c.repo);
    return hostOf(link.url);
  };

  const facts = [
    { label: c.client, value: t(project.client) },
    { label: c.role, value: t(project.role) },
    { label: c.period, value: t(project.period) || project.year },
    { label: c.team, value: t(project.team) },
    { label: c.scope, value: t(project.scope) },
  ].filter((f) => f.value);

  return (
    <article className="case">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/portfolio">{t(copy.nav.work)}</Link>
          <span>/</span>
          <Link href={`/portfolio?c=${project.category}`}>{t(category?.name)}</Link>
        </nav>

        <header className="case-head">
          <div className="case-title">
            <p className="case-kicker">{t(category?.name)}{project.year && <> · {project.year}</>}</p>
            <h1>{t(project.title)}</h1>
            <p className="intro">{t(project.summary)}</p>
            {project.links.length > 0 && (
              <ul className="case-links" aria-label={t(c.links)}>
                {project.links.map((link, i) => (
                  <li key={`${link.url}-${i}`}>
                    <a className={`proof ${link.kind}`} href={link.url} target="_blank" rel="noopener noreferrer" title={link.url}>
                      <LinkIcon kind={link.kind} url={link.url} />
                      <span className="proof-label">{linkLabel(link)}</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {facts.length > 0 && (
            <dl className="case-facts">
              {facts.map((f) => <div key={f.label.id}><dt>{t(f.label)}</dt><dd>{f.value}</dd></div>)}
            </dl>
          )}
        </header>

        <ProjectGallery
          frames={projectFrames(project, lang, null)}
          title={t(project.title)}
          labels={{ prev: t(c.prevPhoto), next: t(c.nextPhoto), open: t(c.zoom), close: t(c.close), photo: t(c.photo) }}
        />

        <section className="case-body">
          <div className="case-story rv">
            <h2>{t(c.overview)}</h2>
            <p className="lead">{t(project.overview) || t(c.pending)}</p>
          </div>
          {project.highlights.length > 0 && (
            <div className="case-work rv">
              <h2>{t(c.whatIDid)}</h2>
              <ul className="case-points">
                {project.highlights.map((h, i) => <li key={i}>{t(h)}</li>)}
              </ul>
            </div>
          )}
        </section>

        <nav className="case-nav" aria-label={t(c.more)}>
          {prev && prev.slug !== project.slug && <NeighbourCard project={prev} lang={lang} label={t(c.prev)} dir="prev" />}
          {next && next.slug !== project.slug && next.slug !== prev?.slug && <NeighbourCard project={next} lang={lang} label={t(c.next)} dir="next" />}
        </nav>
      </div>
    </article>
  );
}

const svgProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

/** Globe for live sites, the GitHub mark for GitHub repos, a chain link otherwise. */
function LinkIcon({ kind, url }: { kind: ProjectLink['kind']; url: string }) {
  if (/github.com/.test(url)) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    );
  }
  if (kind === 'live') {
    return <svg {...svgProps}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
  }
  return <svg {...svgProps}><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></svg>;
}

function ArrowUpRight() {
  return <svg className="proof-arrow" {...svgProps}><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

function NeighbourCard({ project, lang, label, dir }: { project: ProjectCard; lang: Lang; label: string; dir: 'prev' | 'next' }) {
  return (
    <Link className={`case-neighbour ${dir}`} href={`/portfolio/${project.slug}`}>
      <FrameView frame={projectFrames(project, lang, 1)[0]} />
      <div>
        <span>{dir === 'prev' ? `← ${label}` : `${label} →`}</span>
        <strong>{tr(project.title, lang)}</strong>
        <small>{tr(project.summary, lang)}</small>
      </div>
    </Link>
  );
}
