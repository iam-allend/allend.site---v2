import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import ProjectForm from '@/components/features/admin/ProjectForm';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch project with relations
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_technologies(technology_id),
      project_images(id)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch fields
  const { data: fields } = await supabase
    .from('fields')
    .select('*')
    .order('sort_order');

  // Fetch technologies with category
  const { data: techData } = await supabase
    .from('technologies')
    .select('id, name, category:tech_categories(name)')
    .order('name');

  // Transform technologies data - ambil category pertama dari array
  const technologies = techData?.map(tech => ({
    id: tech.id,
    name: tech.name,
    category: Array.isArray(tech.category) && tech.category.length > 0
      ? tech.category[0]
      : { name: 'Uncategorized' }
  })) || [];

  // Format initial data for form
  const initialData = {
    title: project.title,
    slug: project.slug,
    description: project.description || '',
    role: project.role || '',
    field_id: project.field_id || '',
    status: project.status,
    start_date: project.start_date || '',
    end_date: project.end_date || '',
    is_current: project.is_current,
    is_featured: project.is_featured,
    project_url: project.project_url || '',
    github_url: project.github_url || '',
    technologies: project.project_technologies.map((pt: { technology_id: string }) => pt.technology_id),
    images: project.project_images.map((img: { id: string }) => img.id),
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-gray-400 mt-1">Update project information</p>
      </div>

      <ProjectForm
        fields={fields || []}
        technologies={technologies}
        initialData={initialData}
        projectId={project.id}
      />
    </div>
  );
}