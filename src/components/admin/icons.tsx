// Admin icon set (24px grid, stroke = currentColor).

type Props = { className?: string };

const svg = (d: React.ReactNode) =>
  function Icon({ className }: Props) {
    return (
      <svg className={className ?? 'ic'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    );
  };

export const IconHome = svg(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /></>);
export const IconFolder = svg(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
export const IconClock = svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const IconLayers = svg(<><path d="M12 4 3 9l9 5 9-5z" /><path d="m3 14 9 5 9-5" /></>);
export const IconMail = svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>);
export const IconUser = svg(<><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>);
export const IconPlus = svg(<path d="M12 5v14M5 12h14" />);
export const IconEdit = svg(<><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>);
export const IconTrash = svg(<><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></>);
export const IconEye = svg(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>);
export const IconStar = svg(<path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.3 7.2 18.8l1-5.4-4-3.7 5.4-.7z" />);
export const IconSearch = svg(<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></>);
export const IconImage = svg(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 9" /></>);
export const IconExternal = svg(<><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>);
export const IconArchive = svg(<><rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v10h14V9M10 13h4" /></>);
export const IconReply = svg(<><path d="M9 7 4 12l5 5" /><path d="M4 12h10a6 6 0 0 1 6 6" /></>);
export const IconLogout = svg(<><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></>);
