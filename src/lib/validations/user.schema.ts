import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(150),
  nickname: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  birthday: z.string().optional(),
  country: z.string().max(100).optional(),
  address: z.string().optional(),
});

export const cvUploadSchema = z.object({
  cv_file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['application/pdf'].includes(file.type),
      'Only PDF files are allowed'
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type CVUploadData = z.infer<typeof cvUploadSchema>;