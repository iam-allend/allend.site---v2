// src/app/admin/technologies/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search, Tag } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import { Technology } from '@/types/project';

export const metadata: Metadata = {
  title: 'Technologies',
  description: 'Manage technologies and categories',
};

// Revalidate every 30 minutes
export const revalidate = 1800;

async function getTechnologies() {
  const { data, error } = await supabase
    .from('technologies')
    .select(`
      *,
      category:tech_categories(
        id,
        name
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }

  return data || [];
}

async function getCategories() {
  const { data, error } = await supabase
    .from('tech_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

async function getTechStats() {
  // Count projects per technology
  const { data, error } = await supabase
    .from('project_technologies')
    .select('technology_id');

  if (error) return {};

  const counts: Record<string, number> = {};
  data?.forEach((pt) => {
    counts[pt.technology_id] = (counts[pt.technology_id] || 0) + 1;
  });

  return counts;
}

export default async function TechnologiesPage() {
  const [technologies, categories, projectCounts] = await Promise.all([
    getTechnologies(),
    getCategories(),
    getTechStats(),
  ]);

  // Group by category
  const groupedTechs = technologies.reduce<Record<string, Technology[]>>((acc, tech) => {
    const categoryName = tech.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(tech);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Technologies</h1>
          <p className="text-gray-400">
            Manage your tech stack ({technologies.length} technologies, {categories.length} categories)
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/admin/technologies/categories"
            className="px-4 py-3 glass rounded-lg font-semibold hover:glass-strong transition-all flex items-center gap-2"
          >
            <Tag className="w-5 h-5" />
            Manage Categories
          </Link>
          
          <Link
            href="/admin/technologies/new"
            className="px-6 py-3 bg-primary text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Technology
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-strong rounded-xl p-6">
          <div className="text-3xl font-bold text-primary mb-2">
            {technologies.length}
          </div>
          <div className="text-sm text-gray-400">Total Technologies</div>
        </div>
        
        <div className="glass-strong rounded-xl p-6">
          <div className="text-3xl font-bold text-primary mb-2">
            {categories.length}
          </div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        
        <div className="glass-strong rounded-xl p-6">
          <div className="text-3xl font-bold text-primary mb-2">
            {Object.keys(projectCounts).length}
          </div>
          <div className="text-sm text-gray-400">Used in Projects</div>
        </div>
      </div>

      {/* Technologies by Category */}
      <div className="space-y-6">
        {Object.entries(groupedTechs).map(([categoryName, techs]) => (
          <div key={categoryName} className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{categoryName}</h2>
              <span className="text-sm text-gray-500">({techs.length})</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {techs.map((tech) => {
                const projectCount = projectCounts[tech.id] || 0;
                
                return (
                  <Link
                    key={tech.id}
                    href={`/admin/technologies/${tech.id}/edit`}
                    className="glass rounded-lg p-4 hover:glass-strong transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {tech.name}
                        </div>
                        {projectCount > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Used in {projectCount} project{projectCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {technologies.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Technologies Yet</h3>
          <p className="text-gray-400 mb-6">
            Start building your tech stack by adding your first technology
          </p>
          <Link
            href="/admin/technologies/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Technology
          </Link>
        </div>
      )}
    </div>
  );
}