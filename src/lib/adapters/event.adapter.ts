import { Event } from "@/types";

type LooseRecord = Record<string, unknown>;

const toRecord = (data: unknown): LooseRecord => (data && typeof data === "object" ? data as LooseRecord : {});
const toString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const toNullableString = (value: unknown) => (typeof value === "string" && value ? value : null);
const toDate = (value: unknown) => {
  const date = value ? new Date(value as string | number | Date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

/**
 * Normalizes Event data from API or Service for UI components.
 */
export const normalizeEvent = (data: unknown): Event => {
  const item = toRecord(data);

  return {
    id: typeof item.id === "number" ? item.id : 0,
    slug: toString(item.slug),
    title: toString(item.title),
    displayTitle: toNullableString(item.displayTitle),
    eventDate: toDate(item.eventDate),
    location: toString(item.location),
    mapsLink: toNullableString(item.mapsLink),
    coords: toNullableString(item.coords),
    ticketLink: toNullableString(item.ticketLink),
    racoLink: toNullableString(item.racoLink),
    posterUrl: toNullableString(item.posterUrl),
    description: toNullableString(item.description),
    isPublished: Boolean(item.isPublished),
    createdAt: toDate(item.createdAt),
    updatedAt: toDate(item.updatedAt),
    lineup: Array.isArray(item.lineup) ? item.lineup as Event["lineup"] : [],
  };
};

export const normalizeEvents = (data: unknown): Event[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeEvent).filter((event) => event.id > 0 || Boolean(event.slug));
};
