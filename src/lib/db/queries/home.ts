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
 * Supports BOTH structures:
 * 1. 'general' key with JSON object
 * 2. Individual keys
 */
export async function getGeneralSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', [
      'general',  // ✅ ADDED: For general settings JSON
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

  // ✅ If 'general' key exists, merge its properties into settings
  if (settings.general) {
    const generalSettings = settings.general;
    
    // Merge general settings, but don't override existing individual keys
    Object.keys(generalSettings).forEach(key => {
      // Convert camelCase to snake_case for consistency
      // yearsExperience → years_experience
      // siteTitle → site_title
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      // Only set if not already defined by individual key
      if (!settings[snakeKey]) {
        settings[snakeKey] = generalSettings[key];
      }
    });
  }

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
 * ✅ FIXED: Get years of experience from database
 * Priority (tries in order):
 * 1. settings.general.yearsExperience (your admin form)
 * 2. settings.years_experience (individual key)
 * 3. experiences table (auto-calculate)
 * 4. Default to 0
 */
export async function getYearsOfExperience() {
  // Method 1: Try 'general' key first (your admin form uses this)
  const { data: generalData, error: generalError } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'general')
    .single();

  if (!generalError && generalData?.value) {
    const generalSettings = generalData.value as any;
    if (generalSettings.yearsExperience) {
      console.log('✅ Years Experience (from settings.general):', generalSettings.yearsExperience);
      return generalSettings.yearsExperience;
    }
  }

  // Method 2: Try individual 'years_experience' key
  const { data: yearsData, error: yearsError } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'years_experience')
    .single();

  if (!yearsError && yearsData?.value) {
    const years = parseInt(yearsData.value as string, 10);
    console.log('✅ Years Experience (from settings.years_experience):', years);
    return years;
  }

  // Method 3: Try to calculate from experiences table
  const { data: earliestExperience, error: expError } = await supabase
    .from('experiences')
    .select('start_date')
    .order('start_date', { ascending: true })
    .limit(1)
    .single();

  if (!expError && earliestExperience?.start_date) {
    const startDate = new Date(earliestExperience.start_date);
    const now = new Date();
    const years = now.getFullYear() - startDate.getFullYear();
    const monthDiff = now.getMonth() - startDate.getMonth();
    
    const calculatedYears = monthDiff < 0 ? years - 1 : years;
    console.log('✅ Years Experience (calculated from experiences):', calculatedYears);
    return Math.max(calculatedYears, 1);
  }

  // Method 4: Default
  console.warn('⚠️ No years experience found, defaulting to 0');
  return 0;
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