import Link from 'next/link';
import { Suspense } from 'react';
import { NavProgress } from '@/components/NavProgress';
import { copy } from '@/lib/copy';
import { getProfile } from '@/lib/content';
import { mediaUrl } from '@/lib/format';
import { translator, type Lang } from '@/lib/i18n';
import { LangSwitch, MenuButton, NavLinks, ThemeToggle } from './HeaderControls';
import { Mascot, MascotToggle } from './Mascot';
import { Reveal } from './Reveal';
import { Logo } from './Logo';

export function navItems(lang: Lang) {
  const t = translator(lang);
  return [
    { href: '/', label: t(copy.nav.home) },
    { href: '/portfolio', label: t(copy.nav.work) },
    { href: '/about', label: t(copy.nav.about) },
    { href: '/contact', label: t(copy.nav.contact) },
  ];
}

export async function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = translator(lang);
  const profile = await getProfile();
  const nav = navItems(lang);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <Link className="mark" href="/"><Logo className="mark-logo" /><span>allend</span></Link>
          <NavLinks items={nav} label={t(copy.nav.main)} />
          <div className="controls">
            <LangSwitch lang={lang} label={t(copy.common.language)} />
            <ThemeToggle label={t(copy.common.theme)} />
            <MenuButton label={t(copy.common.menu)} />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div className="who">
              <strong>{profile.full_name}</strong>
              <p>{t(copy.footer.blurb)}</p>
            </div>
            <div>
              <h4>{t(copy.footer.pages)}</h4>
              <ul>{nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}</ul>
            </div>
            <div>
              <h4>{t(copy.footer.profiles)}</h4>
              <ul>
                {profile.socials.github && <li><a href={profile.socials.github} target="_blank" rel="noopener">GitHub</a></li>}
                {profile.socials.linkedin && <li><a href={profile.socials.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>}
                {profile.socials.instagram && <li><a href={profile.socials.instagram} target="_blank" rel="noopener">Instagram</a></li>}
              </ul>
            </div>
            <div>
              <h4>{t(copy.footer.contact)}</h4>
              <ul>
                <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
                {profile.cv_path && <li><a href={mediaUrl(profile.cv_path)} download>{t(copy.common.downloadCv)}</a></li>}
              </ul>
            </div>
          </div>
          <div className="foot-base">
            <span>© {new Date().getFullYear()} {profile.full_name}</span>
            <span className="end">
              <MascotToggle hide={t(copy.footer.hideMascot)} show={t(copy.footer.showMascot)} />
              <Link href="/login">{t(copy.footer.admin)}</Link>
            </span>
          </div>
        </div>
      </footer>

      <Reveal />
      <Mascot />
      <Suspense><NavProgress /></Suspense>
    </>
  );
}
