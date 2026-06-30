import { getPublicSettings } from "@/services/settings.service";
import { PrivacyPageClient } from "./PrivacyPageClient";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: "Privacy Policy - SACRISTY Bangkok",
  description: "Privacy policy for the SACRISTY Bangkok website.",
  canonical: "/privacy",
});

export default async function PrivacyPage() {
  const settings = await getPublicSettings();

  return <PrivacyPageClient settings={settings} />;
}
