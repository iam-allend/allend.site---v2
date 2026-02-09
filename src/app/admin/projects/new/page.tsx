import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import ProjectForm from '@/components/features/admin/ProjectForm';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch fields (categories)
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

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-gray-400 mt-1">Add a new project to your portfolio</p>
      </div>

      <ProjectForm
        fields={fields || []}
        technologies={technologies}
      />
    </div>
  );
}