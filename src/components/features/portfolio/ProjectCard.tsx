'use client';

import Image from 'next/image';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Get first image or use placeholder
  const thumbnail = project.images?.[0]?.url || '/gradient-blue.jpg';
  const thumbnailAlt = project.images?.[0]?.alt_text || project.title;

  // Get category emoji based on field
  const getCategoryEmoji = () => {
    const fieldTitle = project.field?.title?.toLowerCase() || '';
    
    if (fieldTitle.includes('web')) return '🌐';
    if (fieldTitle.includes('mobile')) return '📱';
    if (fieldTitle.includes('design')) return '🎨';
    if (fieldTitle.includes('data')) return '📊';
    if (fieldTitle.includes('ai') || fieldTitle.includes('ml')) return '🤖';
    
    return '💼'; // Default
  };

  // Status color mapping
  const getStatusColor = () => {
    switch (project.status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'ONGOING':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'PAUSED':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Format duration
  const getDuration = () => {
    if (!project.start_date) return null;
    
    const start = new Date(project.start_date);
    const end = project.end_date ? new Date(project.end_date) : new Date();
    
    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (months < 1) return '< 1 month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div
      onClick={() => onClick(project)}
      className="glass-strong rounded-2xl overflow-hidden hover-lift cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative h-64 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/20 overflow-hidden">
        {project.images?.[0] ? (
          <Image
            src={thumbnail}
            alt={thumbnailAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">{getCategoryEmoji()}</div>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.is_featured && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-strong text-xs font-semibold text-[#00D9FF]">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Status */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {project.field && (
            <span className="px-2 py-1 rounded-full text-xs glass text-[#00D9FF]">
              {project.field.title}
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
            {project.status}
          </span>
          {project.is_current && (
            <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
              Current
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#00D9FF] transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description || 'No description available'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {project.role && (
            <span className="flex items-center gap-1">
              <span>👤</span> {project.role}
            </span>
          )}
          {getDuration() && (
            <span className="flex items-center gap-1">
              <span>📅</span> {getDuration()}
            </span>
          )}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1">
          {project.technologies?.slice(0, 3).map((tech) => (
            <span key={tech.id} className="glass px-2 py-1 rounded text-xs">
              {tech.name}
            </span>
          ))}
          {project.technologies && project.technologies.length > 3 && (
            <span className="glass px-2 py-1 rounded text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}