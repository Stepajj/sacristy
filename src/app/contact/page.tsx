import { getPublicSettings } from "@/services/settings.service";
import { ContactPageClient } from "./ContactPageClient";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: "Contact - SACRISTY Bangkok",
  description:
    "Contact SACRISTY Bangkok for bookings, collaborations, media and general inquiries.",
  canonical: "/contact",
});

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return <ContactPageClient settings={settings} />;
}
