// Small inline icon set. Stroke icons inherit currentColor.

type Props = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const ArrowRight = (p: Props) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Download = (p: Props) => <svg {...base} {...p}><path d="M12 4v12M6 11l6 6 6-6M5 20h14" /></svg>;
export const Menu = (p: Props) => <svg {...base} strokeWidth={2} {...p}><path d="M4 8h16M4 16h16" /></svg>;
export const Moon = (p: Props) => <svg {...base} strokeWidth={2} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
export const Sun = (p: Props) => (
  <svg {...base} strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
