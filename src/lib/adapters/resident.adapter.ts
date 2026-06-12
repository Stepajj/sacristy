import { Resident } from "@/types";

/**
 * Normalizes Resident data from API or Service for UI components.
 * Supports both plain objects (from JSON) and Prisma objects.
 */
export const normalizeResident = (data: any): Resident => {
  if (!data) return null as any;

  return {
    id: data.id,
    slug: data.slug || "",
    name: data.name || "",
    bio: data.bio || null,
    photo: data.photo || null,
    photoFull: data.photoFull || null,
    videoUrl: data.videoUrl || null,
    instagramUrl: data.instagramUrl || "",
    soundcloudUrl: data.soundcloudUrl || "",
    raUrl: data.raUrl || null,
    soundcloudWidgetUrl: data.soundcloudWidgetUrl || null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    lineupItems: Array.isArray(data.lineupItems) ? data.lineupItems : [],
  };
};

export const normalizeResidents = (data: any[]): Resident[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeResident).filter(Boolean);
};
