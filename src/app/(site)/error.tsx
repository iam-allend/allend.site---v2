'use client';

import { useEffect } from 'react';

/** Shown when a public page cannot load its data (e.g. the database is unreachable). */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  const en = typeof document !== 'undefined' && document.documentElement.lang === 'en';

  return (
    <div className="wrap nf">
      <div>
        <h1>{en ? 'Something went wrong.' : 'Ada yang tidak beres.'}</h1>
        <p>{en ? 'This page could not load its content. Please try again in a moment.' : 'Halaman ini gagal memuat isinya. Coba lagi sebentar lagi.'}</p>
        <div className="cta">
          <button type="button" className="btn solid" onClick={reset}>{en ? 'Try again' : 'Coba lagi'}</button>
        </div>
      </div>
    </div>
  );
}
