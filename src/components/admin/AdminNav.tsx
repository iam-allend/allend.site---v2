'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconClock, IconFolder, IconHome, IconLayers, IconMail, IconUser } from './icons';

const ITEMS = [
  { href: '/admin', label: 'Ringkasan', Icon: IconHome },
  { href: '/admin/projects', label: 'Proyek', Icon: IconFolder },
  { href: '/admin/history', label: 'Riwayat', Icon: IconClock },
  { href: '/admin/skills', label: 'Keahlian', Icon: IconLayers },
  { href: '/admin/messages', label: 'Pesan', Icon: IconMail },
  { href: '/admin/profile', label: 'Profil & CV', Icon: IconUser },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const current = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));
  return (
    <nav className="adm-nav" aria-label="Admin">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} aria-current={current(href) ? 'page' : undefined}>
          <Icon />
          <span>{label}</span>
          {href === '/admin/messages' && unread > 0 && <span className="badge">{unread}</span>}
        </Link>
      ))}
    </nav>
  );
}
