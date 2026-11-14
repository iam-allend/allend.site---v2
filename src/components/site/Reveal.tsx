'use client';

import { useEffect } from 'react';

/**
 * Fades `.rv` elements in as they enter the viewport, including ones streamed in later.
 * Uses a data attribute (not a class) so it never fights React over `className` during hydration.
 */
export function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-in', '');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    );
    const watch = (root: ParentNode) => root.querySelectorAll('.rv:not([data-in])').forEach((el) => io.observe(el));
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches('.rv') ? io.observe(n) : watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
