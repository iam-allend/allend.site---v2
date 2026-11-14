'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Phase = 'idle' | 'loading' | 'done';

/**
 * Thin progress bar for client-side navigation, including same-page query changes
 * (pagination, filters) that loading.tsx does not cover. Starts on an internal link
 * click, completes when the URL actually changes. While loading, <html data-navigating>
 * lets CSS dim the current content.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [phase, setPhase] = useState<Phase>('idle');

  // URL changed → the new page is in; finish the bar.
  useEffect(() => {
    setPhase((p) => (p === 'loading' ? 'done' : p));
    const t = setTimeout(() => setPhase((p) => (p === 'done' ? 'idle' : p)), 320);
    return () => clearTimeout(t);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || !a.href) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setPhase('loading');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute('data-navigating', phase === 'loading');
  }, [phase]);

  return <div className={`nav-progress ${phase}`} aria-hidden="true" />;
}
