'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import ImagePicker from './ImagePicker';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';

const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  role: z.string().optional(),
  field_id: z.string().uuid(),
  status: z.enum(['ONGOING', 'COMPLETED', 'PAUSED']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),

  // FIX
  is_current: z.boolean(),
  is_featured: z.boolean(),

  project_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1),
  images: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;


interface Field {
  id: string;
  title: string;
  slug: string;
}

interface Technology {
  id: string;
  name: string;
  category: { name: string } | null;
}

interface ProjectFormProps {
  fields: Field[];
  technologies: Technology[];
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

export default function ProjectForm({
  fields,
  technologies,
  initialData,
  projectId,
}: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    (initialData?.images as string[]) || []  // ✅ Type assertion
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      status: 'ONGOING',
      is_current: false,
      is_featured: false,
      technologies: [],
    },
  });

  const selectedTechs = watch('technologies') || [];
  const title = watch('title');

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!projectId) {
      // Only auto-generate for new projects
      setValue('slug', generateSlug(newTitle));
    }
  };

  const toggleTechnology = (techId: string) => {
    const current = selectedTechs;
    if (current.includes(techId)) {
      setValue(
        'technologies',
        current.filter((id) => id !== techId)
      );
    } else {
      setValue('technologies', [...current, techId]);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: projectId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: projectId,
          images: selectedImageIds, // ✅ Tambahkan ini
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save project');
      }

      router.push('/admin/projects');
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
        {/* Title & Slug */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              {...register('title')}
              onChange={(e) => {
                register('title').onChange(e);
                handleTitleChange(e);
              }}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              placeholder="Project Title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slug * <span className="text-gray-500 text-xs">(URL-friendly)</span>
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              placeholder="project-slug"
            />
            {errors.slug && (
              <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent resize-none"
            placeholder="Brief project description..."
          />
        </div>

        {/* Role & Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Role</label>
            <input
              type="text"
              {...register('role')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              placeholder="e.g., Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              {...register('field_id')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            >
              <option value="">Select category</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id} className="bg-black">
                  {field.title}
                </option>
              ))}
            </select>
            {errors.field_id && (
              <p className="text-red-400 text-sm mt-1">
                {errors.field_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Status & Dates */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            >
              <option value="ONGOING" className="bg-black">
                Ongoing
              </option>
              <option value="COMPLETED" className="bg-black">
                Completed
              </option>
              <option value="PAUSED" className="bg-black">
                Paused
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              {...register('start_date')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              {...register('end_date')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Project URL
            </label>
            <input
              type="url"
              {...register('project_url')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              placeholder="https://example.com"
            />
            {errors.project_url && (
              <p className="text-red-400 text-sm mt-1">
                {errors.project_url.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              {...register('github_url')}
              className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              placeholder="https://github.com/..."
            />
            {errors.github_url && (
              <p className="text-red-400 text-sm mt-1">
                {errors.github_url.message}
              </p>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_current')}
              className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary"
            />
            <span className="text-sm">Currently working on this</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_featured')}
              className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary"
            />
            <span className="text-sm">Featured project</span>
          </label>
        </div>

        {/* Images */}
        <ImagePicker
          selectedImages={selectedImageIds}
          onChange={setSelectedImageIds}
          projectId={projectId}
        />  

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Technologies * <span className="text-gray-500 text-xs">(Select at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => {
              const isSelected = selectedTechs.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTechnology(tech.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    isSelected
                      ? 'bg-primary text-black font-semibold'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  {tech.name}
                  {isSelected && <X className="inline w-3 h-3 ml-1" />}
                </button>
              );
            })}
          </div>
          {errors.technologies && (
            <p className="text-red-400 text-sm mt-2">
              {errors.technologies.message}
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
            `${projectId ? 'Update' : 'Create'} Project`
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