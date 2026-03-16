// src/app/admin/technologies/[id]/edit/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import TechnologyForm from '@/components/features/admin/TechnologyForm';
import DeleteTechnologyButton from '@/components/features/admin/DeleteTechnologyButton';

export const metadata: Metadata = {
  title: 'Edit Technology | Admin',
};

async function getTechnology(id: string) {
  const { data, error } = await supabase
    .from('technologies')
    .select(`
      *,
      category:tech_categories(
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCategories() {
  const { data, error } = await supabase
    .from('tech_categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function EditTechnologyPage({
  params,
}: {
  params: { id: string };
}) {
  const [technology, categories] = await Promise.all([
    getTechnology(params.id),
    getCategories(),
  ]);

  if (!technology) {
    notFound();
  }

  const initialData = {
    name: technology.name,
    category_id: technology.category_id || '',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/technologies"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Technologies
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Technology</h1>
            <p className="text-gray-400">
              Update {technology.name} details
            </p>
          </div>

          <DeleteTechnologyButton technologyId={technology.id} />
        </div>
      </div>

      {/* Form */}
      <TechnologyForm
        categories={categories}
        initialData={initialData}
        technologyId={technology.id}
      />
    </div>
  );
}