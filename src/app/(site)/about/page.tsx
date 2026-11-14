import type { Metadata } from 'next';
import Link from 'next/link';
import { Download } from '@/components/icons';
import { ContactPanel } from '@/components/site/ContactPanel';
import { Timeline } from '@/components/site/Timeline';
import { copy } from '@/lib/copy';
import { getEducation, getExperiences, getProfile, getSkillGroups } from '@/lib/content';
import { mediaUrl, period } from '@/lib/format';
import { translator, tr } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import { Logo } from '@/components/site/Logo';
import type { SkillGroup } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const profile = await getProfile();
  return { title: tr(copy.about.title, lang), description: tr(profile.about, lang).slice(0, 160) };
}

/** Wraps the words between *asterisks* in the about title with <em>. */
function emphasise(text: string) {
  return text.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}

export default async function AboutPage() {
  const lang = await getLang();
  const t = translator(lang);
  const [profile, groups, experiences, education] = await Promise.all([
    getProfile(), getSkillGroups(), getExperiences(false), getEducation(),
  ]);

  const web = groups.filter((g) => g.area === 'web');
  const others = groups.filter((g) => g.area !== 'web');
  const chips = (g: SkillGroup) => <ul className="chips">{g.skills.map((s) => <li key={s.id}>{t(s.name)}</li>)}</ul>;
  const latestEducation = education[0];

  return (
    <div className="wrap">
      <div className="about-top">
        <figure className="portrait rv" style={{ margin: 0 }}>
          {profile.avatar_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(profile.avatar_path)} alt={profile.full_name} width={600} height={750} />
          ) : (
            <>
              <Logo className="portrait-logo" />
              <small>{t(copy.about.photoSoon)}</small>
            </>
          )}
        </figure>
        <div className="about-copy rv">
          <h1>{emphasise(t(profile.about_title))}</h1>
          <p>{t(profile.about)}</p>
          <dl className="kv">
            <div><dt>{t(copy.about.currently)}</dt><dd>{t(profile.occupation)}</dd></div>
            {latestEducation && <div><dt>{t(copy.about.education)}</dt><dd>{t(latestEducation.program)}, {latestEducation.institution}</dd></div>}
            <div><dt>{t(copy.about.location)}</dt><dd>{profile.location}</dd></div>
            <div><dt>{t(copy.about.openTo)}</dt><dd>{t(profile.open_to)}</dd></div>
          </dl>
          <div className="cta">
            {profile.cv_path && (
              <a className="btn solid" href={mediaUrl(profile.cv_path)} download>{t(copy.common.downloadCv)} <Download /></a>
            )}
            <Link className="btn line" href="/contact">{t(copy.common.getInTouch)}</Link>
          </div>
        </div>
      </div>

      <section className="section" id="skills">
        <div className="shead rv"><h2>{t(copy.about.skills)}</h2></div>
        <div className="skill-grid">
          <article className="skill-card web rv">
            <h3>{t(copy.home.webTitle)} <small>{t(copy.about.primary)}</small></h3>
            <dl>{web.map((g) => <div key={g.id}><dt>{t(g.title)}</dt><dd>{chips(g)}</dd></div>)}</dl>
          </article>
          {others.map((g) => (
            <article key={g.id} className={`skill-card rv${g.area === 'soft' ? ' wide' : ''}`}>
              <h3>{t(g.title)}</h3>
              {chips(g)}
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="split">
          <div className="sticky rv">
            <h2>{t(copy.about.experience)}</h2>
            <p>{t(copy.about.experienceIntro)}</p>
          </div>
          <Timeline items={experiences} lang={lang} detailed />
        </div>
      </section>

      <section className="section" id="education">
        <div className="shead rv"><h2>{t(copy.about.education)}</h2></div>
        <div className="edu">
          {education.map((e) => {
            const p = period(e.started_on, e.ended_on, lang);
            return (
              <article key={e.id} className="rv">
                <span className="when data">{p.from} – {p.to}</span>
                <h3>{t(e.program)}</h3>
                <div className="org">{e.institution}</div>
                {e.grade && <span className="gpa">{t(copy.about.gpa)} {e.grade}</span>}
                {e.highlights.length > 0 && <ul>{e.highlights.map((h, i) => <li key={i}>{t(h)}</li>)}</ul>}
              </article>
            );
          })}
        </div>
      </section>

      <ContactPanel lang={lang} title={copy.about.ctaTitle} body={copy.about.ctaBody} />
    </div>
  );
}
