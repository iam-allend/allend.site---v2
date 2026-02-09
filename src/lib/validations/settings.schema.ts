import { z } from 'zod';

// General Settings Schema
export const generalSettingsSchema = z.object({
  siteTitle: z.string().min(3, 'Site title minimal 3 karakter').max(100, 'Site title maksimal 100 karakter'),
  siteDescription: z.string().min(10, 'Description minimal 10 karakter').max(500, 'Description maksimal 500 karakter'),
  ownerName: z.string().min(2, 'Nama minimal 2 karakter').max(150, 'Nama maksimal 150 karakter'),
  tagline: z.string().max(100, 'Tagline maksimal 100 karakter').optional(),
  primaryRole: z.string().max(150, 'Role maksimal 150 karakter').optional(),
  yearsExperience: z.number().min(0, 'Tahun pengalaman tidak boleh negatif').max(50, 'Tahun pengalaman tidak valid'),
  location: z.string().max(100, 'Lokasi maksimal 100 karakter').optional(),
});

// Social Links Schema
export const socialLinksSchema = z.object({
  github: z.string().url('URL GitHub tidak valid').optional().or(z.literal('')),
  linkedin: z.string().url('URL LinkedIn tidak valid').optional().or(z.literal('')),
  instagram: z.string().url('URL Instagram tidak valid').optional().or(z.literal('')),
  twitter: z.string().url('URL Twitter tidak valid').optional().or(z.literal('')),
  behance: z.string().url('URL Behance tidak valid').optional().or(z.literal('')),
  dribbble: z.string().url('URL Dribbble tidak valid').optional().or(z.literal('')),
});

// Availability Schema
export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
  type: z.enum(['full-time', 'freelance', 'both', 'not-available']),
  customMessage: z.string().max(200, 'Custom message maksimal 200 karakter').optional(),
  showOnHomepage: z.boolean(),
});

// Contact Info Schema
export const contactInfoSchema = z.object({
  displayEmail: z.string().email('Email tidak valid'),
  displayPhone: z.string().max(50, 'Phone maksimal 50 karakter').optional(),
  displayLocation: z.string().max(100, 'Location maksimal 100 karakter').optional(),
  recipientEmail: z.string().email('Email penerima tidak valid'),
});

// SEO Schema
export const seoSchema = z.object({
  metaTitle: z.string().min(10, 'Meta title minimal 10 karakter').max(60, 'Meta title maksimal 60 karakter'),
  metaDescription: z.string().min(50, 'Meta description minimal 50 karakter').max(160, 'Meta description maksimal 160 karakter'),
  keywords: z.string().max(255, 'Keywords maksimal 255 karakter'),
  ogImageUrl: z.string().url('OG Image URL tidak valid').optional().or(z.literal('')),
  faviconUrl: z.string().url('Favicon URL tidak valid').optional().or(z.literal('')),
  googleAnalyticsId: z.string().max(50, 'Analytics ID maksimal 50 karakter').optional(),
});

// About Schema
export const aboutSchema = z.object({
  bio: z.string().min(50, 'Bio minimal 50 karakter').max(5000, 'Bio maksimal 5000 karakter'),
  skills: z.array(z.string().max(50, 'Skill name maksimal 50 karakter')).min(1, 'Minimal 1 skill'),
});

// Type exports for TypeScript
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type SEO = z.infer<typeof seoSchema>;
export type About = z.infer<typeof aboutSchema>;