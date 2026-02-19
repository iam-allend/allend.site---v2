// src/components/features/home/FeaturedWorkSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';

interface FeaturedWorkSectionProps {
  projects: Project[];
}

export default function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  // Get category emoji based on field
  const getCategoryEmoji = (fieldTitle?: string) => {
    const title = fieldTitle?.toLowerCase() || '';
    
    if (title.includes('web')) return '🌐';
    if (title.includes('mobile')) return '📱';
    if (title.includes('design')) return '🎨';
    if (title.includes('data')) return '📊';
    if (title.includes('ai') || title.includes('ml')) return '🤖';
    if (title.includes('ecommerce') || title.includes('shop')) return '🛒';
    if (title.includes('game')) return '🎮';
    
    return '💼';
  };

  // Get gradient based on index
  const getGradient = (index: number) => {
    const gradients = [
      'from-[#00D9FF]/20 to-blue-500/20',
      'from-purple-500/20 to-pink-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-yellow-500/20 to-amber-500/20',
      'from-indigo-500/20 to-purple-500/20',
    ];
    return gradients[index % gradients.length];
  };

  // Get icon gradient for small cards
  const getIconGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-blue-500 to-cyan-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500',
    ];
    return gradients[index % gradients.length];
  };

  // Prepare projects with layout types
  const layoutProjects = projects.slice(0, 5).map((project, index) => {
    let type: 'large' | 'small' | 'medium' = 'small';
    let gridClass = '';

    if (index === 0) {
      type = 'large';
      gridClass = 'bento-item-1';
    } else if (index === 3) {
      type = 'medium';
      gridClass = 'bento-item-4';
    } else if (index === 1) {
      gridClass = 'bento-item-2';
    } else if (index === 2) {
      gridClass = 'bento-item-3';
    } else if (index === 4) {
      gridClass = 'bento-item-5';
    }

    return {
      ...project,
      type,
      gridClass,
      emoji: getCategoryEmoji(project.field?.title),
      gradient: getGradient(index),
      iconGradient: getIconGradient(index),
    };
  });

  // Add "More Projects" card if there are more than 5 projects
  const hasMoreProjects = projects.length > 5;

  return (
    <section id="work" className="relative px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="neon-text">Work</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A curated selection of my best projects
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {layoutProjects.map((project: any, index) => {
            const thumbnail = project.images?.[0]?.url;

            // Large Featured Project
            if (project.type === 'large') {
              return (
                <Link
                  key={project.id}
                  href={`/portfolio#${project.slug}`}
                  className={`${project.gridClass} glass-strong rounded-2xl overflow-hidden hover-lift project-card group cursor-pointer`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`flex-1 bg-gradient-to-br ${project.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
                      {/* Background Image if available */}
                      {thumbnail && (
                        <div className="absolute inset-0">
                          <Image
                            src={thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-4">{project.emoji}</div>
                        <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-300">{project.field?.title || 'Project'}</p>
                      </div>
                    </div>
                    <div className="p-6 border-t border-white/10">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies?.slice(0, 3).map((tech: any) => (
                          <span
                            key={tech.id}
                            className="glass px-2 py-1 rounded text-xs text-[#00D9FF]"
                          >
                            {tech.name}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="glass px-2 py-1 rounded text-xs text-gray-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            }

            // Small Cards
            if (project.type === 'small') {
              return (
                <Link
                  key={project.id}
                  href={`/portfolio#${project.slug}`}
                  className={`${project.gridClass} glass-strong rounded-2xl p-6 hover-lift project-card cursor-pointer`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.iconGradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {thumbnail ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src={thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        project.emoji
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{project.title}</h3>
                      <span className="text-xs text-gray-400 truncate block">
                        {project.field?.title || 'Project'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {project.technologies?.slice(0, 2).map((tech: any) => (
                      <span
                        key={tech.id}
                        className="glass px-2 py-1 rounded text-xs"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 2 && (
                      <span className="glass px-2 py-1 rounded text-xs text-gray-400">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>
                </Link>
              );
            }

            // Medium Card
            if (project.type === 'medium') {
              return (
                <Link
                  key={project.id}
                  href={`/portfolio#${project.slug}`}
                  className={`${project.gridClass} glass-strong rounded-2xl overflow-hidden hover-lift project-card cursor-pointer`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`flex-1 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                      {thumbnail && (
                        <div className="absolute inset-0">
                          <Image
                            src={thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover opacity-30 hover:opacity-40 transition-opacity"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="relative z-10 text-center p-4">
                        <div className="text-5xl mb-3">{project.emoji}</div>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.field?.title || project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            }

            return null;
          })}

          {/* More Projects Card */}
          {hasMoreProjects && (
            <Link
              href="/portfolio"
              className="bento-item-6 glass-strong rounded-2xl p-6 hover-lift flex items-center justify-center cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  +{projects.length - 5}
                </div>
                <div className="text-sm text-gray-400">More Projects</div>
              </div>
            </Link>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/portfolio">
            <button className="magnetic px-8 py-4 glass-strong rounded-lg font-semibold hover:scale-105 transition-all border border-[#00D9FF]/30">
              View All Projects →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}