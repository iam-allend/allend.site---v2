// src/app/portfolio/page.tsx
import { Metadata } from 'next';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PortfolioClient from '@/components/features/portfolio/PortfolioClient';
import { getPublicProjects, getFields, getProjectCountByField } from '@/lib/db/queries/projects';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Portfolio | Your Name',
  description: 'Explore my portfolio of web development, mobile apps, and design projects.',
  openGraph: {
    title: 'Portfolio | Your Name',
    description: 'Explore my portfolio of web development, mobile apps, and design projects.',
  },
};

// Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function PortfolioPage() {
  // Fetch data server-side in parallel
  const [projects, fields, projectCounts] = await Promise.all([
    getPublicProjects(),
    getFields(),
    getProjectCountByField(),
  ]);

  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <Header />

      <main className="min-h-screen pt-20 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-20">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              My <span className="neon-text">Portfolio</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A collection of projects I've worked on, showcasing my skills in web development,
              mobile apps, and design.
            </p>
            
            {/* Stats */}
            {/* <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D9FF]">{projects.length}</div>
                <div className="text-sm text-gray-500">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D9FF]">
                  {projects.filter((p) => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D9FF]">
                  {fields.length}
                </div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
            </div> */}
          </div>

          {/* Client Component with Filter & Grid */}
          <PortfolioClient
            projects={projects}
            fields={fields}
            projectCounts={projectCounts}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}