'use server';

import { revalidatePath } from 'next/cache';
import { getUserById, updateUser, uploadAvatar, getSettingByKey, upsertSetting } from '../db/queries/users';
import { profileSchema, cvUploadSchema } from '../validations/user.schema';
import { supabase } from '../db/supabase';

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const data = {
      full_name: formData.get('full_name') as string,
      nickname: formData.get('nickname') as string,
      phone: formData.get('phone') as string,
      birthday: formData.get('birthday') as string,
      country: formData.get('country') as string,
      address: formData.get('address') as string,
    };

    // Validate
    const validated = profileSchema.parse(data);

    // Update user
    await updateUser(userId, validated);

    revalidatePath('/admin/profile');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
}

export async function updateAvatar(userId: string, formData: FormData) {
  try {
    const file = formData.get('avatar') as File;

    if (!file || file.size === 0) {
      return { success: false, message: 'No file uploaded' };
    }

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, message: 'File size must be less than 2MB' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'Only image files are allowed' };
    }

    // Upload avatar
    const avatarUrl = await uploadAvatar(userId, file);

    // Update user
    await updateUser(userId, { avatar_url: avatarUrl });

    revalidatePath('/admin/profile');
    return { success: true, message: 'Avatar updated successfully', avatarUrl };
  } catch (error: any) {
    console.error('Update avatar error:', error);
    return { success: false, message: error.message || 'Failed to upload avatar' };
  }
}

/**
 * ✅ UPDATED: Upload CV with file versioning
 * Keeps 2 latest files, deletes oldest when 3rd is uploaded
 */
export async function uploadCV(formData: FormData) {
  try {
    const file = formData.get('cv_file') as File;

    if (!file || file.size === 0) {
      return { success: false, message: 'No file uploaded' };
    }

    // Validate
    cvUploadSchema.parse({ cv_file: file });

    // 1. List existing CV files
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('uploads')
      .list('cvs', {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error('List files error:', listError);
    }

    // 2. If we have 2 or more files, delete the oldest one
    if (existingFiles && existingFiles.length >= 2) {
      // Get the oldest file (last in sorted list)
      const oldestFile = existingFiles[existingFiles.length - 1];
      
      console.log('🗑️ Deleting oldest CV:', oldestFile.name);
      
      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([`cvs/${oldestFile.name}`]);

      if (deleteError) {
        console.error('Delete old file error:', deleteError);
      } else {
        console.log('✅ Oldest CV deleted successfully');
      }
    }

    // 3. Upload new CV
    const fileName = `cv-${Date.now()}.pdf`;
    const filePath = `cvs/${fileName}`;

    console.log('📤 Uploading new CV:', fileName);

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite, create new file
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // 4. Get public URL
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    console.log('✅ CV uploaded successfully:', data.publicUrl);

    // 5. Save to settings
    await upsertSetting('cv_url', data.publicUrl);

    // 6. Revalidate pages that use CV
    revalidatePath('/admin/profile');
    revalidatePath('/');
    revalidatePath('/about');

    return { 
      success: true, 
      message: 'CV uploaded successfully! Previous version has been backed up.', 
      cvUrl: data.publicUrl,
      fileName: fileName,
    };
  } catch (error: any) {
    console.error('Upload CV error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to upload CV. Please try again.' 
    };
  }
}

/**
 * Get current CV URL
 */
export async function getCurrentCV() {
  try {
    const cvUrl = await getSettingByKey('cv_url');
    return { success: true, cvUrl: cvUrl || null };
  } catch (error: any) {
    return { success: false, message: error.message, cvUrl: null };
  }
}

/**
 * ✅ NEW: Get CV file list (for history/preview)
 */
export async function getCVHistory() {
  try {
    const { data: files, error } = await supabase.storage
      .from('uploads')
      .list('cvs', {
        sortBy: { column: 'created_at', order: 'desc' },
        limit: 2, // Only get 2 latest
      });

    if (error) throw error;

    // Get public URLs for each file
    const cvFiles = files?.map(file => {
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(`cvs/${file.name}`);
      
      return {
        name: file.name,
        url: data.publicUrl,
        createdAt: file.created_at,
        size: file.metadata?.size || 0,
      };
    }) || [];

    return { success: true, files: cvFiles };
  } catch (error: any) {
    console.error('Get CV history error:', error);
    return { success: false, message: error.message, files: [] };
  }
}

/**
 * ✅ NEW: Delete specific CV file
 */
export async function deleteCV(fileName: string) {
  try {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([`cvs/${fileName}`]);

    if (error) throw error;

    // If deleted file was the current CV, update settings to the latest remaining
    const { files } = await getCVHistory();
    if (files.length > 0) {
      await upsertSetting('cv_url', files[0].url);
    } else {
      await upsertSetting('cv_url', '');
    }

    revalidatePath('/admin/profile');
    revalidatePath('/');
    revalidatePath('/about');

    return { success: true, message: 'CV deleted successfully' };
  } catch (error: any) {
    console.error('Delete CV error:', error);
    return { success: false, message: error.message || 'Failed to delete CV' };
  }
}