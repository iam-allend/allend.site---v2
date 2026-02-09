'use server';

import { revalidatePath } from 'next/cache';
import { 
  getSettings, 
  updateSettingsByKey, 
  getAllSettings,
  getMultipleSettings 
} from '../db/queries/settings';
import {
  generalSettingsSchema,
  socialLinksSchema,
  availabilitySchema,
  contactInfoSchema,
  seoSchema,
  aboutSchema,
  type GeneralSettings,
  type SocialLinks,
  type Availability,
  type ContactInfo,
  type SEO,
  type About,
} from '../validations/settings.schema';

/**
 * Fetch settings by key
 */
export async function fetchSettings(key: string) {
  try {
    const data = await getSettings(key);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch settings error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch all settings
 */
export async function fetchAllSettings() {
  try {
    const data = await getAllSettings();
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch all settings error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch multiple settings at once
 */
export async function fetchMultipleSettings(keys: string[]) {
  try {
    const data = await getMultipleSettings(keys);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch multiple settings error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update general settings
 */
export async function updateGeneralSettings(formData: GeneralSettings) {
  try {
    // Validate with Zod
    const validated = generalSettingsSchema.parse(formData);

    // Update in database
    await updateSettingsByKey('general', validated);

    // Revalidate pages that use this setting
    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/about');

    return { success: true, message: 'General settings updated successfully' };
  } catch (error) {
    console.error('❌ Update general settings error:', error);
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update settings' 
    };
  }
}

/**
 * Update social links
 */
export async function updateSocialLinks(formData: SocialLinks) {
  try {
    const validated = socialLinksSchema.parse(formData);
    await updateSettingsByKey('social_links', validated);

    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');

    return { success: true, message: 'Social links updated successfully' };
  } catch (error) {
    console.error('❌ Update social links error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update social links' 
    };
  }
}

/**
 * Update availability status
 */
export async function updateAvailability(formData: Availability) {
  try {
    const validated = availabilitySchema.parse(formData);
    await updateSettingsByKey('availability', validated);

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return { success: true, message: 'Availability status updated successfully' };
  } catch (error) {
    console.error('❌ Update availability error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update availability' 
    };
  }
}

/**
 * Update contact information
 */
export async function updateContactInfo(formData: ContactInfo) {
  try {
    const validated = contactInfoSchema.parse(formData);
    await updateSettingsByKey('contact_info', validated);

    revalidatePath('/admin/settings');
    revalidatePath('/contact');

    return { success: true, message: 'Contact information updated successfully' };
  } catch (error) {
    console.error('❌ Update contact info error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update contact info' 
    };
  }
}

/**
 * Update SEO settings
 */
export async function updateSEO(formData: SEO) {
  try {
    const validated = seoSchema.parse(formData);
    await updateSettingsByKey('seo', validated);

    revalidatePath('/admin/settings');
    revalidatePath('/'); // Revalidate all pages for SEO

    return { success: true, message: 'SEO settings updated successfully' };
  } catch (error) {
    console.error('❌ Update SEO error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update SEO' 
    };
  }
}

/**
 * Update about page content
 */
export async function updateAbout(formData: About) {
  try {
    const validated = aboutSchema.parse(formData);
    await updateSettingsByKey('about', validated);

    revalidatePath('/admin/settings');
    revalidatePath('/about');

    return { success: true, message: 'About content updated successfully' };
  } catch (error) {
    console.error('❌ Update about error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return { 
        success: false, 
        message: 'Validation error', 
        errors: 'errors' in error ? error.errors : undefined
      };
    }

    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update about' 
    };
  }
}