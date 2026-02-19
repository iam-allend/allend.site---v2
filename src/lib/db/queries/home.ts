// src/lib/db/queries/home.ts
'use server';

import { supabase } from '@/lib/db/supabase';

/**
 * Get user profile for hero section
 */
export async function getUserProfile() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    // Return default data if error
    return {
      full_name: 'Developer',
      nickname: 'Dev',
      role: 'ADMIN',
      avatar_url: null,
      email: '',
      phone: null,
      country: null,
      address: null,
      birthday: null,
    };
  }

  return data;
}

/**
 * Get general settings (social links, availability, etc)
 */
export async function getGeneralSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', [
      'site_title',
      'site_description',
      'tagline',
      'availability_status',
      'availability_message',
      'social_links',
      'cv_url',
    ]);

  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  // Convert array to object
  const settings: Record<string, any> = {};
  data?.forEach(item => {
    settings[item.key] = item.value;
  });

  return settings;
}

/**
 * Get featured projects for home page (limit 5-6)
 */
export async function getFeaturedProjects(limit = 6) {
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
    return [];
  }

  // Transform data
  const projects = (data || []).map((project: any) => {
    const technologies = project.project_technologies?.map((pt: any) => ({
      id: pt.technologies?.id,
      name: pt.technologies?.name,
    })).filter((t: any) => t.id) || [];

    const images = (project.images || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 1); // Only first image for featured

    return {
      ...project,
      images,
      technologies,
    };
  });

  return projects;
}

/**
 * Get stats for hero section
 */
export async function getPortfolioStats() {
  // Get total projects count
  const { count: totalProjects, error: projectsError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null);

  // Get completed projects count
  const { count: completedProjects, error: completedError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'COMPLETED')
    .is('deleted_at', null);

  // Get fields count (as categories/clients proxy)
  const { count: fieldsCount, error: fieldsError } = await supabase
    .from('fields')
    .select('*', { count: 'exact', head: true });

  if (projectsError || completedError || fieldsError) {
    console.error('Error fetching stats:', { projectsError, completedError, fieldsError });
  }

  return {
    totalProjects: totalProjects || 0,
    completedProjects: completedProjects || 0,
    categories: fieldsCount || 0,
  };
}

/**
 * Get current tech stack
 */
export async function getCurrentTechStack() {
  // Get technologies from most recent projects
  const { data: recentProjects, error } = await supabase
    .from('projects')
    .select(`
      project_technologies(
        technologies(
          id,
          name
        )
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching tech stack:', error);
    return [];
  }

  // Extract unique technologies
  const techSet = new Set<string>();
  const techMap = new Map<string, { id: string; name: string }>();

  recentProjects?.forEach((project: any) => {
    project.project_technologies?.forEach((pt: any) => {
      if (pt.technologies?.name && !techSet.has(pt.technologies.name)) {
        techSet.add(pt.technologies.name);
        techMap.set(pt.technologies.name, {
          id: pt.technologies.id,
          name: pt.technologies.name,
        });
      }
    });
  });

  // Convert to array and limit to 8
  return Array.from(techMap.values()).slice(0, 8);
}

/**
 * Get years of experience
 * Calculate from earliest project or user's join date
 */
export async function getYearsOfExperience() {
  const { data: earliestProject, error } = await supabase
    .from('projects')
    .select('start_date')
    .is('deleted_at', null)
    .order('start_date', { ascending: true })
    .limit(1)
    .single();

  if (error || !earliestProject?.start_date) {
    // Default to 4 years if no data
    return 4;
  }

  const startDate = new Date(earliestProject.start_date);
  const now = new Date();
  const years = now.getFullYear() - startDate.getFullYear();
  
  return Math.max(years, 1); // At least 1 year
}

/**
 * Get all home page data in one call (for optimization)
 */
export async function getHomePageData() {
  const [
    profile,
    settings,
    featuredProjects,
    stats,
    techStack,
    yearsExp,
  ] = await Promise.all([
    getUserProfile(),
    getGeneralSettings(),
    getFeaturedProjects(6),
    getPortfolioStats(),
    getCurrentTechStack(),
    getYearsOfExperience(),
  ]);

  return {
    profile,
    settings,
    featuredProjects,
    stats: {
      ...stats,
      yearsExperience: yearsExp,
    },
    techStack,
  };
}