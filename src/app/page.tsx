// src/app/page.tsx
import { Metadata } from 'next';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedWorkSection from '@/components/features/home/FeaturedWorkSection';
import { getHomePageData } from '@/lib/db/queries/home';

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const { profile, settings } = await getHomePageData();
  
  const siteTitle = settings.site_title || `${profile.full_name || 'Portfolio'} - Developer & Designer`;
  const siteDescription = settings.site_description || 
    'Showcasing my work in web development, mobile apps, and design.';

  return {
    title: siteTitle,
    description: siteDescription,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
    },
  };
}

// Revalidate every 1 hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch all home page data server-side
  const { profile, settings, featuredProjects, stats, techStack } = await getHomePageData();

  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <Header />
      
      <main>
        <HeroSection 
          profile={profile}
          settings={settings}
          stats={stats}
          techStack={techStack}
        />
        
        <FeaturedWorkSection 
          projects={featuredProjects}
        />
        
        {/* CTA Section - will add next */}
      </main>

      <Footer />
    </>
  );
}