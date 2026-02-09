'use server';

import { revalidatePath } from 'next/cache';
import {
  uploadImageToStorage,
  saveImageToDatabase,
  deleteImageFromStorage,
  deleteImageFromDatabase,
} from '../db/queries/images';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return { success: false, message: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'File must be an image' };
    }

    // Validate file size - reduced since client-side compression is applied
    // Allow up to 200KB to give some buffer (target is 100KB)
    const maxSize = 200 * 1024; // 200KB
    if (file.size > maxSize) {
      return { 
        success: false, 
        message: `File size must be less than ${maxSize / 1024}KB (received ${(file.size / 1024).toFixed(0)}KB)` 
      };
    }

    console.log('📤 Uploading compressed file:', file.name, `(${(file.size / 1024).toFixed(0)} KB)`);

    // Step 1: Upload to Supabase Storage
    const imageUrl = await uploadImageToStorage(file);
    console.log('✅ Uploaded to storage:', imageUrl);

    // Step 2: Save URL to database
    const savedImage = await saveImageToDatabase(imageUrl, file.name);
    console.log('✅ Saved to database:', savedImage.id);

    revalidatePath('/admin/media');
    
    return { 
      success: true, 
      message: 'Image uploaded successfully',
      url: imageUrl,
      image: savedImage
    };
  } catch (error: any) {
    console.error('❌ Upload image error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to upload image' 
    };
  }
}

export async function deleteImage(id: string, url: string) {
  try {
    console.log('🗑️ Deleting image:', id);

    // Step 1: Delete from storage
    await deleteImageFromStorage(url);
    console.log('✅ Deleted from storage');

    // Step 2: Delete from database
    await deleteImageFromDatabase(id);
    console.log('✅ Deleted from database');

    revalidatePath('/admin/media');
    
    return { success: true, message: 'Image deleted successfully' };
  } catch (error: any) {
    console.error('❌ Delete image error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to delete image' 
    };
  }
}