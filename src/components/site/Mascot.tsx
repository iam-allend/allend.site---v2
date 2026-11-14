'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { MascotHandle } from '@/lib/mascot/bit';

const TOGGLE_EVENT = 'mascot:toggle';
const STATE_EVENT = 'mascot:state';

/** Mounts Bit once per page load; re-enters on client-side navigation. */
export function Mascot() {
  const pathname = usePathname();
  const handle = useRef<MascotHandle | null>(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    let cancelled = false;
    const load = async (on: boolean) => {
      const { mountMascot, mascotStore } = await import('@/lib/mascot/bit');
      if (cancelled) return;
      if (on && !handle.current) handle.current = mountMascot();
      dispatchEvent(new CustomEvent(STATE_EVENT, { detail: mascotStore.enabled() }));
    };

    const toggle = async () => {
      const { mascotStore } = await import('@/lib/mascot/bit');
      if (handle.current) {
        mascotStore.set(false);
        dispatchEvent(new CustomEvent(STATE_EVENT, { detail: false }));
        const leaving = handle.current;
        handle.current = null;
        await leaving.leave();
      } else {
        mascotStore.set(true);
        load(true);
      }
    };

    import('@/lib/mascot/bit').then(({ mascotStore }) => load(mascotStore.enabled()));
    addEventListener(TOGGLE_EVENT, toggle);
    return () => {
      cancelled = true;
      removeEventListener(TOGGLE_EVENT, toggle);
      handle.current?.destroy();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    if (pathname !== firstPath.current) handle.current?.navigated();
    firstPath.current = pathname;
  }, [pathname]);

  return null;
}

export function MascotToggle({ hide, show }: { hide: string; show: string }) {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    addEventListener(STATE_EVENT, sync);
    return () => removeEventListener(STATE_EVENT, sync);
  }, []);

  if (on === null) return null;
  return (
    <button type="button" onClick={() => dispatchEvent(new Event(TOGGLE_EVENT))}>
      {on ? hide : show}
    </button>
  );
}
