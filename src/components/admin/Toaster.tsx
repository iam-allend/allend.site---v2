'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, TOAST_EVENT, type ToastDetail } from '@/lib/toast';

type Item = ToastDetail & { id: number };

/** Stack of short-lived notices at the bottom of the admin screen. */
export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let id = 0;
    const onToast = (e: Event) => {
      const item = { ...(e as CustomEvent<ToastDetail>).detail, id: ++id };
      setItems((list) => [...list.slice(-3), item]);
      setTimeout(() => setItems((list) => list.filter((x) => x.id !== item.id)), item.kind === 'err' ? 6000 : 3200);
    };
    addEventListener(TOAST_EVENT, onToast);
    return () => removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => <p key={t.id} className={`toast ${t.kind}`}>{t.message}</p>)}
    </div>
  );
}

const FLASH: Record<string, string> = {
  created: 'Data baru dibuat.',
  saved: 'Perubahan tersimpan.',
  deleted: 'Data dihapus.',
};

/** Turns `?toast=…` (set by actions that redirect) into a toast, then removes it from the URL. */
export function FlashToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const code = params.get('toast');

  useEffect(() => {
    if (!code) return;
    toast(FLASH[code] ?? 'Selesai.');
    const rest = new URLSearchParams(params);
    rest.delete('toast');
    router.replace(rest.size ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [code, params, pathname, router]);

  return null;
}
