import { getPublicSettings } from "@/services/settings.service";
import { GuestInfoPageClient } from "./GuestInfoPageClient";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: "Guest Info & House Rules - SACRISTY Bangkok",
  description: "Guest information and house rules for SACRISTY Bangkok events.",
  canonical: "/guest-info",
});

export default async function GuestInfoPage() {
  const settings = await getPublicSettings();

  return <GuestInfoPageClient settings={settings} />;
}
