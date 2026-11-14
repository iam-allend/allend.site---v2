import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';
import { getLang } from '@/lib/lang';
import '@/styles/site.css';

const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Anur Mustakim — Fullstack Web Developer', template: '%s — Anur Mustakim' },
  description: 'Fullstack web developer di Semarang: HRIS, ERP, sistem manajemen servis, dan platform jurnal.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1EEE6' },
    { media: '(prefers-color-scheme: dark)', color: '#12110D' },
  ],
};

// Runs before paint: marks JS as available and applies the saved or system theme.
const BOOT = `(function(){var d=document.documentElement,t;d.classList.add('js');try{t=localStorage.getItem('theme')}catch(e){}d.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
