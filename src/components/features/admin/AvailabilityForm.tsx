'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateAvailability } from '@/lib/actions/settings.actions';
import { availabilitySchema, type Availability } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface AvailabilityFormProps {
  initialData?: Availability;
}

export default function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Availability>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: initialData || {
      isAvailable: true,
      type: 'both',
      customMessage: '',
      showOnHomepage: true,
    },
  });

  const isAvailable = watch('isAvailable');
  const showOnHomepage = watch('showOnHomepage');
  const type = watch('type');

  const onSubmit = async (data: Availability) => {
    setLoading(true);

    const result = await updateAvailability(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update availability');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-2">Availability Status</h2>
      <p className="text-sm text-gray-400 mb-6">
        Let visitors know if you're available for new opportunities
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Is Available */}
        <div className="space-y-2">
          <Label htmlFor="isAvailable">Available for Work</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('isAvailable')}
                value="true"
                checked={isAvailable === true}
                onChange={() => setValue('isAvailable', true)}
                className="w-4 h-4"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('isAvailable')}
                value="false"
                checked={isAvailable === false}
                onChange={() => setValue('isAvailable', false)}
                className="w-4 h-4"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Availability Type */}
        {isAvailable && (
          <div className="space-y-2">
            <Label htmlFor="type">Availability Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setValue('type', value as any)}
            >
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time Only</SelectItem>
                <SelectItem value="freelance">Freelance Only</SelectItem>
                <SelectItem value="both">Both (Full-time & Freelance)</SelectItem>
                <SelectItem value="not-available">Not Available</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-400">{errors.type.message}</p>
            )}
          </div>
        )}

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="customMessage">Custom Status Message</Label>
          <Input
            id="customMessage"
            {...register('customMessage')}
            placeholder="Currently accepting new projects for Q2 2024"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Optional custom message to display alongside your availability
          </p>
          {errors.customMessage && (
            <p className="text-sm text-red-400">{errors.customMessage.message}</p>
          )}
        </div>

        {/* Show on Homepage */}
        <div className="space-y-2">
          <Label htmlFor="showOnHomepage">Show on Homepage</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('showOnHomepage')}
                value="true"
                checked={showOnHomepage === true}
                onChange={() => setValue('showOnHomepage', true)}
                className="w-4 h-4"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('showOnHomepage')}
                value="false"
                checked={showOnHomepage === false}
                onChange={() => setValue('showOnHomepage', false)}
                className="w-4 h-4"
              />
              <span>No</span>
            </label>
          </div>
          <p className="text-xs text-gray-400">
            Display pulsing availability indicator on homepage hero section
          </p>
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
            'Save Availability Status'
          )}
        </Button>
      </form>
    </div>
  );
}