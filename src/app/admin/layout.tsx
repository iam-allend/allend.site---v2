import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { IconExternal, IconLogout } from '@/components/admin/icons';
import { FlashToast, Toaster } from '@/components/admin/Toaster';
import { NavProgress } from '@/components/NavProgress';
import { ThemeToggle } from '@/components/site/HeaderControls';
import { requireAdmin } from '@/lib/auth';
import '@/styles/admin.css';
import { Logo } from '@/components/site/Logo';

export const metadata: Metadata = { title: { default: 'Dashboard', template: '%s | Admin ALLEND' }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { db, user } = await requireAdmin();
  const { count: unread } = await db
    .from('v2_messages')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null)
    .is('archived_at', null);

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link className="mark" href="/admin"><Logo className="mark-logo" /><span>Admin</span></Link>
        <AdminNav unread={unread ?? 0} />
        <div className="adm-side-foot">
          <div className="adm-user">
            <span className="avatar" aria-hidden="true">{user.email?.[0]?.toUpperCase()}</span>
            <span className="who">{user.email}</span>
          </div>
          <div className="row">
            <Link className="side-link" href="/" target="_blank"><IconExternal /> Lihat situs</Link>
            <ThemeToggle label="Tema gelap / terang" />
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="side-link"><IconLogout /> Keluar</button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
      <Toaster />
      <Suspense><FlashToast /></Suspense>
      <Suspense><NavProgress /></Suspense>
    </div>
  );
}
