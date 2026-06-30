import { getArtistArchive } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeArchiveArtists } from "@/lib/adapters/archive.adapter";
import { ArchivePageClient } from "./ArchivePageClient";
import { buildCollectionPageJsonLd, buildPageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = buildPageMetadata({
  title: "Artist Archive - SACRISTY Bangkok",
  description: "Artists who have played SACRISTY Bangkok.",
  canonical: "/archive",
});

export default async function ArchivePage() {
  const [archiveData, settings] = await Promise.all([
    getArtistArchive(),
    getPublicSettings(),
  ]);

  const archive = normalizeArchiveArtists(archiveData);

  const collectionJsonLd = buildCollectionPageJsonLd(
    "SACRISTY Bangkok Artist Archive",
    "Artists who have performed at SACRISTY Bangkok events.",
    "/archive",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <ArchivePageClient archive={archive} settings={settings} />
    </>
  );
}
