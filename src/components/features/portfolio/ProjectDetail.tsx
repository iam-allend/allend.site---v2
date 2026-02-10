'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = project.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Get category emoji
  const getCategoryEmoji = () => {
    const fieldTitle = project.field?.title?.toLowerCase() || '';
    
    if (fieldTitle.includes('web')) return '🌐';
    if (fieldTitle.includes('mobile')) return '📱';
    if (fieldTitle.includes('design')) return '🎨';
    if (fieldTitle.includes('data')) return '📊';
    if (fieldTitle.includes('ai') || fieldTitle.includes('ml')) return '🤖';
    
    return '💼';
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full glass-strong hover:bg-red-500/20 flex items-center justify-center z-10 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:p-8 sm:p-6 p-4">
          {/* Gallery Section */}
          <div>
            {hasImages ? (
              <>
                {/* Main Image */}
                <div className="relative h-96 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/20 rounded-2xl mb-4 overflow-hidden">
                  <Image
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt_text || project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong hover:bg-[#00D9FF]/20 flex items-center justify-center transition-all"
                        aria-label="Previous image"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong hover:bg-[#00D9FF]/20 flex items-center justify-center transition-all"
                        aria-label="Next image"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto sm:mt-2 lg:mt-5 p-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden glass-strong relative ${
                          idx === currentImageIndex ? 'ring-2 ring-[#00D9FF]' : ''
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt_text || `${project.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative h-96 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/20 rounded-2xl mb-4 flex items-center justify-center">
                <div className="text-8xl">{getCategoryEmoji()}</div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {project.field && (
                  <span className="px-3 py-1 rounded-full text-sm glass text-[#00D9FF]">
                    {project.field.title}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'COMPLETED'
                      ? 'bg-green-500/20 text-green-400'
                      : project.status === 'ONGOING'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {project.status}
                </span>
                {project.is_featured && (
                  <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400">
                    ⭐ Featured
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-400">{project.description}</p>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {project.role && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Role</div>
                  <div className="font-medium">{project.role}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="font-medium">{project.status}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-medium">
                  {formatDate(project.start_date)} - {project.is_current ? 'Present' : formatDate(project.end_date)}
                </div>
              </div>
              
              {project.field && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Category</div>
                  <div className="font-medium">{project.field.title}</div>
                </div>
              )}
            </div>

            {/* Action Links */}
            {(project.project_url || project.github_url) && (
              <div className="flex gap-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-[#00D9FF] text-black rounded-lg font-semibold text-center hover:scale-105 transition-all"
                  >
                    Live Site →
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 glass-strong rounded-lg font-semibold text-center hover:scale-105 transition-all"
                  >
                    GitHubte
                  </a>
                )}
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#00D9FF]">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id}
                      className="glass-strong px-3 py-1 rounded-full text-sm"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}