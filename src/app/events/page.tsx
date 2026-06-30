import { getUpcomingEvents, getArchiveEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvents } from "@/lib/adapters/event.adapter";
import { EventsPageClient } from "./EventsPageClient";
import {
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Hard Techno Events in Bangkok - SACRISTY",
  description: "Upcoming and past SACRISTY hard techno events in Bangkok.",
  canonical: "/events",
});

export default async function EventsPage() {
  const [upcomingData, pastData, settings] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
    getPublicSettings(),
  ]);

  const upcomingEvents = normalizeEvents(upcomingData);
  const pastEvents = normalizeEvents(pastData);
  const allEvents = [...upcomingEvents, ...pastEvents];

  const collectionJsonLd = buildCollectionPageJsonLd(
    "SACRISTY Bangkok Events",
    "Upcoming and past hard techno events in Bangkok.",
    "/events",
  );

  const itemListJsonLd = buildItemListJsonLd(
    "SACRISTY Bangkok Events",
    allEvents.map((event) => ({
      name: event.displayTitle || event.title,
      url: `/events/${event.slug}`,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {allEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <EventsPageClient
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        settings={settings}
      />
    </>
  );
}
