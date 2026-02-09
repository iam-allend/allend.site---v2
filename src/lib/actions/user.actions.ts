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

export async function uploadCV(formData: FormData) {
  try {
    const file = formData.get('cv_file') as File;

    if (!file || file.size === 0) {
      return { success: false, message: 'No file uploaded' };
    }

    // Validate
    cvUploadSchema.parse({ cv_file: file });

    // Upload to Supabase Storage
    const fileName = `cv-${Date.now()}.pdf`;
    const filePath = `cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    // Save to settings
    await upsertSetting('cv_url', data.publicUrl);

    revalidatePath('/admin/profile');
    return { success: true, message: 'CV uploaded successfully', cvUrl: data.publicUrl };
  } catch (error: any) {
    console.error('Upload CV error:', error);
    return { success: false, message: error.message || 'Failed to upload CV' };
  }
}

export async function getCurrentCV() {
  try {
    const cvUrl = await getSettingByKey('cv_url');
    return { success: true, cvUrl };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}