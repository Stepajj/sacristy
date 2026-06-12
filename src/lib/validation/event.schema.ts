import { z } from 'zod';

export const LineupItemSchema = z.object({
  residentId: z.union([z.number(), z.string().length(0)]).optional(),
  residentSlug: z.string().optional(),
  djName: z.string().optional(),
  djInstagram: z.string().optional(),
  sortOrder: z.number().default(0),
});

export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  displayTitle: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  eventDate: z.string().or(z.date()),
  location: z.string().optional(),
  mapsLink: z.string().url().optional().or(z.literal('')),
  coords: z.string().optional(),
  posterUrl: z.string().optional(),
  ticketLink: z.string().url().optional().or(z.literal('')),
  racoLink: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  lineup: z.array(LineupItemSchema).optional(),
});
