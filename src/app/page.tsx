import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedWorkSection from '@/components/features/home/FeaturedWorkSection';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <Header />
      
      <main>
        <HeroSection />
        <FeaturedWorkSection />
        {/* CTA Section - will add next */}
      </main>

      <Footer />
    </>
  );
}