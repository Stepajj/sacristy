import { getPublicSettings } from "@/services/settings.service";
import { ContactPageClient } from "./ContactPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - SACRISTY Bangkok",
  description: "Contact SACRISTY Bangkok for bookings, collaborations, media and general inquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <ContactPageClient settings={settings} />
  );
}
