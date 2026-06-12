export const dynamic = "force-dynamic";

import { getResidents } from "@/services/resident.service";
import { getUpcomingEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeResidents } from "@/lib/adapters/resident.adapter";
import { ResidentsPageClient } from "./ResidentsPageClient";

export default async function ResidentsPage() {
  const [residentsData, upcomingEvents, settings] = await Promise.all([
    getResidents(),
    getUpcomingEvents(),
    getPublicSettings()
  ]);

  const residents = normalizeResidents(residentsData);

  return (
    <ResidentsPageClient 
      initialResidents={residents} 
      upcomingEvents={upcomingEvents} 
      settings={settings}
    />
  );
}
