import Link from 'next/link';
import { ArrowRight } from '@/components/icons';
import { copy } from '@/lib/copy';
import { translator, type I18n, type Lang } from '@/lib/i18n';
import { CopyButton } from './CopyButton';

/** Dark call-to-action panel closing the home and about pages. */
export function ContactPanel({ lang, title, body, email }: { lang: Lang; title: I18n; body: I18n; email?: string }) {
  const t = translator(lang);
  return (
    <section className="panel rv">
      <div>
        <h2>{t(title)}</h2>
        <p>{t(body)}</p>
      </div>
      <div className="actions">
        <Link className="btn solid" href="/contact">
          {t(copy.home.ctaButton)} <ArrowRight />
        </Link>
        {email && (
          <div className="mail">
            <code>{email}</code>
            <CopyButton value={email} label={t(copy.common.copy)} done={t(copy.common.copied)} />
          </div>
        )}
      </div>
    </section>
  );
}
