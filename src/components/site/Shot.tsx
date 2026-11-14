// Drawn placeholder "screenshot", used until a project has real images.

export type ShotKind = 'dash' | 'table' | 'site' | 'form' | 'post' | 'network' | 'cube';

const PLACEHOLDERS: Record<string, ShotKind[]> = {
  web: ['dash', 'table', 'form'],
  design: ['post', 'post', 'post'],
  it: ['network', 'table', 'network'],
  other: ['cube', 'site', 'cube'],
};

export const placeholderKinds = (category: string) => PLACEHOLDERS[category] ?? PLACEHOLDERS.web;

const Ln = ({ s = '' }: { s?: '' | 's' | 'm' }) => <i className={`ln ${s}`} />;
const times = (n: number) => Array.from({ length: n }, (_, i) => i);

function Body({ kind }: { kind: ShotKind }) {
  switch (kind) {
    case 'dash':
      return (
        <>
          <div className="side"><Ln s="m" /><Ln /><Ln s="s" /><Ln s="m" /><Ln s="s" /></div>
          <div className="main">
            <div className="stats">{times(3).map((i) => <b key={i} className="box"><Ln s="s" /><Ln s="m" /></b>)}</div>
            <div className="box chart">{[40, 62, 48, 86, 58, 70].map((h, i) => <b key={i} style={{ height: `${h}%` }} />)}</div>
          </div>
        </>
      );
    case 'table':
      return (
        <>
          <div className="row head"><Ln s="s" /><Ln s="m" /><Ln s="m" /><Ln /></div>
          {times(5).map((i) => (
            <div key={i} className="row"><i className="dot" /><Ln s={i % 2 ? 'm' : ''} /><Ln s="s" /><i className="pill" /></div>
          ))}
        </>
      );
    case 'form':
      return (
        <>
          {times(4).map((i) => <div key={i} className="fld"><Ln s="s" /><i className="inp" /></div>)}
          <div className="fld wide"><Ln s="s" /><i className="inp" /></div>
          <i className="sub" />
        </>
      );
    case 'post':
      return <>{times(4).map((i) => <b key={i} className="tile" />)}</>;
    case 'network':
      return (
        <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M60 18v18M60 36 24 58M60 36v22M60 36l36 22" strokeDasharray="3 3" />
          <rect x="46" y="6" width="28" height="14" rx="3" />
          <rect x="48" y="34" width="24" height="8" rx="2" fill="var(--accent)" stroke="none" />
          <circle cx="24" cy="62" r="6" /><circle cx="60" cy="62" r="6" /><circle cx="96" cy="62" r="6" />
        </svg>
      );
    case 'cube':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M50 12 86 32v38L50 90 14 70V32z" />
          <path d="M14 32l36 20 36-20M50 52v38" />
          <path d="M50 12 86 32 50 52 14 32z" fill="var(--accent)" stroke="none" opacity=".9" />
        </svg>
      );
    default:
      return (
        <>
          <div className="hero-b"><Ln /><Ln s="m" /><Ln s="s" /><i className="btn-b" /></div>
          <div className="cards">{times(3).map((i) => <b key={i} className="box"><Ln s="m" /><Ln s="s" /></b>)}</div>
        </>
      );
  }
}

export function Shot({ kind }: { kind: ShotKind }) {
  const variant = kind === 'network' || kind === 'cube' ? 'art' : kind;
  return (
    <div className={`shot v-${variant}`} aria-hidden="true">
      <div className="shot-bar"><i /></div>
      <div className="shot-body"><Body kind={kind} /></div>
    </div>
  );
}
