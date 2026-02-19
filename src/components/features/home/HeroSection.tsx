// src/components/features/home/HeroSection.tsx
import GlassCard from '@/components/shared/GlassCard';
import NeonButton from '@/components/shared/NeonButton';
import Link from 'next/link';

interface HeroSectionProps {
  profile: {
    full_name: string;
    nickname?: string | null;
    avatar_url?: string | null;
  };
  settings: {
    tagline?: string;
    site_description?: string;
    availability_status?: boolean;
    availability_message?: string;
    social_links?: {
      github?: string;
      linkedin?: string;
      instagram?: string;
      twitter?: string;
      dribbble?: string;
    };
    cv_url?: string;
  };
  stats: {
    yearsExperience: number;
    totalProjects: number;
    categories: number;
  };
  techStack: Array<{
    id: string;
    name: string;
  }>;
}

export default function HeroSection({
  profile,
  settings,
  stats,
  techStack,
}: HeroSectionProps) {
  const displayName = profile.nickname || profile.full_name || 'Developer';
  const tagline = settings.tagline || 'Digital Craftsman & Designer';
  const description = settings.site_description || 
    'I build exceptional digital experiences through code and design.';
  
  const isAvailable = settings.availability_status ?? true;
  const availabilityMessage = settings.availability_message || 
    (isAvailable ? 'Available for Freelance & Full-time' : 'Currently Not Available');

  const socialLinks = settings.social_links || {};
  const cvUrl = settings.cv_url;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Availability Badge */}
            <div className="inline-block">
              <span className={`glass-strong px-4 py-2 rounded-full text-sm font-medium ${
                isAvailable ? 'text-primary' : 'text-gray-400'
              }`}>
                {isAvailable ? '✨' : '⏸️'} {availabilityMessage}
              </span>
            </div>
            
            {/* Name & Title */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block">{displayName}</span>
              <span className="block neon-text">{tagline.split(' ')[0]}</span>
              <span className="block text-gray-500">
                {tagline.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 max-w-lg">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/portfolio">
                <NeonButton variant="primary" magnetic>
                  View Projects →
                </NeonButton>
              </Link>
              
              {cvUrl && (
                <a 
                  href={cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download
                >
                  <NeonButton variant="secondary" magnetic>
                    Download CV
                  </NeonButton>
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.github && (
                <a 
                  href={socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-lg hover:glass-strong hover:scale-110 transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              
              {socialLinks.linkedin && (
                <a 
                  href={socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-lg hover:glass-strong hover:scale-110 transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-lg hover:glass-strong hover:scale-110 transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              
              {socialLinks.twitter && (
                <a 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-lg hover:glass-strong hover:scale-110 transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Right Content - 3D Stats Card */}
          <div className="relative">
            <GlassCard variant="strong" hover neonBorder className="p-8">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <GlassCard className="p-4">
                    <div className="text-3xl font-bold text-primary">
                      {stats.yearsExperience}+
                    </div>
                    <div className="text-sm text-gray-400">Years Exp</div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="text-3xl font-bold text-primary">
                      {stats.totalProjects}+
                    </div>
                    <div className="text-sm text-gray-400">Projects</div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="text-3xl font-bold text-primary">
                      {stats.categories}+
                    </div>
                    <div className="text-sm text-gray-400">Categories</div>
                  </GlassCard>
                </div>

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">Currently Working With:</div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech) => (
                        <span key={tech.id} className="glass px-3 py-1 rounded-full text-xs">
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <GlassCard className="p-4 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isAvailable ? 'bg-primary animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium">
                      {isAvailable ? 'Available for Work' : 'Currently Busy'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isAvailable ? 'Open to new opportunities' : 'Will be available soon'}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 scroll-indicator">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}