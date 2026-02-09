import { supabase } from '../supabase';

export async function getAllImages() {
  const { data, error } = await supabase
    .from('project_images')
    .select(`
      *,
      project:projects(id, title, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get all images error:', error);
    throw error;
  }
  
  return data || [];
}

export async function uploadImageToStorage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function saveImageToDatabase(url: string, fileName: string) {
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: null, // Unassigned
      url: url,
      alt_text: fileName,
      sort_order: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Database save error:', error);
    throw error;
  }

  return data;
}

export async function deleteImageFromStorage(url: string) {
  const fileName = url.split('/').pop();
  if (!fileName) throw new Error('Invalid URL');

  const { error } = await supabase.storage
    .from('project-images')
    .remove([fileName]);

  if (error) {
    console.error('Storage delete error:', error);
    throw error;
  }

  return true;
}

export async function deleteImageFromDatabase(id: string) {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Database delete error:', error);
    throw error;
  }

  return true;
}

export async function getImagesByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}