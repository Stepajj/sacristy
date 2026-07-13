export const dynamic = "force-dynamic";

import { getResidentsAdmin } from "@/services/resident.service";
import AdminResidentsClient, { AdminResidentRow } from "./AdminResidentsClient";

function serializeResident(resident: {
  id: number;
  slug: string;
  name: string;
  bio?: string | null;
  photo?: string | null;
  photoFull?: string | null;
  videoUrl?: string | null;
  instagramUrl?: string | null;
  soundcloudUrl?: string | null;
  raUrl?: string | null;
  soundcloudWidgetUrl?: string | null;
}): AdminResidentRow {
  return {
    id: resident.id,
    slug: resident.slug,
    name: resident.name,
    bio: resident.bio || null,
    photo: resident.photo || null,
    photoFull: resident.photoFull || null,
    videoUrl: resident.videoUrl || null,
    instagramUrl: resident.instagramUrl || null,
    soundcloudUrl: resident.soundcloudUrl || null,
    raUrl: resident.raUrl || null,
    soundcloudWidgetUrl: resident.soundcloudWidgetUrl || null,
  };
}

export default async function AdminResidentsPage() {
  const residents = await getResidentsAdmin();

  return <AdminResidentsClient initialResidents={residents.map(serializeResident)} />;
}
