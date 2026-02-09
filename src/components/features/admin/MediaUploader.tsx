'use client';

import { useState } from 'react';
import { Upload, X, Loader2, CheckCircle, Zap } from 'lucide-react';
import { uploadImage } from '@/lib/actions/image.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

interface CompressedFile {
  original: File;
  compressed: File | null;
  originalSize: number;
  compressedSize: number;
  compressing: boolean;
  error?: string;
}

export default function MediaUploader() {
  const router = useRouter();
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Compression options
  const compressionOptions = {
    maxSizeMB: 0.15, // 100KB = 0.1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    fileType: 'image/jpeg', // Convert all to JPEG for better compression
    initialQuality: 0.8, // Starting quality
  };

  const compressImage = async (file: File): Promise<File> => {
    try {
      console.log(`🔄 Compressing ${file.name}...`);
      console.log(`📊 Original size: ${(file.size / 1024).toFixed(2)} KB`);

      const compressedFile = await imageCompression(file, compressionOptions);

      console.log(`✅ Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
      console.log(`📉 Reduction: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`);

      return compressedFile;
    } catch (error) {
      console.error('❌ Compression error:', error);
      throw new Error('Failed to compress image');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      await processFiles(selectedFiles);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const processFiles = async (selectedFiles: File[]) => {
    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      // Increased limit since we'll compress anyway
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB before compression)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files with initial state
    const newCompressedFiles: CompressedFile[] = validFiles.map((file) => ({
      original: file,
      compressed: null,
      originalSize: file.size,
      compressedSize: 0,
      compressing: true,
    }));

    setFiles((prev) => [...prev, ...newCompressedFiles]);

    // Compress each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = files.length + i;

      try {
        const compressed = await compressImage(file);

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex
              ? {
                  ...f,
                  compressed,
                  compressedSize: compressed.size,
                  compressing: false,
                }
              : f
          )
        );

        toast.success(
          `${file.name} compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB`
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex
              ? {
                  ...f,
                  compressing: false,
                  error: 'Compression failed',
                }
              : f
          )
        );
        toast.error(`Failed to compress ${file.name}`);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const readyFiles = files.filter((f) => f.compressed && !f.compressing);

    if (readyFiles.length === 0) {
      toast.error('No compressed files ready to upload');
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadedCount(0);

    try {
      for (let i = 0; i < readyFiles.length; i++) {
        const file = readyFiles[i];
        const formData = new FormData();
        
        // Upload the compressed file
        formData.append('file', file.compressed!);

        const result = await uploadImage(formData);

        if (result.success) {
          setUploadedCount(i + 1);
          setProgress(((i + 1) / readyFiles.length) * 100);
        } else {
          toast.error(`Failed to upload ${file.original.name}: ${result.message}`);
        }
      }

      toast.success(`Successfully uploaded ${readyFiles.length} compressed image(s)`);
      setFiles([]);
      router.refresh();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadedCount(0);
    }
  };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, f) => sum + f.compressedSize, 0);
  const compressionRate = totalOriginalSize > 0
    ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100
    : 0;

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Upload Images</h2>
        <div className="flex items-center gap-2 text-sm text-primary">
          <Zap className="w-4 h-4" />
          <span>Auto-compress to ~100KB</span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-400">
            PNG, JPG, GIF, WebP up to 10MB (will be compressed to ~100KB)
          </p>
        </label>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected Files ({files.length})
            </p>
            {!uploading && (
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Compression Stats */}
          {files.length > 0 && totalCompressedSize > 0 && (
            <div className="glass rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Compression:</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">
                  {(totalOriginalSize / 1024).toFixed(0)}KB
                </span>
                <span className="mx-2">→</span>
                <span className="text-primary font-medium">
                  {(totalCompressedSize / 1024).toFixed(0)}KB
                </span>
                <span className="ml-2 text-green-400">
                  (-{compressionRate.toFixed(0)}%)
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="glass rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                    {file.compressing ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : uploading && index < uploadedCount ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : file.error ? (
                      <X className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.original.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      {file.compressing ? (
                        <span className="text-primary">Compressing...</span>
                      ) : file.error ? (
                        <span className="text-red-400">{file.error}</span>
                      ) : file.compressed ? (
                        <>
                          <span className="text-gray-400 line-through">
                            {(file.originalSize / 1024).toFixed(0)}KB
                          </span>
                          <span className="text-primary font-medium">
                            {(file.compressedSize / 1024).toFixed(0)}KB
                          </span>
                          <span className="text-green-400">
                            (-{(((file.originalSize - file.compressedSize) / file.originalSize) * 100).toFixed(0)}%)
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          {(file.originalSize / 1024).toFixed(0)}KB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!uploading && !file.compressing && (
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Uploading {uploadedCount} / {files.filter(f => f.compressed).length}...
                </span>
                <span className="text-sm text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <button
              onClick={uploadFiles}
              disabled={files.some((f) => f.compressing) || files.every((f) => !f.compressed)}
              className="w-full px-6 py-3 bg-primary text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {files.some((f) => f.compressing) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload {files.filter((f) => f.compressed).length}{' '}
                  {files.filter((f) => f.compressed).length === 1 ? 'File' : 'Files'}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}