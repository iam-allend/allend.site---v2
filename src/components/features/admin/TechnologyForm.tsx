// src/components/features/admin/TechnologyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const technologySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category_id: z.string().uuid('Please select a category').optional().or(z.literal('')),
});

type TechnologyFormData = z.infer<typeof technologySchema>;

interface Category {
  id: string;
  name: string;
}

interface TechnologyFormProps {
  categories: Category[];
  initialData?: Partial<TechnologyFormData>;
  technologyId?: string;
}

export default function TechnologyForm({
  categories,
  initialData,
  technologyId,
}: TechnologyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: TechnologyFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/technologies', {
        method: technologyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: technologyId,
          category_id: data.category_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save technology');
      }

      router.push('/admin/technologies');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="glass-strong rounded-2xl p-6 space-y-6">
        {/* Technology Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Technology Name *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            placeholder="e.g., React, TypeScript, Laravel"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-black">
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-400 text-sm mt-1">
              {errors.category_id.message}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-strong border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-8 py-4 bg-primary text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </span>
          ) : (
            `${technologyId ? 'Update' : 'Create'} Technology`
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 glass rounded-lg font-semibold hover:glass-strong transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}