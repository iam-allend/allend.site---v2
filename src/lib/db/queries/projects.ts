'use server';

import { supabase } from '@/lib/db/supabase';
import { Project } from '@/types/project';

/**
 * Get all active projects with relations (for portfolio page)
 * FIXED: Correct Supabase nested query syntax
 */
export async function getPublicProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      field:fields(*),
      images:project_images(*),
      project_technologies(
        technologies(
          id,
          name,
          tech_categories(
            id,
            name
          )
        )
      )
    `)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }

  // Transform and sort the data
  const projects: Project[] = (data || []).map((project: any) => {
    // Extract technologies from the nested structure
    const technologies = project.project_technologies?.map((pt: any) => ({
      id: pt.technologies?.id,
      name: pt.technologies?.name,
      category_id: pt.technologies?.category_id,
      category: pt.technologies?.tech_categories,
    })).filter((t: any) => t.id) || [];

    // Sort images by sort_order
    const images = (project.images || []).sort((a: any, b: any) => 
      (a.sort_order || 0) - (b.sort_order || 0)
    );

    return {
      ...project,
      images,
      technologies,
    };
  });

  console.log('✅ Projects loaded:', projects.length);
  if (projects.length > 0) {
    console.log('✅ Sample project:', {
      title: projects[0].title,
      technologies: projects[0].technologies,
    });
  }

  return projects;
}

/**
 * Get featured projects only (for homepage)
 */
export async function getFeaturedProjects(limit = 3) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      field:fields(*),
      images:project_images(*),
      project_technologies(
        technologies(
          id,
          name
        )
      )
    `)
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    throw new Error('Failed to fetch featured projects');
  }

  const projects: Project[] = (data || []).map((project: any) => {
    const technologies = project.project_technologies?.map((pt: any) => ({
      id: pt.technologies?.id,
      name: pt.technologies?.name,
    })).filter((t: any) => t.id) || [];

    // Get only first image
    const images = (project.images || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 1);

    return {
      ...project,
      images,
      technologies,
    };
  });

  return projects;
}

/**
 * Get project by slug (for detail page)
 */
export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      field:fields(*),
      images:project_images(*),
      project_technologies(
        technologies(
          id,
          name,
          tech_categories(
            id,
            name
          )
        )
      )
    `)
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  if (!data) return null;

  // Transform the data
  const technologies = data.project_technologies?.map((pt: any) => ({
    id: pt.technologies?.id,
    name: pt.technologies?.name,
    category_id: pt.technologies?.category_id,
    category: pt.technologies?.tech_categories,
  })).filter((t: any) => t.id) || [];

  const images = (data.images || []).sort((a: any, b: any) => 
    (a.sort_order || 0) - (b.sort_order || 0)
  );

  const project: Project = {
    ...data,
    images,
    technologies,
  };

  console.log('✅ Project by slug loaded:', {
    title: project.title,
    technologies: project.technologies,
  });

  return project;
}

/**
 * Get all fields/categories (for filtering)
 */
export async function getFields() {
  const { data, error } = await supabase
    .from('fields')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching fields:', error);
    throw new Error('Failed to fetch fields');
  }

  return data || [];
}

/**
 * Get projects count by field (for stats)
 */
export async function getProjectCountByField() {
  const { data, error } = await supabase
    .from('projects')
    .select('field_id, field:fields(title)')
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching project counts:', error);
    return {};
  }

  // Count projects per field
  const counts = (data || []).reduce((acc: any, project: any) => {
    const fieldTitle = project.field?.title || 'Uncategorized';
    acc[fieldTitle] = (acc[fieldTitle] || 0) + 1;
    return acc;
  }, {});

  return counts;
}