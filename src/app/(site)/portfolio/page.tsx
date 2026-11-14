import type { Metadata } from 'next';
import Link from 'next/link';
import { Pager } from '@/components/Pager';
import { WorkCard } from '@/components/site/WorkCard';
import { copy } from '@/lib/copy';
import { getCategories, getCategoryCounts, getProjectPage, pageParams } from '@/lib/content';
import { translator, tr } from '@/lib/i18n';
import { getLang } from '@/lib/lang';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: tr(copy.work.title, lang), description: tr(copy.work.intro, lang) };
}

type Search = { c?: string; page?: string; per?: string };

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<Search> }) {
  const lang = await getLang();
  const t = translator(lang);
  const query = await searchParams;
  const categories = await getCategories();
  const active = categories.some((cat) => cat.slug === query.c) ? query.c! : null;
  const { page, per } = pageParams(query.page, query.per);

  const [result, { counts, total }] = await Promise.all([
    getProjectPage(active, page, per),
    getCategoryCounts(),
  ]);

  const categoryName = (slug: string) => t(categories.find((cat) => cat.slug === slug)?.name);
  const filters = [
    { slug: null, label: t(copy.work.all), count: total },
    ...categories.map((cat) => ({ slug: cat.slug, label: t(cat.name), count: counts[cat.slug] ?? 0 })),
  ];

  return (
    <div className="wrap">
      <header className="page-head">
        <h1>{t(copy.work.title)}</h1>
        <p className="intro">{t(copy.work.intro)}</p>
      </header>

      <div className="work-layout">
        <div>
          <div className="grid-work">
            {result.items.length === 0 && <p className="empty">{t(copy.work.empty)}</p>}
            {result.items.map((p, i) => (
              <WorkCard key={p.id} project={p} lang={lang} categoryName={categoryName(p.category)} eager={i < 2} />
            ))}
          </div>
          <Pager
            path="/portfolio"
            params={{ c: active ?? undefined }}
            page={result.page}
            per={result.per}
            pages={result.pages}
            total={result.total}
            labels={{ showing: t(copy.pager.showing), of: t(copy.pager.of), perPage: t(copy.pager.perPage), prev: t(copy.pager.prev), next: t(copy.pager.next) }}
          />
        </div>

        <aside className="cat-nav">
          <p className="cat-title">{t(copy.work.categories)}</p>
          <nav className="filters" aria-label={t(copy.work.categories)}>
            {filters.map((f) => (
              <Link
                key={f.slug ?? 'all'}
                href={f.slug ? `/portfolio?c=${f.slug}` : '/portfolio'}
                aria-current={active === f.slug ? 'page' : undefined}
                scroll={false}
              >
                <span>{f.label}</span>
                <span className="count data">{f.count}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
