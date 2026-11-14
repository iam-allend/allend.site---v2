import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { copy } from '@/lib/copy';
import { translator } from '@/lib/i18n';
import { getLang } from '@/lib/lang';

export const metadata: Metadata = { title: '404', robots: { index: false } };

export default async function NotFound() {
  const lang = await getLang();
  const t = translator(lang);
  return (
    <SiteShell lang={lang}>
      <div className="wrap nf">
        <div>
          <h1>Error <em>404</em>: {t(copy.notFound.title)}</h1>
          <p>{t(copy.notFound.body)}</p>
          <div className="cta">
            <Link className="btn solid" href="/">{t(copy.notFound.home)}</Link>
            <Link className="btn line" href="/portfolio">{t(copy.common.seeWork)}</Link>
          </div>
        </div>
        <pre className="code" aria-hidden="true">
          <span className="tk-kw">GET</span> /<span className="tk-str">…</span>{'\n\n'}
          <span className="tk-fn">HTTP/1.1</span> <span className="tk-kw">404</span> Not Found{'\n'}
          <span className="tk-cls">Content-Type</span>: text/html{'\n\n'}
          {'{ '}<span className="tk-str">&quot;message&quot;</span>: <span className="tk-str">&quot;Route not found&quot;</span>{' }'}
        </pre>
      </div>
    </SiteShell>
  );
}
