import { z } from 'zod';

export const ResidentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  bio: z.string().optional(),
  photo: z.string().optional(),
  photoFull: z.string().optional(),
  videoUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  soundcloudUrl: z.string().optional(),
  raUrl: z.string().optional(),
  soundcloudWidgetUrl: z.string().optional(),
});
