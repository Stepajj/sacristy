import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEventBySlug,
  getArchiveEvents,
  getUpcomingEvents,
} from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvent } from "@/lib/adapters/event.adapter";
import { EventDetailPageClient } from "./EventDetailPageClient";
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
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getArchiveEvents(),
  ]);

  const slugs = new Set([...upcoming, ...past].map((event) => event.slug));

  return Array.from(slugs, (slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getPublicSettings(),
  ]);

  if (!event) {
    return {
      title: "Event Not Found - SACRISTY",
      robots: NOINDEX_ROBOTS,
    };
  }

  const title = `${event.title} — ${settings.seoTitle || "SACRISTY Bangkok"}`;
  const description =
    event.description?.substring(0, 160) ||
    settings.seoDescription ||
    `Hard techno event ${event.title} in Bangkok.`;

  return buildPageMetadata({
    title,
    description,
    canonical: `/events/${event.slug}`,
    image: event.posterUrl || undefined,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const [eventData, settings] = await Promise.all([
    getEventBySlug(slug),
    getPublicSettings(),
  ]);

  if (!eventData) notFound();

  const event = normalizeEvent(eventData);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.displayTitle || event.title,
    description: event.description || undefined,
    startDate: event.eventDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.posterUrl ? [toAbsoluteUrl(event.posterUrl)] : undefined,
    location: event.location
      ? { "@type": "Place", name: event.location }
      : undefined,
    offers: event.ticketLink
      ? {
          "@type": "Offer",
          url: event.ticketLink,
          availability: "https://schema.org/InStock",
        }
      : undefined,
    url: `${SITE_URL}/events/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: "SACRISTY Bangkok",
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: SITE_URL },
    { name: "Events", path: "/events" },
    { name: event.displayTitle || event.title, path: `/events/${event.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <EventDetailPageClient event={event} settings={settings} />
    </>
  );
}
