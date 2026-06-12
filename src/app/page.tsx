export const dynamic = "force-dynamic";

import { getUpcomingEvents, getArchiveEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvents } from "@/lib/adapters/event.adapter";
import { HomePageClient } from "./HomePageClient";

export default async function Home() {
  const [upcomingData, pastData, settings] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
    getPublicSettings()
  ]);

  const upcomingEvents = normalizeEvents(upcomingData);
  const pastEvents = normalizeEvents(pastData);

  return (
    <HomePageClient 
      upcomingEvents={upcomingEvents} 
      pastEvents={pastEvents} 
      settings={settings}
    />
  );
}
