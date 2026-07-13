export const dynamic = "force-dynamic";

import { getAllEventsAdmin } from "@/services/event.service";
import { getResidentsAdmin } from "@/services/resident.service";
import { Event } from "@/types";
import AdminEventsClient, { AdminEventRow, AdminResidentOption } from "./AdminEventsClient";

function sortEventsForAdmin(events: Event[]) {
  const now = new Date();
  const upcoming = events
    .filter((event) => event.eventDate >= now)
    .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  const past = events
    .filter((event) => event.eventDate < now)
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());

  return [...upcoming, ...past];
}

function serializeEvent(event: Event): AdminEventRow {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    displayTitle: event.displayTitle || null,
    eventDate: event.eventDate.toISOString(),
    location: event.location || "",
    mapsLink: event.mapsLink || null,
    coords: event.coords || null,
    posterUrl: event.posterUrl || null,
    ticketLink: event.ticketLink || null,
    racoLink: event.racoLink || null,
    description: event.description || null,
    isPublished: event.isPublished,
    lineup:
      event.lineup?.map((item) => ({
        id: item.id,
        residentId: item.residentId || null,
        residentSlug: item.residentSlug || null,
        djName: item.djName || null,
        djInstagram: item.djInstagram || null,
        sortOrder: item.sortOrder,
        resident: item.resident
          ? {
              id: item.resident.id,
              slug: item.resident.slug,
              name: item.resident.name,
            }
          : null,
      })) || [],
  };
}

function serializeResident(resident: { id: number; slug: string; name: string }): AdminResidentOption {
  return {
    id: resident.id,
    slug: resident.slug,
    name: resident.name,
  };
}

export default async function AdminEventsPage() {
  const [events, residents] = await Promise.all([getAllEventsAdmin(), getResidentsAdmin()]);

  return (
    <AdminEventsClient
      initialEvents={sortEventsForAdmin(events).map(serializeEvent)}
      residents={residents.map(serializeResident)}
    />
  );
}
