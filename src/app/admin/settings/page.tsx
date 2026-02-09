import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchMultipleSettings } from '@/lib/actions/settings.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettingsForm from '@/components/features/admin/GeneralSettingsForm';
import SocialLinksForm from '@/components/features/admin/SocialLinksForm';
import AvailabilityForm from '@/components/features/admin/AvailabilityForm';
import ContactInfoForm from '@/components/features/admin/ContactInfoForm';
import SEOForm from '@/components/features/admin/SEOForm';
import AboutForm from '@/components/features/admin/AboutForm';

// Define all settings types - SESUAI dengan interface di masing-masing Form
interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  ownerName: string;
  yearsExperience: number;
  tagline?: string;
  primaryRole?: string;
  location?: string;
}

interface SocialLinksSettings {
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  behance?: string;
  dribbble?: string;
}

// ✅ FIXED - Sesuaikan dengan Availability di AvailabilityForm
interface AvailabilitySettings {
  isAvailable: boolean;
  type: "full-time" | "freelance" | "both" | "not-available";
  showOnHomepage: boolean;
  customMessage?: string;
}

interface ContactInfoSettings {
  displayEmail: string;
  recipientEmail: string;
  displayPhone?: string;
  displayLocation?: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl?: string;
  faviconUrl?: string;
  googleAnalyticsId?: string;
}

interface AboutSettings {
  bio: string;
  skills: string[];
}

interface SettingsData {
  general?: GeneralSettings;
  social_links?: SocialLinksSettings;
  availability?: AvailabilitySettings;
  contact_info?: ContactInfoSettings;
  seo?: SEOSettings;
  about?: AboutSettings;
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all settings data
  const result = await fetchMultipleSettings([
    'general',
    'social_links',
    'availability',
    'contact_info',
    'seo',
    'about',
  ]);

  const settings = (result.success ? result.data : {}) as SettingsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your website configuration and content
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-strong">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <GeneralSettingsForm initialData={settings.general} />
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <SocialLinksForm initialData={settings.social_links} />
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability">
          <AvailabilityForm initialData={settings.availability} />
        </TabsContent>

        {/* Contact Info */}
        <TabsContent value="contact">
          <ContactInfoForm initialData={settings.contact_info} />
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <SEOForm initialData={settings.seo} />
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <AboutForm initialData={settings.about} />
        </TabsContent>
      </Tabs>
    </div>
  );
}