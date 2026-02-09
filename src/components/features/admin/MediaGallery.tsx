'use client';

import { useState } from 'react';
import { Trash2, ExternalLink, Info, Copy, Check } from 'lucide-react';
import { deleteImage } from '@/lib/actions/image.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Image from 'next/image';

interface MediaImage {
  id: string;
  url: string;
  alt_text: string | null;
  project: {
    id: string;
    title: string;
    slug: string;
  } | null;
  created_at: string;
}

interface MediaGalleryProps {
  images: MediaImage[];
}

export default function MediaGallery({ images }: MediaGalleryProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');

  // Helper function to get public URL
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(url);
    
    return data.publicUrl;
  };

  const handleDelete = async (image: MediaImage) => {
    const confirmMessage = image.project 
      ? `Delete this image? It's used in: ${image.project.title}`
      : 'Delete this image?';
    
    if (!confirm(confirmMessage)) return;

    setDeleting(true);

    const result = await deleteImage(image.id, image.url);

    if (result.success) {
      toast.success(result.message);
      setSelectedImage(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setDeleting(false);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(getImageUrl(url));
      setCopiedUrl(url);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  // ✅ FIX: Properly deduplicate projects by ID using Map
  const projectsMap = new Map(
    images
      .filter(img => img.project)
      .map(img => [img.project!.id, img.project!])
  );
  const projects = Array.from(projectsMap.values());

  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = !searchTerm || 
      image.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.project?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = filterProject === 'all' || 
      filterProject === 'unassigned' && !image.project ||
      image.project?.id === filterProject;

    return matchesSearch && matchesProject;
  });

  if (images.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4 opacity-50">🖼️</div>
        <p className="text-gray-400">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-strong rounded-2xl p-6">
        {/* Header with Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Image Gallery</h2>
            <p className="text-sm text-gray-400">
              {filteredImages.length} of {images.length} images
            </p>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="glass px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Projects</option>
              <option value="unassigned">Unassigned</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No images match your filters
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="glass rounded-lg overflow-hidden group hover-lift cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square bg-white/5 relative">
                  <Image
                    src={getImageUrl(image.url)}
                    alt={image.alt_text || 'Project image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.url);
                      }}
                      className="p-2 glass rounded-lg hover:glass-strong"
                      title="Copy URL"
                    >
                      {copiedUrl === image.url ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(image);
                      }}
                      className="p-2 glass rounded-lg hover:glass-strong"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      className="p-2 glass rounded-lg hover:bg-red-500/20"
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                {image.project && (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 truncate">
                      {image.project.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="glass-strong rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Image Details</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 glass rounded-lg hover:glass-strong"
                >
                  ✕
                </button>
              </div>

              <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(selectedImage.url)}
                  alt={selectedImage.alt_text || 'Project image'}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-3">
                <div className="glass rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-1">URL</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono break-all flex-1">
                      {getImageUrl(selectedImage.url)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(selectedImage.url)}
                      className="p-2 glass rounded-lg hover:glass-strong flex-shrink-0"
                    >
                      {copiedUrl === selectedImage.url ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedImage.alt_text && (
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Alt Text</p>
                    <p className="text-sm">{selectedImage.alt_text}</p>
                  </div>
                )}

                {selectedImage.project ? (
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Used in Project</p>
                    <p className="text-sm font-medium">
                      {selectedImage.project.title}
                    </p>
                  </div>
                ) : (
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-yellow-400">⚠️ Unassigned Image</p>
                  </div>
                )}

                <div className="glass rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-1">Uploaded</p>
                  <p className="text-sm">
                    {new Date(selectedImage.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={getImageUrl(selectedImage.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 glass rounded-lg font-semibold hover:glass-strong transition-all text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Original
                  </a>
                  <button
                    onClick={() => handleDelete(selectedImage)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}