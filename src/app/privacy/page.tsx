import { getPublicSettings } from "@/services/settings.service";
import { PrivacyPageClient } from "./PrivacyPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SACRISTY Bangkok",
  description: "Privacy policy for the SACRISTY Bangkok website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getPublicSettings();

  return (
    <PrivacyPageClient settings={settings} />
  );
}
