'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [imageDirection, setImageDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const images = project.images || [];
  const hasImages = images.length > 0;
  const description = project.description || '';
  const isDescriptionLong = description.length > 200;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextImage = () => {
    setImageDirection(1);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setImageDirection(-1);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getCategoryEmoji = () => {
    const fieldTitle = project.field?.title?.toLowerCase() || '';
    if (fieldTitle.includes('web')) return '🌐';
    if (fieldTitle.includes('mobile')) return '📱';
    if (fieldTitle.includes('design')) return '🎨';
    if (fieldTitle.includes('data')) return '📊';
    if (fieldTitle.includes('ai') || fieldTitle.includes('ml')) return '🤖';
    return '💼';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
    if (e.key === 'ArrowLeft' && hasImages) prevImage();
    if (e.key === 'ArrowRight' && hasImages) nextImage();
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/15 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Main Container */}
        <div className="relative w-full max-w-7xl h-[95vh] md:h-[90vh] flex flex-col lg:flex-row gap-4 lg:gap-6 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          
          {/* Mobile Close Button */}
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
              Close
            </motion.button>
          </div>

          {/* Left Side - Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pt-16 lg:pt-8">
            {/* Image Gallery */}
            <div className="mb-6 md:mb-8">
              {hasImages ? (
                <>
                  {/* Main Image */}
                  <div 
                    className="relative w-full aspect-video bg-gradient-to-br from-[#00D9FF]/10 to-blue-500/10 rounded-xl overflow-hidden mb-4 group cursor-pointer"
                    onMouseEnter={() => setIsImageHovered(true)}
                    onMouseLeave={() => setIsImageHovered(false)}
                    onClick={openFullscreen}
                  >
                    <AnimatePresence initial={false} custom={imageDirection}>
                      <motion.div
                        key={currentImageIndex}
                        custom={imageDirection}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[currentImageIndex].url}
                          alt={images[currentImageIndex].alt_text || project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Fullscreen Button - Shows on hover */}
                    <AnimatePresence>
                      {isImageHovered && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullscreen();
                          }}
                          className="absolute top-4 right-4 px-3 py-2 glass-strong backdrop-blur-md rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#00D9FF]/20 transition-all z-10"
                        >
                          <Maximize2 className="w-4 h-4" />
                          View Full
                        </motion.button>
                      )}
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full glass-strong backdrop-blur-md hover:bg-[#00D9FF]/30 flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full glass-strong backdrop-blur-md hover:bg-[#00D9FF]/30 flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 glass-strong backdrop-blur-md px-3 py-1 rounded-full text-xs md:text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex pl-1 pt-1 gap-2 overflow-x-auto pb-2 custom-scrollbar-horizontal">
                      {images.map((img, idx) => (
                        <motion.button
                          key={img.id}
                          onClick={() => {
                            setImageDirection(idx > currentImageIndex ? 1 : -1);
                            setCurrentImageIndex(idx);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden glass-strong relative transition-all ${
                            idx === currentImageIndex
                              ? 'ring-2 ring-[#00D9FF] shadow-lg shadow-[#00D9FF]/50'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt_text || `${project.title} ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="relative h-[250px] md:h-[400px] bg-gradient-to-br from-[#00D9FF]/10 to-blue-500/10 rounded-xl mb-4 flex items-center justify-center">
                  <div className="text-6xl md:text-8xl">{getCategoryEmoji()}</div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-3">{project.title}</h1>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.field && (
                    <span className="px-3 py-1 rounded-full text-xs md:text-sm glass-strong text-[#00D9FF]">
                      {project.field.title}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm ${
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
                    <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-purple-500/20 text-purple-400">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="glass-strong rounded-xl p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3 text-[#00D9FF]">About Project</h3>
                  <div className="text-sm md:text-base text-gray-300 leading-relaxed">
                    <AnimatePresence mode="wait">
                      {isDescriptionExpanded || !isDescriptionLong ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {description}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {description.slice(0, 200)}...
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isDescriptionLong && (
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="mt-3 text-[#00D9FF] hover:text-[#00D9FF]/80 transition-colors font-medium text-sm flex items-center gap-1"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Read More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Details (Desktop) */}
          <div className="hidden lg:flex w-80 bg-black/30 backdrop-blur-md border-l border-white/10 flex-col">
            {/* Close Button */}
            <div className="p-6 border-b border-white/10">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Close
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#00D9FF] uppercase tracking-wider">
                  Details
                </h3>
                
                <div className="space-y-3">
                  {project.role && (
                    <div className="glass rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Role</div>
                      <div className="font-medium text-white text-sm">{project.role}</div>
                    </div>
                  )}
                  
                  <div className="glass rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="font-medium text-white text-sm">
                      {formatDate(project.start_date)} - {project.is_current ? 'Present' : formatDate(project.end_date)}
                    </div>
                  </div>
                  
                  {project.field && (
                    <div className="glass rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="font-medium text-white text-sm">{project.field.title}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#00D9FF] uppercase tracking-wider">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="glass px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/10 transition-colors"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.project_url || project.github_url) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#00D9FF] uppercase tracking-wider">
                    Links
                  </h3>
                  
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 bg-[#00D9FF] text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00D9FF]/50 transition-all group text-sm"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 glass-strong rounded-lg font-semibold hover:bg-white/10 transition-all group text-sm"
                    >
                      <span>GitHub</span>
                      <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Details Section */}
          <div className="lg:hidden glass-strong backdrop-blur-md border-t border-white/10 p-4 space-y-4">
            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-3">
              {project.role && (
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Role</div>
                  <div className="font-medium text-white text-sm">{project.role}</div>
                </div>
              )}
              
              {project.field && (
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Category</div>
                  <div className="font-medium text-white text-sm">{project.field.title}</div>
                </div>
              )}
            </div>

            {/* Tech Stack */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#00D9FF] mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id}
                      className="glass px-2.5 py-1.5 rounded-lg text-xs font-medium"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(project.project_url || project.github_url) && (
              <div className="flex gap-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00D9FF] text-black rounded-lg font-semibold text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Site
                  </a>
                )}
                
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 glass-strong rounded-lg font-semibold text-sm"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isFullscreen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4"
            onClick={closeFullscreen}
            onKeyDown={handleKeyDown}
          >
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 w-12 h-12 rounded-full glass-strong backdrop-blur-md hover:bg-red-500/20 flex items-center justify-center z-10 transition-all group"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Main Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} custom={imageDirection}>
                <motion.div
                  key={`fullscreen-${currentImageIndex}`}
                  custom={imageDirection}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="relative w-full h-full max-w-6xl max-h-[90vh]"
                >
                  <Image
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt_text || project.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-strong backdrop-blur-md hover:bg-[#00D9FF]/30 flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-strong backdrop-blur-md hover:bg-[#00D9FF]/30 flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong backdrop-blur-md px-4 py-2 rounded-full">
                <p className="text-sm font-medium">{currentImageIndex + 1} / {images.length}</p>
                {images[currentImageIndex].alt_text && (
                  <p className="text-xs text-gray-400 mt-1">{images[currentImageIndex].alt_text}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 217, 255, 0.4);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 217, 255, 0.7);
        }

        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 4px;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 217, 255, 0.4) rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}