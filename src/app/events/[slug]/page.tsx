import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/services/event.service";
import { getPublicSettings } from "@/services/settings.service";
import { normalizeEvent } from "@/lib/adapters/event.adapter";
import { EventDetailPageClient } from "./EventDetailPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getPublicSettings(),
  ]);

  if (!event) return { title: "Event Not Found - SACRISTY" };

  const description = event.description?.substring(0, 160)
    || settings.seoDescription
    || `Hard techno event ${event.title} in Bangkok.`;

  return {
    title: `${event.title} \u2014 ${settings.seoTitle || "SACRISTY Bangkok"}`,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: "website",
      url: `/events/${event.slug}`,
      title: event.title,
      description,
      images: event.posterUrl ? [{ url: event.posterUrl, alt: event.title }] : undefined,
    },
  };
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
    image: event.posterUrl ? [`https://sacristybangkok.com${event.posterUrl}`] : undefined,
    location: event.location ? { "@type": "Place", name: event.location } : undefined,
    offers: event.ticketLink ? {
      "@type": "Offer",
      url: event.ticketLink,
      availability: "https://schema.org/InStock",
    } : undefined,
    url: `https://sacristybangkok.com/events/${event.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <EventDetailPageClient event={event} settings={settings} />
    </>
  );
}
