import { AboutPageClient } from "./AboutPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - SACRISTY Bangkok",
  description: "Explore the visual archive of SACRISTY Bangkok.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
