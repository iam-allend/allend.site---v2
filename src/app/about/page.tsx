// src/app/about/page.tsx
import AboutPageClient from '@/components/features/about/AboutPageClient';
import { getCurrentCV } from '@/lib/actions/user.actions';
import { getGeneralSettings } from '@/lib/db/queries/home';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  // Fetch CV URL and settings
  const [cvResult, settings] = await Promise.all([
    getCurrentCV(),
    getGeneralSettings(),
  ]);

  const cvUrl = cvResult.cvUrl || null;
  const availabilityStatus = settings.availability_status ?? true;

  return (
    <AboutPageClient 
      cvUrl={cvUrl} 
      availabilityStatus={availabilityStatus}
    />
  );
}