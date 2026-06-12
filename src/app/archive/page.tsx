export const dynamic = "force-dynamic";

import { getArtistArchive } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeArchiveArtists } from "@/lib/adapters/archive.adapter";
import { ArchivePageClient } from "./ArchivePageClient";

export default async function ArchivePage() {
  const [archiveData, settings] = await Promise.all([
    getArtistArchive(),
    getPublicSettings()
  ]);

  const archive = normalizeArchiveArtists(archiveData);

  return (
    <ArchivePageClient 
      archive={archive} 
      settings={settings} 
    />
  );
}
