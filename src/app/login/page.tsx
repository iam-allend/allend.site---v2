import type { Metadata } from 'next';
import Link from 'next/link';
import { LangSwitch, ThemeToggle } from '@/components/site/HeaderControls';
import { copy } from '@/lib/copy';
import { l, translator } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

const text = {
  side: l('Ruang kerja', 'Workspace'),
  sideBody: l('Kelola proyek, riwayat, keahlian, pesan masuk, dan profil situs.', 'Manage projects, history, skills, incoming messages and the site profile.'),
  back: l('Kembali ke situs', 'Back to site'),
  title: l('Masuk', 'Sign in'),
  lead: l('Khusus pemilik situs.', 'For the site owner only.'),
  password: l('Kata sandi', 'Password'),
  show: l('Tampilkan', 'Show'),
  hide: l('Sembunyikan', 'Hide'),
  pending: l('Memeriksa…', 'Checking…'),
  denied: l('Akun ini tidak punya akses admin.', 'This account has no admin access.'),
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string }> }) {
  const lang = await getLang();
  const t = translator(lang);
  const { next, reason } = await searchParams;

  return (
    <main className="auth">
      <aside className="auth-side">
        <Link className="mark" href="/"><b>AM</b><span>allend.site</span></Link>
        <div>
          <h1>{t(text.side)}</h1>
          <p>{t(text.sideBody)}</p>
        </div>
        <Link className="back" href="/">← {t(text.back)}</Link>
      </aside>
      <div className="auth-main">
        <div className="controls">
          <LangSwitch lang={lang} label={t(copy.common.language)} />
          <ThemeToggle label={t(copy.common.theme)} />
        </div>
        <LoginForm
          next={next}
          notice={reason === 'denied' ? t(text.denied) : undefined}
          text={{
            title: t(text.title), lead: t(text.lead), email: 'Email', password: t(text.password),
            show: t(text.show), hide: t(text.hide), submit: t(text.title), pending: t(text.pending),
          }}
        />
      </div>
    </main>
  );
}
