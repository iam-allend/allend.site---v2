import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import MediaUploader from '@/components/features/admin/MediaUploader';
import MediaGallery from '@/components/features/admin/MediaGallery';

export default async function MediaLibraryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all project images
  const { data: images, error } = await supabase
    .from('project_images')
    .select(`
      *,
      project:projects(title, slug)
    `)
    .order('created_at', { ascending: false });

  // Get storage stats
  const { data: storageList } = await supabase.storage
    .from('project-images')
    .list();

  const totalImages = storageList?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-gray-400 mt-1">Manage images for your projects</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Images</p>
          <p className="text-2xl font-bold mt-1">{images?.length || 0}</p>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Storage Files</p>
          <p className="text-2xl font-bold mt-1">{totalImages}</p>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Used Space</p>
          <p className="text-2xl font-bold mt-1">~MB</p>
        </div>
      </div>

      {/* Upload Section */}
      <MediaUploader />

      {/* Gallery */}
      <MediaGallery images={images || []} />
    </div>
  );
}