export const dynamic = "force-dynamic";

import { getPublicSettings } from "@/services/settings.service";
import { ContactPageClient } from "./ContactPageClient";

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <ContactPageClient settings={settings} />
  );
}
