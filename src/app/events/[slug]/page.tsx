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
    getPublicSettings()
  ]);
  
  if (!event) return { title: "Event Not Found — SACRISTY" };

  return {
    title: `${event.title} — ${settings.seoTitle || 'SACRISTY Bangkok'}`,
    description: event.description?.substring(0, 160) || settings.seoDescription || `Hard techno event ${event.title} in Bangkok.`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const [eventData, settings] = await Promise.all([
    getEventBySlug(slug),
    getPublicSettings()
  ]);

  if (!eventData) {
    notFound();
  }

  const event = normalizeEvent(eventData);

  return (
    <EventDetailPageClient event={event} settings={settings} />
  );
}
