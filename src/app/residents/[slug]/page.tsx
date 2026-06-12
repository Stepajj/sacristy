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
    getPublicSettings()
  ]);
  
  if (!resident) return { title: "Resident Not Found — SACRISTY" };

  return {
    title: `${resident.name} — ${settings.seoTitle || 'SACRISTY Resident'}`,
    description: resident.bio?.substring(0, 160) || settings.seoDescription || `Profile of ${resident.name}, SACRISTY Bangkok resident.`,
  };
}

export default async function ResidentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [residentData, residentsData, upcomingEvents, settings] = await Promise.all([
    getResidentBySlug(slug),
    getResidents(),
    getUpcomingEvents(),
    getPublicSettings()
  ]);

  if (!residentData) {
    notFound();
  }

  const resident = normalizeResident(residentData);
  const residents = normalizeResidents(residentsData);

  return (
    <ResidentDetailPageClient 
      resident={resident} 
      residents={residents}
      upcomingEvents={upcomingEvents} 
      settings={settings}
    />
  );
}
