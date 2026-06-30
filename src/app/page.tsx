import { getUpcomingEvents, getArchiveEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvents } from "@/lib/adapters/event.adapter";
import { HomePageClient } from "./HomePageClient";
import { buildItemListJsonLd } from "@/lib/seo";
import { UpcomingEvents } from "@/features/home/components/UpcomingEvents";
import { PastEvents } from "@/features/home/components/PastEvents";

export const revalidate = 60;

export default async function Home() {
  const [upcomingData, pastData, settings] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
    getPublicSettings(),
  ]);

  const upcomingEvents = normalizeEvents(upcomingData);
  const pastEvents = normalizeEvents(pastData);

  const upcomingEventsJsonLd = buildItemListJsonLd(
    "Upcoming SACRISTY Bangkok Events",
    upcomingEvents.map((event) => ({
      name: event.displayTitle || event.title,
      url: `/events/${event.slug}`,
    })),
  );

  return (
    <>
      {upcomingEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(upcomingEventsJsonLd),
          }}
        />
      )}
      <HomePageClient
        settings={settings}
      >
        <UpcomingEvents events={upcomingEvents} />
        <PastEvents events={pastEvents} />
      </HomePageClient>
    </>
  );
}
