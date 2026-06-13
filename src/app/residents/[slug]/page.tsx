import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResidentBySlug, getResidents } from "@/services/resident.service";
import { getUpcomingEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeResident, normalizeResidents } from "@/lib/adapters/resident.adapter";
import { ResidentDetailPageClient } from "./ResidentDetailPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [resident, settings] = await Promise.all([
    getResidentBySlug(slug),
    getPublicSettings(),
  ]);

  if (!resident) return { title: "Resident Not Found - SACRISTY" };

  const description = resident.bio?.substring(0, 160)
    || settings.seoDescription
    || `Profile of ${resident.name}, SACRISTY Bangkok resident.`;

  return {
    title: `${resident.name} \u2014 ${settings.seoTitle || "SACRISTY Resident"}`,
    description,
    alternates: { canonical: `/residents/${resident.slug}` },
    openGraph: {
      type: "profile",
      url: `/residents/${resident.slug}`,
      title: resident.name,
      description,
      images: resident.photo ? [{ url: resident.photo, alt: resident.name }] : undefined,
    },
  };
}

export default async function ResidentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [residentData, residentsData, upcomingEvents, settings] = await Promise.all([
    getResidentBySlug(slug),
    getResidents(),
    getUpcomingEvents(),
    getPublicSettings(),
  ]);

  if (!residentData) notFound();

  const resident = normalizeResident(residentData);
  const residents = normalizeResidents(residentsData);
  const residentJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resident.name,
    description: resident.bio || undefined,
    image: resident.photo ? `https://sacristybangkok.com${resident.photo}` : undefined,
    url: `https://sacristybangkok.com/residents/${resident.slug}`,
    sameAs: [resident.instagramUrl, resident.soundcloudUrl, resident.raUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residentJsonLd) }}
      />
      <ResidentDetailPageClient
        resident={resident}
        residents={residents}
        upcomingEvents={upcomingEvents}
        settings={settings}
      />
    </>
  );
}
