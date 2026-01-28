'use client';

import { useState } from 'react';
import Image from 'next/image';

import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/home/HeroSection';


// Types
interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: 'Completed' | 'Ongoing' | 'Paused';
  thumbnail: string;
  images: string[];
  technologies: string[];
  role: string;
  duration: string;
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Categories
  const categories = ['All', 'Web Development', 'Mobile Apps', 'Graphic Design'];

  // Projects Data
  const projects: Project[] = [
    {
      id: 1,
      slug: 'ritecs-website',
      title: 'Ritecs Website',
      description: 'Full-stack research community platform with CMS',
      category: 'Web Development',
      status: 'Completed',
      thumbnail: '/gradient-blue.jpg',
      images: ['/project1-1.jpg', '/project1-2.jpg', '/project1-3.jpg'],
      technologies: ['Laravel', 'MySQL', 'Bootstrap', 'jQuery'],
      role: 'Full Stack Developer',
      duration: '3 months',
      liveUrl: 'https://ritecs.example.com',
      githubUrl: 'https://github.com/username/ritecs',
      features: [
        'User authentication & authorization',
        'Admin dashboard with analytics',
        'Content management system',
        'Responsive design',
        'SEO optimized',
      ],
    },
    {
      id: 2,
      slug: 'lapak-siswa',
      title: 'Lapak Siswa',
      description: 'E-commerce platform for students',
      category: 'Web Development',
      status: 'Completed',
      thumbnail: '/gradient-purple.jpg',
      images: ['/project2-1.jpg', '/project2-2.jpg'],
      technologies: ['CodeIgniter 4', 'MySQL', 'Bootstrap'],
      role: 'Full Stack Developer',
      duration: '2 months',
      features: [
        'Product catalog & search',
        'Shopping cart functionality',
        'Payment integration',
        'Order management',
      ],
    },
    {
      id: 3,
      slug: 'mobile-app-flutter',
      title: 'Mobile E-Learning App',
      description: 'Cross-platform learning application',
      category: 'Mobile Apps',
      status: 'Ongoing',
      thumbnail: '/gradient-green.jpg',
      images: ['/project3-1.jpg', '/project3-2.jpg'],
      technologies: ['Flutter', 'Firebase', 'Provider'],
      role: 'Mobile Developer',
      duration: '4 months',
      features: [
        'Video streaming',
        'Quiz system',
        'Progress tracking',
        'Push notifications',
      ],
    },
    {
      id: 4,
      slug: 'brand-design-project',
      title: 'Brand Identity Design',
      description: 'Complete branding package for tech startup',
      category: 'Graphic Design',
      status: 'Completed',
      thumbnail: '/gradient-orange.jpg',
      images: ['/design1.jpg', '/design2.jpg'],
      technologies: ['Figma', 'Adobe Illustrator', 'Photoshop'],
      role: 'Graphic Designer',
      duration: '1 month',
      features: [
        'Logo design',
        'Brand guidelines',
        'Social media templates',
        'Marketing materials',
      ],
    },
  ];

  // Filter projects
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // Modal handlers
  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  return (

<>
<CustomCursor />
<AnimatedBackground />
<Header />

<main>
    <div className="min-h-screen pt-20 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            My <span className="neon-text">Portfolio</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of projects I've worked on, showcasing my skills in web development, mobile apps, and design.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 z-40 glass rounded-2xl p-2 mb-12 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#00D9FF] text-black'
                  : 'text-gray-400 hover:text-white hover:glass-strong'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => openModal(project)}
              className="glass-strong rounded-2xl overflow-hidden hover-lift cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-64 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">
                    {project.category === 'Web Development'
                      ? '🌐'
                      : project.category === 'Mobile Apps'
                      ? '📱'
                      : '🎨'}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs glass text-[#00D9FF]">
                    {project.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : project.status === 'Ongoing'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00D9FF] transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="glass px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="glass px-2 py-1 rounded text-xs">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-400">No projects found in this category</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="glass-strong rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass-strong hover:bg-red-500/20 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Gallery */}
              <div>
                <div className="relative h-96 bg-gradient-to-br from-[#00D9FF]/20 to-blue-500/20 rounded-2xl mb-4 flex items-center justify-center">
                  <div className="text-8xl">
                    {selectedProject.category === 'Web Development'
                      ? '🌐'
                      : selectedProject.category === 'Mobile Apps'
                      ? '📱'
                      : '🎨'}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong hover:bg-[#00D9FF]/20 flex items-center justify-center"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong hover:bg-[#00D9FF]/20 flex items-center justify-center"
                  >
                    →
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2">
                  {selectedProject.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-1 h-20 rounded-lg glass-strong ${
                        idx === currentImageIndex
                          ? 'border-2 border-[#00D9FF]'
                          : ''
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📸
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Role</div>
                    <div className="font-medium">{selectedProject.role}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className="font-medium">{selectedProject.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                    <div className="font-medium">{selectedProject.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Category</div>
                    <div className="font-medium">{selectedProject.category}</div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-[#00D9FF] text-black rounded-lg font-semibold text-center hover:scale-105 transition-all"
                    >
                      Live Site →
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 glass-strong rounded-lg font-semibold text-center hover:scale-105 transition-all"
                    >
                      GitHub
                    </a>
                  )}
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#00D9FF]">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="glass-strong px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#00D9FF]">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#00D9FF] mt-1">✓</span>
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

</main>

<Footer />
</>
  );
}