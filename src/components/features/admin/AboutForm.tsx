'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateAbout } from '@/lib/actions/settings.actions';
import { aboutSchema, type About } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, X } from 'lucide-react';

interface AboutFormProps {
  initialData?: About;
}

export default function AboutForm({ initialData }: AboutFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<About>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initialData || {
      bio: '',
      skills: [],
    },
  });

  // ✅ FIX: Add type assertion untuk useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills' as never,
  });

  const onSubmit = async (data: About) => {
    setLoading(true);

    const result = await updateAbout(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update about content');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-2">About Page Content</h2>
      <p className="text-sm text-gray-400 mb-6">
        Manage the content displayed on your About page
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Biography *</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Write your bio here... You can use HTML tags like <p>, <strong>, <em>, etc."
            rows={10}
            className="glass font-mono text-sm"
          />
          <p className="text-xs text-gray-400">
            HTML supported: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;
          </p>
          {errors.bio && (
            <p className="text-sm text-red-400">{errors.bio.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Skills *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append('')}
              className="glass hover:glass-strong"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No skills added yet. Click &quot;Add Skill&quot; to start.
            </p>
          )}

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`skills.${index}` as const)}
                  placeholder="e.g., Next.js, React, TypeScript"
                  className="glass flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="hover:bg-red-500/20 flex-shrink-0"
                >
                  <X className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>

          {errors.skills && (
            <p className="text-sm text-red-400">
              {errors.skills.message || 'At least 1 skill is required'}
            </p>
          )}
        </div>

        {/* Preview */}
        {fields.length > 0 && (
          <div className="glass rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Skills Preview:</p>
            <div className="flex flex-wrap gap-2">
              {fields.map((field, index) => (
                <span
                  key={field.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                >
                  {control._formValues.skills?.[index] || 'Skill name'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black hover:bg-primary/90 neon-glow"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save About Content'
          )}
        </Button>
      </form>
    </div>
  );
}