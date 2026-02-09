import { supabase } from '../supabase';
import type { User } from '@/types/user';

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function getSettingByKey(key: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data?.value || null;
}

export async function upsertSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}