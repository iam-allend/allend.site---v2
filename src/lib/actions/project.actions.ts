'use server';

import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteProject(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Soft delete - set deleted_at timestamp
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    // Revalidate cache
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');

    return { success: true };
  } catch (error) {
    console.error('Delete project error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function permanentDeleteProject(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Permanent delete (use with caution!)
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}