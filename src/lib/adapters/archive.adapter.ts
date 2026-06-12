import { ArchiveArtist } from "@/types";

/**
 * Normalizes ArchiveArtist data from API for UI components.
 * Ensures no nullable issues and safe defaults.
 */
export const normalizeArchiveArtist = (data: any): ArchiveArtist => {
  return {
    name: data.name || "Unknown Artist",
    years: Array.isArray(data.years) ? data.years : [],
    instagram: data.instagram || "",
    slug: data.slug || null,
    isResident: !!data.isResident,
  };
};

export const normalizeArchiveArtists = (data: any[]): ArchiveArtist[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeArchiveArtist);
};
