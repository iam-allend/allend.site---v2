import type { Metadata } from 'next';
import { copy } from '@/lib/copy';
import { getProfile } from '@/lib/content';
import { translator, tr } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import { ContactForm } from './ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: tr(copy.contact.title, lang), description: tr(copy.contact.intro, lang) };
}

export default async function ContactPage() {
  const lang = await getLang();
  const t = translator(lang);
  const profile = await getProfile();
  const c = copy.contact;

  const github = profile.socials.github;
  const linkedin = profile.socials.linkedin;

  return (
    <div className="wrap">
      <header className="page-head">
        <h1>{t(c.title)}</h1>
        <p className="intro">{t(c.intro)}</p>
      </header>

      <div className="contact-grid">
        <aside className="rv">
          <div className="direct">
            <a href={`mailto:${profile.email}`}><span>Email</span><span>{profile.email}</span></a>
            {linkedin && <a href={linkedin} target="_blank" rel="noopener"><span>LinkedIn</span><span>{linkedin.split('/in/')[1] ?? 'LinkedIn'} ↗</span></a>}
            {github && <a href={github} target="_blank" rel="noopener"><span>GitHub</span><span>{github.split('/').pop()} ↗</span></a>}
            <div><span>{t(copy.about.location)}</span><span>{profile.location}</span></div>
          </div>
          <p className="direct-note">{t(c.note)}</p>
        </aside>

        <div className="rv">
          <ContactForm
            text={{
              topic: t(c.topic),
              topics: (Object.keys(c.topics) as (keyof typeof c.topics)[]).map((value) => ({ value, label: t(c.topics[value]) })),
              name: t(c.name), namePh: t(c.namePh),
              email: t(c.email), emailPh: t(c.emailPh),
              org: t(c.org), optional: t(c.optional),
              message: t(c.message), messagePh: t(c.messagePh),
              privacy: t(c.privacy), send: t(c.send), sending: t(c.sending),
              thanks: t(c.thanks), sentBody: t(c.sentBody), another: t(c.another),
            }}
          />
        </div>
      </div>
    </div>
  );
}
