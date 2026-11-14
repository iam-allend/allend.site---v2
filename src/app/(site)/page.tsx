import Link from 'next/link';
import { HeroDevice } from '@/components/home/HeroDevice';
import { ErdIllustration, PenIllustration, RouterIllustration } from '@/components/home/Illustrations';
import { ArrowRight, Download } from '@/components/icons';
import { ContactPanel } from '@/components/site/ContactPanel';
import { projectFrames } from '@/components/site/ProjectMedia';
import { Thumbs } from '@/components/site/Thumbs';
import { Timeline } from '@/components/site/Timeline';
import { copy } from '@/lib/copy';
import { getExperiences, getFeaturedProjects, getProfile, getSkillGroups } from '@/lib/content';
import { mediaUrl } from '@/lib/format';
import { l, translator } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import '@/styles/hero.css';

export default async function HomePage() {
  const lang = await getLang();
  const t = translator(lang);
  const [profile, featured, homeExperience, groups] = await Promise.all([
    getProfile(), getFeaturedProjects(), getExperiences(true), getSkillGroups(),
  ]);
  const webSkills = groups.filter((g) => g.area === 'web').flatMap((g) => g.skills.map((s) => t(s.name)));
  const dailyStack = groups.filter((g) => g.area === 'web').slice(0, 3).flatMap((g) => g.skills.slice(0, 3).map((s) => t(s.name)));
  const [roleFirst, ...roleRest] = t(profile.headline).split(' ');

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="byline">
                <span><strong>{profile.full_name}</strong><small>Living with intention</small></span>
              </div>
              <h1 className="role-title">{roleFirst}<br />{roleRest.join(' ')}<em>.</em></h1>
              <p className="lede">{t(profile.intro)}</p>
              <p className="also">
                {t(copy.common.alsoDoing)}
                <span className="tag">{t(copy.common.graphicDesign)}</span>
                <span className="tag">IT support</span>
              </p>
              <div className="cta">
                <Link className="btn solid" href="/portfolio">{t(copy.common.seeWork)} <ArrowRight /></Link>
                {profile.cv_path && (
                  <a className="btn line" href={mediaUrl(profile.cv_path)} download>{t(copy.common.downloadCv)} <Download /></a>
                )}
              </div>
            </div>
            <HeroDevice
              labels={{ code: t(l('Kode', 'Code')), design: t(l('Desain', 'Design')), hardware: 'Hardware', group: t(l('Animasi', 'Animation')) }}
            />
          </div>

          <div className="stack-line data">
            <span>{t(copy.common.dailyStack)}</span>
            {dailyStack.map((s) => <b key={s}>{s}</b>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead rv">
            <div>
              <h2>{t(copy.home.systemsTitle)}</h2>
              <p>{t(copy.home.systemsHint)}</p>
            </div>
            <Link className="link" href="/portfolio">{t(copy.common.allWork)}</Link>
          </div>
          <ol className="plist">
            {featured.map((p) => (
              <li key={p.id} className="prow rv">
                <Thumbs title={t(p.title)} frames={projectFrames(p, lang)} label={t(copy.common.preview)} />
                <div>
                  <h3><Link href={`/portfolio/${p.slug}`}>{t(p.title)}</Link></h3>
                  <span className="client">{t(p.client)}</span>
                </div>
                <p className="kind">{t(p.summary)}</p>
                <span className="yr data">{p.year ?? '—'}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead rv">
            <div>
              <h2>{t(copy.home.whatTitle)}</h2>
              <p>{t(copy.home.whatIntro)}</p>
            </div>
          </div>
          <div className="caps">
            <article className="cap main rv">
              <span className="label">{t(copy.home.mainFocus)}</span>
              <h3>{t(copy.home.webTitle)}</h3>
              <p>{t(copy.home.webBody)}</p>
              <ul className="chips on-paper">{webSkills.map((s) => <li key={s}>{s}</li>)}</ul>
              <div className="cap-art"><ErdIllustration /></div>
            </article>
            <article className="cap rv">
              <div className="cap-side">
                <div>
                  <span className="label">{t(copy.home.supporting)}</span>
                  <h3>{t(copy.common.graphicDesign)}</h3>
                  <p>{t(copy.home.designBody)}</p>
                </div>
                <PenIllustration />
              </div>
            </article>
            <article className="cap rv">
              <div className="cap-side">
                <div>
                  <span className="label">{t(copy.home.supporting)}</span>
                  <h3>IT support</h3>
                  <p>{t(copy.home.itBody)}</p>
                </div>
                <RouterIllustration />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="sticky rv">
            <h2>{t(copy.home.expTitle)}</h2>
            <p>{t(copy.home.expIntro)}</p>
            <Link className="link" href="/about#experience">{t(copy.home.fullHistory)}</Link>
          </div>
          <Timeline items={homeExperience} lang={lang} />
        </div>
      </section>

      <div className="wrap">
        <ContactPanel lang={lang} title={copy.home.ctaTitle} body={copy.home.ctaBody} email={profile.email} />
      </div>
    </>
  );
}
