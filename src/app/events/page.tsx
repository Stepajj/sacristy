import { getUpcomingEvents, getArchiveEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvents } from "@/lib/adapters/event.adapter";
import { EventsPageClient } from "./EventsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hard Techno Events in Bangkok - SACRISTY",
  description: "Upcoming and past SACRISTY hard techno events in Bangkok.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const [upcomingData, pastData, settings] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
    getPublicSettings()
  ]);

  const upcomingEvents = normalizeEvents(upcomingData);
  const pastEvents = normalizeEvents(pastData);

  return (
    <EventsPageClient 
      upcomingEvents={upcomingEvents} 
      pastEvents={pastEvents} 
      settings={settings}
    />
  );
}
