'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateSocialLinks } from '@/lib/actions/settings.actions';
import { socialLinksSchema, type SocialLinks } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Github, Linkedin, Instagram, Twitter } from 'lucide-react';

interface SocialLinksFormProps {
  initialData?: SocialLinks;
}

export default function SocialLinksForm({ initialData }: SocialLinksFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialLinks>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: initialData || {
      github: '',
      linkedin: '',
      instagram: '',
      twitter: '',
      behance: '',
      dribbble: '',
    },
  });

  const onSubmit = async (data: SocialLinks) => {
    setLoading(true);

    const result = await updateSocialLinks(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update social links');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-2">Social Links</h2>
      <p className="text-sm text-gray-400 mb-6">
        Add your social media profiles. Leave empty to hide.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* GitHub */}
        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </Label>
          <Input
            id="github"
            {...register('github')}
            placeholder="https://github.com/username"
            className="glass"
          />
          {errors.github && (
            <p className="text-sm text-red-400">{errors.github.message}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            {...register('linkedin')}
            placeholder="https://linkedin.com/in/username"
            className="glass"
          />
          {errors.linkedin && (
            <p className="text-sm text-red-400">{errors.linkedin.message}</p>
          )}
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </Label>
          <Input
            id="instagram"
            {...register('instagram')}
            placeholder="https://instagram.com/username"
            className="glass"
          />
          {errors.instagram && (
            <p className="text-sm text-red-400">{errors.instagram.message}</p>
          )}
        </div>

        {/* Twitter */}
        <div className="space-y-2">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter / X
          </Label>
          <Input
            id="twitter"
            {...register('twitter')}
            placeholder="https://twitter.com/username"
            className="glass"
          />
          {errors.twitter && (
            <p className="text-sm text-red-400">{errors.twitter.message}</p>
          )}
        </div>

        {/* Behance */}
        <div className="space-y-2">
          <Label htmlFor="behance">Behance</Label>
          <Input
            id="behance"
            {...register('behance')}
            placeholder="https://behance.net/username"
            className="glass"
          />
          {errors.behance && (
            <p className="text-sm text-red-400">{errors.behance.message}</p>
          )}
        </div>

        {/* Dribbble */}
        <div className="space-y-2">
          <Label htmlFor="dribbble">Dribbble</Label>
          <Input
            id="dribbble"
            {...register('dribbble')}
            placeholder="https://dribbble.com/username"
            className="glass"
          />
          {errors.dribbble && (
            <p className="text-sm text-red-400">{errors.dribbble.message}</p>
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
            'Save Social Links'
          )}
        </Button>
      </form>
    </div>
  );
}