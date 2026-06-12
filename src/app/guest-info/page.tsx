export const dynamic = "force-dynamic";

import { getPublicSettings } from "@/services/settings.service";
import { GuestInfoPageClient } from "./GuestInfoPageClient";

export default async function GuestInfoPage() {
  const settings = await getPublicSettings();

  return (
    <GuestInfoPageClient settings={settings} />
  );
}
