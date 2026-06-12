export const dynamic = "force-dynamic";

import { getPublicSettings } from "@/services/settings.service";
import { PrivacyPageClient } from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const settings = await getPublicSettings();

  return (
    <PrivacyPageClient settings={settings} />
  );
}
