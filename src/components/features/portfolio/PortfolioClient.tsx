// src/components/features/portfolio/PortfolioClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { Project, Field } from '@/types/project';
import ProjectFilter from './ProjectFilter';
import ProjectGrid from './ProjectGrid';
import ProjectDetail from './ProjectDetail';

interface PortfolioClientProps {
  projects: Project[];
  fields: Field[];
  projectCounts: Record<string, number>;
}

export default function PortfolioClient({
  projects,
  fields,
  projectCounts,
}: PortfolioClientProps) {
  const [activeField, setActiveField] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects based on selected field
  const filteredProjects = useMemo(() => {
    if (activeField === 'all') {
      return projects;
    }
    return projects.filter((p) => p.field_id === activeField);
  }, [projects, activeField]);

  // Handle project card click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Handle field filter change
  const handleFieldChange = (fieldId: string) => {
    setActiveField(fieldId);
  };

  return (
    <>
      {/* Filter Bar */}
      <ProjectFilter
        fields={fields}
        activeField={activeField}
        onFieldChange={handleFieldChange}
        projectCounts={projectCounts}
      />

      {/* Projects Grid */}
      <ProjectGrid projects={filteredProjects} onProjectClick={handleProjectClick} />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}