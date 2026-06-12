export const dynamic = "force-dynamic";

import { getPublicSettings } from "@/services/settings.service";
import { AboutPageClient } from "./AboutPageClient";

export default async function AboutPage() {
  const settings = await getPublicSettings();

  return (
    <AboutPageClient settings={settings} />
  );
}
