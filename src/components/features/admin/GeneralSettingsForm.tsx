'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateGeneralSettings } from '@/lib/actions/settings.actions';
import { generalSettingsSchema, type GeneralSettings } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface GeneralSettingsFormProps {
  initialData?: GeneralSettings;
}

export default function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialData || {
      siteTitle: '',
      siteDescription: '',
      ownerName: '',
      tagline: '',
      primaryRole: '',
      yearsExperience: 0,
      location: '',
    },
  });

  const onSubmit = async (data: GeneralSettings) => {
    setLoading(true);

    const result = await updateGeneralSettings(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update settings');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">General Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Site Title */}
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Site Title *</Label>
          <Input
            id="siteTitle"
            {...register('siteTitle')}
            placeholder="Allend - Full Stack Developer"
            className="glass"
          />
          {errors.siteTitle && (
            <p className="text-sm text-red-400">{errors.siteTitle.message}</p>
          )}
        </div>

        {/* Site Description */}
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description *</Label>
          <Textarea
            id="siteDescription"
            {...register('siteDescription')}
            placeholder="Portfolio website showcasing..."
            rows={3}
            className="glass"
          />
          {errors.siteDescription && (
            <p className="text-sm text-red-400">{errors.siteDescription.message}</p>
          )}
        </div>

        {/* Owner Name */}
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            {...register('ownerName')}
            placeholder="Anur Mustakim (Allend)"
            className="glass"
          />
          {errors.ownerName && (
            <p className="text-sm text-red-400">{errors.ownerName.message}</p>
          )}
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            {...register('tagline')}
            placeholder="Digital Craftsman"
            className="glass"
          />
          {errors.tagline && (
            <p className="text-sm text-red-400">{errors.tagline.message}</p>
          )}
        </div>

        {/* Primary Role */}
        <div className="space-y-2">
          <Label htmlFor="primaryRole">Primary Role</Label>
          <Input
            id="primaryRole"
            {...register('primaryRole')}
            placeholder="Full Stack Developer & Graphic Designer"
            className="glass"
          />
          {errors.primaryRole && (
            <p className="text-sm text-red-400">{errors.primaryRole.message}</p>
          )}
        </div>

        {/* Years Experience */}
        <div className="space-y-2">
          <Label htmlFor="yearsExperience">Years of Experience *</Label>
          <Input
            id="yearsExperience"
            type="number"
            {...register('yearsExperience', { valueAsNumber: true })}
            placeholder="5"
            className="glass"
          />
          {errors.yearsExperience && (
            <p className="text-sm text-red-400">{errors.yearsExperience.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="Semarang, Indonesia"
            className="glass"
          />
          {errors.location && (
            <p className="text-sm text-red-400">{errors.location.message}</p>
          )}
        </div>

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
            'Save General Settings'
          )}
        </Button>
      </form>
    </div>
  );
}