import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResidentBySlug, getResidents } from "@/services/resident.service";
import { getUpcomingEvents } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import {
  normalizeResident,
  normalizeResidents,
} from "@/lib/adapters/resident.adapter";
import { ResidentDetailPageClient } from "./ResidentDetailPageClient";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  NOINDEX_ROBOTS,
  SITE_URL,
  toAbsoluteUrl,
} from "@/lib/seo";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const residents = await getResidents();

  return residents.map((resident) => ({ slug: resident.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [resident, settings] = await Promise.all([
    getResidentBySlug(slug),
    getPublicSettings(),
  ]);

  if (!resident) {
    return {
      title: "Resident Not Found - SACRISTY",
      robots: NOINDEX_ROBOTS,
    };
  }

  const title = `${resident.name} — ${settings.seoTitle || "SACRISTY Resident"}`;
  const description =
    resident.bio?.substring(0, 160) ||
    settings.seoDescription ||
    `Profile of ${resident.name}, SACRISTY Bangkok resident.`;

  return buildPageMetadata({
    title,
    description,
    canonical: `/residents/${resident.slug}`,
    image: resident.photo || undefined,
    openGraphType: "profile",
  });
}

export default async function ResidentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [residentData, residentsData, upcomingEvents, settings] =
    await Promise.all([
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
    image: resident.photo ? toAbsoluteUrl(resident.photo) : undefined,
    url: `${SITE_URL}/residents/${resident.slug}`,
    sameAs: [resident.instagramUrl, resident.soundcloudUrl, resident.raUrl].filter(
      Boolean,
    ),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: SITE_URL },
    { name: "Residents", path: "/residents" },
    { name: resident.name, path: `/residents/${resident.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residentJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
