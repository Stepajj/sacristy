import type { MetadataRoute } from "next";
import { getArchiveEvents, getUpcomingEvents } from "@/services/event.service";
import { getResidents } from "@/services/resident.service";

const SITE_URL = "https://sacristybangkok.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [upcomingEvents, pastEvents, residents] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
    getResidents(),
  ]);

  const staticRoutes = ["", "/events", "/residents", "/archive", "/guest-info", "/contact", "/about", "/privacy"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: route === "" || route === "/events" ? "daily" as const : "monthly" as const,
      priority: route === "" ? 1 : route === "/events" ? 0.9 : 0.7,
    })),
    ...[...upcomingEvents, ...pastEvents].map((event) => ({
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...residents.map((resident) => ({
      url: `${SITE_URL}/residents/${resident.slug}`,
      lastModified: resident.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
