import { period } from '@/lib/format';
import { translator, type Lang } from '@/lib/i18n';
import type { Experience } from '@/lib/types';

/** Vertical experience timeline. `detailed` lists highlights instead of the one-line summary. */
export function Timeline({ items, lang, detailed = false }: { items: Experience[]; lang: Lang; detailed?: boolean }) {
  const t = translator(lang);
  return (
    <ol className="timeline">
      {items.map((item) => {
        const p = period(item.started_on, item.ended_on, lang);
        const showList = detailed && item.highlights.length > 0;
        return (
          <li key={item.id} className={`rv${p.current ? ' current' : ''}`}>
            <span className="when data">
              {p.from} – {p.current ? <span className="now">{p.to}</span> : p.to}
            </span>
            <h3>{t(item.role)}</h3>
            <div className="org">
              {item.organization} {item.kind && <small>· {t(item.kind)}</small>}
            </div>
            {showList ? (
              <ul>{item.highlights.map((h, i) => <li key={i}>{t(h)}</li>)}</ul>
            ) : (
              item.summary && <p>{t(item.summary)}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
