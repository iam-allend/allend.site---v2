import Link from 'next/link';
import { PER_PAGE_OPTIONS } from '@/lib/content';

type Labels = { showing: string; of: string; perPage: string; prev: string; next: string };

/**
 * Pagination with a page-size switch. Pure links (no client JS); keeps the other
 * query params of `path` intact.
 */
export function Pager({ path, params = {}, page, per, pages, total, labels }: {
  path: string;
  params?: Record<string, string | undefined>;
  page: number;
  per: number;
  pages: number;
  total: number;
  labels: Labels;
}) {
  const href = (next: { page?: number; per?: number }) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
    const size = next.per ?? per;
    const index = next.page ?? page;
    if (size !== PER_PAGE_OPTIONS[0]) q.set('per', String(size));
    if (index > 1) q.set('page', String(index));
    const s = q.toString();
    return s ? `${path}?${s}` : path;
  };

  const first = total === 0 ? 0 : (page - 1) * per + 1;
  const last = Math.min(page * per, total);
  const numbers = pageNumbers(page, pages);

  return (
    <nav className="pager" aria-label="Pagination">
      <p className="pager-info">{labels.showing} {first}–{last} {labels.of} {total}</p>

      {pages > 1 && (
        <div className="pager-pages">
          <PageLink href={href({ page: page - 1 })} disabled={page <= 1} label={labels.prev}>←</PageLink>
          {numbers.map((n, i) =>
            n === null
              ? <span key={`gap-${i}`} className="gap">…</span>
              : <Link key={n} href={href({ page: n })} aria-current={n === page ? 'page' : undefined} scroll={false}>{n}</Link>,
          )}
          <PageLink href={href({ page: page + 1 })} disabled={page >= pages} label={labels.next}>→</PageLink>
        </div>
      )}

      <div className="pager-size" role="group" aria-label={labels.perPage}>
        <span>{labels.perPage}</span>
        {PER_PAGE_OPTIONS.map((n) => (
          <Link key={n} href={href({ per: n, page: 1 })} aria-current={n === per ? 'true' : undefined} scroll={false}>{n}</Link>
        ))}
      </div>
    </nav>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  if (disabled) return <span className="off" aria-hidden="true">{children}</span>;
  return <Link href={href} aria-label={label} scroll={false}>{children}</Link>;
}

/** 1 … 4 5 6 … 12 */
function pageNumbers(page: number, pages: number): (number | null)[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < pages);
  const list: (number | null)[] = [1];
  if (around[0] > 2) list.push(null);
  list.push(...around);
  if (around[around.length - 1] < pages - 1) list.push(null);
  list.push(pages);
  return list;
}
