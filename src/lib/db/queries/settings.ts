import { supabase } from '../supabase';

/**
 * Get settings by key
 * @param key - Settings key (e.g., 'general', 'social_links')
 * @returns Settings value as JSON object
 */
export async function getSettings(key: string) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error('❌ Get settings error:', error);
      throw new Error(error.message);
    }

    return data?.value || null;
  } catch (error) {
    console.error('❌ Get settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Update settings by key (upsert - insert or update)
 * @param key - Settings key
 * @param value - Settings value as JSON object
 * @returns Updated settings data
 */
export async function updateSettingsByKey(key: string, value: Record<string, unknown>) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert(
        { 
          key, 
          value,
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'key',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ Update settings error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Settings updated:', key);
    return data;
  } catch (error) {
    console.error('❌ Update settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Get all settings
 * @returns Array of all settings
 */
export async function getAllSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('❌ Get all settings error:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get all settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Get multiple settings at once
 * @param keys - Array of settings keys
 * @returns Object with key-value pairs
 */
export async function getMultipleSettings(keys: string[]) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', keys);

    if (error) {
      console.error('❌ Get multiple settings error:', error);
      throw new Error(error.message);
    }

    // Transform array to object
    const result: Record<string, unknown> = {};
    data?.forEach((item) => {
      result[item.key] = item.value;
    });

    return result;
  } catch (error) {
    console.error('❌ Get multiple settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Delete settings by key
 * @param key - Settings key to delete
 */
export async function deleteSettings(key: string) {
  try {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('❌ Delete settings error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Settings deleted:', key);
  } catch (error) {
    console.error('❌ Delete settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}