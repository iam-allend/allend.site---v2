'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateSEO } from '@/lib/actions/settings.actions';
import { seoSchema, type SEO } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search } from 'lucide-react';

interface SEOFormProps {
  initialData?: SEO;
}

export default function SEOForm({ initialData }: SEOFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SEO>({
    resolver: zodResolver(seoSchema),
    defaultValues: initialData || {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImageUrl: '',
      faviconUrl: '',
      googleAnalyticsId: '',
    },
  });

  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');

  const onSubmit = async (data: SEO) => {
    setLoading(true);

    const result = await updateSEO(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update SEO settings');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Search className="w-5 h-5" />
        SEO & Metadata
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Optimize your website for search engines and social media
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="metaTitle">
            Meta Title * ({metaTitle?.length || 0}/60)
          </Label>
          <Input
            id="metaTitle"
            {...register('metaTitle')}
            placeholder="Allend - Full Stack Developer Portfolio"
            maxLength={60}
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Page title for search engines (50-60 characters optimal)
          </p>
          {errors.metaTitle && (
            <p className="text-sm text-red-400">{errors.metaTitle.message}</p>
          )}
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription">
            Meta Description * ({metaDescription?.length || 0}/160)
          </Label>
          <Textarea
            id="metaDescription"
            {...register('metaDescription')}
            placeholder="Explore my portfolio of web development projects..."
            maxLength={160}
            rows={3}
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Brief description for search results (150-160 characters optimal)
          </p>
          {errors.metaDescription && (
            <p className="text-sm text-red-400">{errors.metaDescription.message}</p>
          )}
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            {...register('keywords')}
            placeholder="full stack developer, react, next.js, web development"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Comma-separated keywords (less important for modern SEO)
          </p>
          {errors.keywords && (
            <p className="text-sm text-red-400">{errors.keywords.message}</p>
          )}
        </div>

        {/* OG Image URL */}
        <div className="space-y-2">
          <Label htmlFor="ogImageUrl">Open Graph Image URL</Label>
          <Input
            id="ogImageUrl"
            type="url"
            {...register('ogImageUrl')}
            placeholder="https://yourdomain.com/og-image.jpg"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Image shown when sharing on social media (1200x630px recommended)
          </p>
          {errors.ogImageUrl && (
            <p className="text-sm text-red-400">{errors.ogImageUrl.message}</p>
          )}
        </div>

        {/* Favicon URL */}
        <div className="space-y-2">
          <Label htmlFor="faviconUrl">Favicon URL</Label>
          <Input
            id="faviconUrl"
            type="url"
            {...register('faviconUrl')}
            placeholder="https://yourdomain.com/favicon.ico"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Browser tab icon (.ico or .png, 32x32px)
          </p>
          {errors.faviconUrl && (
            <p className="text-sm text-red-400">{errors.faviconUrl.message}</p>
          )}
        </div>

        {/* Google Analytics */}
        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            {...register('googleAnalyticsId')}
            placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Optional: Track website visits with Google Analytics
          </p>
          {errors.googleAnalyticsId && (
            <p className="text-sm text-red-400">{errors.googleAnalyticsId.message}</p>
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
            'Save SEO Settings'
          )}
        </Button>
      </form>
    </div>
  );
}