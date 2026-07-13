import { Resident } from "@/types";

type LooseRecord = Record<string, unknown>;

const toRecord = (data: unknown): LooseRecord => (data && typeof data === "object" ? data as LooseRecord : {});
const toString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const toNullableString = (value: unknown) => (typeof value === "string" && value ? value : null);
const toDate = (value: unknown) => {
  const date = value ? new Date(value as string | number | Date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

/**
 * Normalizes Resident data from API or Service for UI components.
 * Supports both plain objects (from JSON) and Prisma objects.
 */
export const normalizeResident = (data: unknown): Resident => {
  const item = toRecord(data);

  return {
    id: typeof item.id === "number" ? item.id : 0,
    slug: toString(item.slug),
    name: toString(item.name),
    bio: toNullableString(item.bio),
    photo: toNullableString(item.photo),
    photoFull: toNullableString(item.photoFull),
    videoUrl: toNullableString(item.videoUrl),
    instagramUrl: toString(item.instagramUrl),
    soundcloudUrl: toString(item.soundcloudUrl),
    raUrl: toNullableString(item.raUrl),
    soundcloudWidgetUrl: toNullableString(item.soundcloudWidgetUrl),
    createdAt: toDate(item.createdAt),
    updatedAt: toDate(item.updatedAt),
    lineupItems: Array.isArray(item.lineupItems) ? item.lineupItems as Resident["lineupItems"] : [],
  };
};

export const normalizeResidents = (data: unknown): Resident[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeResident).filter((resident) => resident.id > 0 || Boolean(resident.slug));
};
