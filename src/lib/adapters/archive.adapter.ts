import { ArchiveArtist } from "@/types";

type LooseRecord = Record<string, unknown>;

const toRecord = (data: unknown): LooseRecord => (data && typeof data === "object" ? data as LooseRecord : {});
const toString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

/**
 * Normalizes ArchiveArtist data from API for UI components.
 * Ensures no nullable issues and safe defaults.
 */
export const normalizeArchiveArtist = (data: unknown): ArchiveArtist => {
  const item = toRecord(data);

  return {
    name: toString(item.name, "Unknown Artist"),
    years: Array.isArray(item.years) ? item.years.filter((year): year is string => typeof year === "string") : [],
    instagram: toString(item.instagram),
    slug: typeof item.slug === "string" ? item.slug : null,
    isResident: Boolean(item.isResident),
  };
};

export const normalizeArchiveArtists = (data: unknown): ArchiveArtist[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeArchiveArtist);
};
