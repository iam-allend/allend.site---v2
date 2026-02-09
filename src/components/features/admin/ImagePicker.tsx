'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Plus, Check } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';
import Image from 'next/image';

interface MediaImage {
  id: string;
  url: string;
  alt_text: string | null;
  project: { id: string; title: string } | null;
}

interface ImagePickerProps {
  selectedImages: string[]; // Array of image IDs
  onChange: (imageIds: string[]) => void;
  projectId?: string;
}

export default function ImagePicker({ selectedImages, onChange, projectId }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allImages, setAllImages] = useState<MediaImage[]>([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch selected images on mount
  useEffect(() => {
    if (selectedImages.length > 0) {
      fetchSelectedImages();
    }
  }, [selectedImages]);

  // ✅ Fetch images for modal
  useEffect(() => {
    if (isOpen) {
      fetchAllImages();
    }
  }, [isOpen]);

  const fetchSelectedImages = async () => {
    try {
      const { data } = await supabase
        .from('project_images')
        .select(`
          *,
          project:projects(id, title)
        `)
        .in('id', selectedImages);

      if (data) {
        setSelectedImageDetails(data);
      }
    } catch (error) {
      console.error('Error fetching selected images:', error);
    }
  };

  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('project_images')
        .select(`
          *,
          project:projects(id, title)
        `)
        .order('created_at', { ascending: false });

      setAllImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const { data } = supabase.storage.from('project-images').getPublicUrl(url);
    return data.publicUrl;
  };

  const toggleImage = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      // Remove from selection
      onChange(selectedImages.filter((id) => id !== imageId));
      setSelectedImageDetails(prev => prev.filter(img => img.id !== imageId));
    } else {
      // Add to selection
      onChange([...selectedImages, imageId]);
      const imageToAdd = allImages.find(img => img.id === imageId);
      if (imageToAdd) {
        setSelectedImageDetails(prev => [...prev, imageToAdd]);
      }
    }
  };

  const removeImage = (imageId: string) => {
    onChange(selectedImages.filter((id) => id !== imageId));
    setSelectedImageDetails(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Project Images
      </label>

      {/* ✅ Selected Images Preview - Always visible */}
      {selectedImageDetails.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {selectedImageDetails.map((img) => (
            <div key={img.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src={getImageUrl(img.url)}
                  alt={img.alt_text || 'Project image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Remove image"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Open Picker Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 glass rounded-lg hover:glass-strong transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {selectedImages.length > 0
          ? `${selectedImages.length} image(s) selected - Add More`
          : 'Select Images from Library'}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Select Images</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedImages.length} image(s) selected
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 glass rounded-lg hover:glass-strong"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  Loading images...
                </div>
              ) : allImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 mb-4">No images in library</p>
                  <a
                    href="/admin/media"
                    target="_blank"
                    className="inline-block px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition-all"
                  >
                    Upload Images
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {allImages.map((img) => {
                    const isSelected = selectedImages.includes(img.id);
                    const isUsedInOtherProject =
                      img.project && img.project.id !== projectId;

                    return (
                      <div
                        key={img.id}
                        onClick={() => !isUsedInOtherProject && toggleImage(img.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected
                            ? 'border-primary scale-95'
                            : isUsedInOtherProject
                            ? 'border-red-500/50 opacity-50 cursor-not-allowed'
                            : 'border-transparent hover:border-white/20'
                        }`}
                      >
                        <Image
                          src={getImageUrl(img.url)}
                          alt={img.alt_text || 'Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 16vw"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-black" />
                            </div>
                          </div>
                        )}
                        {isUsedInOtherProject && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 text-center truncate">
                            Used in: {img.project?.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Done ({selectedImages.length} selected)
              </button>
                <a
                href="/admin/media"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-lg font-semibold hover:glass-strong transition-all"
              >
                Upload New
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}