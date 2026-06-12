import { Event } from "@/types";

/**
 * Normalizes Event data from API or Service for UI components.
 */
export const normalizeEvent = (data: any): Event => {
  if (!data) return null as any;

  return {
    id: data.id,
    slug: data.slug || "",
    title: data.title || "",
    displayTitle: data.displayTitle || null,
    eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
    location: data.location || "",
    mapsLink: data.mapsLink || null,
    coords: data.coords || null,
    ticketLink: data.ticketLink || null,
    racoLink: data.racoLink || null,
    posterUrl: data.posterUrl || null,
    description: data.description || null,
    isPublished: !!data.isPublished,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    lineup: Array.isArray(data.lineup) ? data.lineup : [],
  };
};

export const normalizeEvents = (data: any[]): Event[] => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeEvent).filter(Boolean);
};
