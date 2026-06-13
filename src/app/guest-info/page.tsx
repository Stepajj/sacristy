import { getPublicSettings } from "@/services/settings.service";
import { GuestInfoPageClient } from "./GuestInfoPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Info & House Rules - SACRISTY Bangkok",
  description: "Guest information and house rules for SACRISTY Bangkok events.",
  alternates: { canonical: "/guest-info" },
};

export default async function GuestInfoPage() {
  const settings = await getPublicSettings();

  return (
    <GuestInfoPageClient settings={settings} />
  );
}
