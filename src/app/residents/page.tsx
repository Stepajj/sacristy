import { getResidents } from "@/services/resident.service";
import { getUpcomingEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeResidents } from "@/lib/adapters/resident.adapter";
import { ResidentsPageClient } from "./ResidentsPageClient";
import {
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
  SITE_URL,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata = buildPageMetadata({
  title: "SACRISTY Residents",
  description: "Meet the resident artists of SACRISTY Bangkok.",
  canonical: "/residents",
});

export default async function ResidentsPage() {
  const [residentsData, upcomingEvents, settings] = await Promise.all([
    getResidents(),
    getUpcomingEvents(),
    getPublicSettings(),
  ]);

  const residents = normalizeResidents(residentsData);

  const collectionJsonLd = buildCollectionPageJsonLd(
    "SACRISTY Bangkok Residents",
    "Resident DJs and artists of SACRISTY Bangkok.",
    "/residents",
  );

  const itemListJsonLd = buildItemListJsonLd(
    "SACRISTY Bangkok Residents",
    residents.map((resident) => ({
      name: resident.name,
      url: `${SITE_URL}/residents/${resident.slug}`,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {residents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <ResidentsPageClient
        initialResidents={residents}
        upcomingEvents={upcomingEvents}
        settings={settings}
      />
    </>
  );
}
