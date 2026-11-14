'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Menu, Moon, Sun } from '@/components/icons';
import type { Lang } from '@/lib/i18n';

type NavItem = { href: string; label: string };

export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onToggle = () => setOpen((v) => !v);
    addEventListener('keydown', onKey);
    addEventListener('nav:toggle', onToggle);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('nav:toggle', onToggle);
    };
  }, []);

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav className={`nav${open ? ' open' : ''}`} id="nav" aria-label={label}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const choose = (next: Lang) => {
    if (next === lang || pending) return;
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.refresh());
  };

  return (
    <div className="seg" role="group" aria-label={label}>
      {(['id', 'en'] as const).map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => choose(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    dispatchEvent(new CustomEvent('themechange', { detail: next }));
  };
  return (
    <button type="button" className="icon-btn" aria-label={label} onClick={toggle}>
      <Moon className="i-moon" />
      <Sun className="i-sun" />
    </button>
  );
}

export function MenuButton({ label }: { label: string }) {
  return (
    <button type="button" className="icon-btn menu-btn" aria-label={label} aria-controls="nav" onClick={() => dispatchEvent(new Event('nav:toggle'))}>
      <Menu />
    </button>
  );
}
