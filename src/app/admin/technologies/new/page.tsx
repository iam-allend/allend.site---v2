// src/app/admin/technologies/new/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import TechnologyForm from '@/components/features/admin/TechnologyForm';

export const metadata: Metadata = {
  title: 'Add Technology | Admin',
};

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

export default async function NewTechnologyPage() {
  const categories = await getCategories();

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
        
        <h1 className="text-3xl font-bold mb-2">Add New Technology</h1>
        <p className="text-gray-400">
          Add a new technology to your tech stack
        </p>
      </div>

      {/* Form */}
      <TechnologyForm categories={categories} />
    </div>
  );
}