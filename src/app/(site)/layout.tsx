import { SiteShell } from '@/components/site/SiteShell';
import { getLang } from '@/lib/lang';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang={await getLang()}>{children}</SiteShell>;
}
