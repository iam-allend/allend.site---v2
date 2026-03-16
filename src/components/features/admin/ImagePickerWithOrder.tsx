'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, GripVertical, ChevronUp, ChevronDown, Plus, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/db/supabase';

interface ImageItem {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  project: { id: string; title: string } | null;
}

interface ImagePickerWithOrderProps {
  selectedImages: string[]; // Array of image IDs in order
  onChange: (imageIds: string[]) => void;
  projectId?: string;
}

export default function ImagePickerWithOrder({
  selectedImages,
  onChange,
  projectId,
}: ImagePickerWithOrderProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState<ImageItem[]>([]);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // ─── Fetch selected image details on mount / when selectedImages changes ───
  useEffect(() => {
    if (selectedImages.length > 0) {
      fetchSelectedImages();
    } else {
      setSelectedImageDetails([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount — we manage order manually after that

  // ─── Fetch all images for gallery when modal opens ────────────────────────
  useEffect(() => {
    if (showGallery) {
      fetchAllImages();
    }
  }, [showGallery]);

  // ─── Fetch details for already-selected images (edit mode) ────────────────
  // Helper untuk normalize data dari Supabase
  const normalizeImage = (img: any): ImageItem => ({
    id: img.id,
    url: img.url,
    alt_text: img.alt_text,
    sort_order: img.sort_order,
    project: Array.isArray(img.project)
      ? (img.project[0] ?? null)
      : (img.project ?? null),
  });

  const fetchSelectedImages = async () => {
    setLoadingSelected(true);
    try {
      const { data } = await supabase
        .from('project_images')
        .select('id, url, alt_text, sort_order, project:projects(id, title)')
        .in('id', selectedImages);

      if (data) {
        const ordered = selectedImages
          .map((id) => data.find((img) => img.id === id))
          .filter(Boolean)
          .map(normalizeImage);
        setSelectedImageDetails(ordered);
      }
    } catch (err) {
      console.error('Error fetching selected images:', err);
    } finally {
      setLoadingSelected(false);
    }
  };

  const fetchAllImages = async () => {
    setLoadingGallery(true);
    try {
      const { data } = await supabase
        .from('project_images')
        .select('id, url, alt_text, sort_order, project:projects(id, title)')
        .order('created_at', { ascending: false });

      setAllImages((data || []).map(normalizeImage));
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  // ─── Same URL resolver as working ImagePicker ─────────────────────────────
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const { data } = supabase.storage.from('project-images').getPublicUrl(url);
    return data.publicUrl;
  };

  // ─── Add image from gallery ───────────────────────────────────────────────
  const handleAddImage = (image: ImageItem) => {
    const newDetails = [...selectedImageDetails, image];
    setSelectedImageDetails(newDetails);
    onChange(newDetails.map((img) => img.id));
    setShowGallery(false);
  };

  // ─── Remove image ─────────────────────────────────────────────────────────
  const handleRemoveImage = (imageId: string) => {
    const newDetails = selectedImageDetails.filter((img) => img.id !== imageId);
    setSelectedImageDetails(newDetails);
    onChange(newDetails.map((img) => img.id));
  };

  // ─── Move with buttons ────────────────────────────────────────────────────
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedImageDetails.length) return;
    const next = [...selectedImageDetails];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setSelectedImageDetails(next);
    onChange(next.map((img) => img.id));
  };

  // ─── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const next = [...selectedImageDetails];
    const [dragged] = next.splice(draggedIndex, 1);
    next.splice(index, 0, dragged);
    setSelectedImageDetails(next);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      onChange(selectedImageDetails.map((img) => img.id));
    }
    setDraggedIndex(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          Project Images
          {selectedImageDetails.length > 0 && (
            <span className="text-gray-500 text-xs ml-2">
              ({selectedImageDetails.length} image{selectedImageDetails.length !== 1 ? 's' : ''})
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="px-4 py-2 glass rounded-lg hover:glass-strong transition-all flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {/* Loading skeleton */}
      {loadingSelected && (
        <div className="glass rounded-lg p-6 text-center text-sm text-gray-500">
          Loading images...
        </div>
      )}

      {/* Selected images list */}
      {!loadingSelected && selectedImageDetails.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            {selectedImageDetails.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`glass-strong rounded-lg p-3 transition-all ${
                  draggedIndex === index ? 'opacity-40 scale-95' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing shrink-0">
                    <GripVertical className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    <Image
                      src={getImageUrl(image.url)}
                      alt={image.alt_text || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    {/* Order badge */}
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full glass-strong flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{image.alt_text || 'No description'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {index + 1} of {selectedImageDetails.length}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 glass rounded hover:glass-strong transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === selectedImageDetails.length - 1}
                      className="p-1 glass rounded hover:glass-strong transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="p-1.5 glass rounded hover:bg-red-500/20 transition-all shrink-0"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedImageDetails.length > 1 && (
            <p className="text-xs text-gray-500 text-center">
              💡 Drag to reorder, or use ↑↓ buttons
            </p>
          )}
        </>
      )}

      {/* Empty state */}
      {!loadingSelected && selectedImageDetails.length === 0 && (
        <div className="glass rounded-lg p-8 text-center text-sm text-gray-500">
          No images selected. Click "Add Image" to choose from gallery.
        </div>
      )}

      {/* ── Gallery Modal ──────────────────────────────────────────────────── */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="glass-strong rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold">Select Image</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="w-9 h-9 rounded-full glass hover:bg-red-500/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingGallery ? (
                <div className="text-center py-16 text-gray-400">Loading images...</div>
              ) : allImages.length === 0 ? (
                <div className="text-center py-16">
                  <ImageIcon className="w-14 h-14 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 mb-4">No images in library</p>
                  <a
                    href="/admin/media"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-black rounded-lg font-semibold"
                  >
                    Upload Images
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allImages
                    .filter((img) => !selectedImages.includes(img.id))
                    .map((image) => {
                      const usedElsewhere =
                        image.project && image.project.id !== projectId;

                      return (
                        <button
                          key={image.id}
                          type="button"
                          disabled={!!usedElsewhere}
                          onClick={() => !usedElsewhere && handleAddImage(image)}
                          className={`relative aspect-square rounded-lg overflow-hidden transition-all group ${
                            usedElsewhere
                              ? 'opacity-40 cursor-not-allowed'
                              : 'glass hover:ring-2 hover:ring-primary cursor-pointer'
                          }`}
                        >
                          <Image
                            src={getImageUrl(image.url)}
                            alt={image.alt_text || 'Image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          {/* Hover overlay */}
                          {!usedElsewhere && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Plus className="w-8 h-8" />
                            </div>
                          )}
                          {/* Used-elsewhere badge */}
                          {usedElsewhere && (
                            <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-xs px-1 py-0.5 text-center truncate">
                              {image.project?.title}
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-white/10 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="flex-1 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Done
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