import { prisma } from '@/lib/prisma';
import { Event, ArchiveArtist } from '@/types';
import { logAction } from './activity-log.service';
import { deleteFile } from '@/lib/storage/upload';

/**
 * Returns a unique list of artists who have played at events, grouped by year.
 */
export const getArtistArchive = async (): Promise<ArchiveArtist[]> => {
  const lineups = await prisma.lineupItem.findMany({
    include: {
      resident: true,
      event: {
        select: {
          eventDate: true,
        },
      },
    },
    orderBy: {
      event: {
        eventDate: 'desc',
      },
    },
  });

  const artistMap = new Map<string, { 
    name: string; 
    instagram: string; 
    years: Set<string>; 
    slug: string | null; 
    isResident: boolean 
  }>();

  lineups.forEach((item) => {
    const name = item.djName?.trim() || "";
    if (!name && !item.residentId) return;

    const finalName = item.residentId && item.resident ? item.resident.name : name;
    const key = finalName.toLowerCase();
    const year = item.event.eventDate.getFullYear().toString();

    if (!artistMap.has(key)) {
      artistMap.set(key, {
        name: finalName,
        instagram: item.djInstagram || '',
        years: new Set([year]),
        slug: item.resident ? item.resident.slug : null,
        isResident: !!item.residentId,
      });
    } else {
      const entry = artistMap.get(key)!;
      entry.years.add(year);
      if (item.djInstagram && !entry.instagram) entry.instagram = item.djInstagram;
      if (item.residentId && !entry.isResident) {
        entry.isResident = true;
        entry.slug = item.resident!.slug;
      }
    }
  });

  const artists: ArchiveArtist[] = Array.from(artistMap.values()).map((a) => ({
    name: a.name,
    instagram: a.instagram,
    years: Array.from(a.years).sort().reverse(),
    slug: a.slug,
    isResident: a.isResident,
  }));

  return artists.sort((a, b) => a.name.localeCompare(b.name));
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const now = new Date();
  return prisma.event.findMany({
    where: { isPublished: true, eventDate: { gte: now } },
    orderBy: { eventDate: 'asc' },
    include: { lineup: { include: { resident: true }, orderBy: { sortOrder: 'asc' } } },
  }) as unknown as Promise<Event[]>;
};

export const getArchiveEvents = async (limit?: number): Promise<Event[]> => {
  const now = new Date();
  return prisma.event.findMany({
    where: { isPublished: true, eventDate: { lt: now } },
    orderBy: { eventDate: 'desc' },
    take: limit,
    include: { lineup: { include: { resident: true }, orderBy: { sortOrder: 'asc' } } },
  }) as unknown as Promise<Event[]>;
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  return prisma.event.findUnique({
    where: { slug },
    include: { lineup: { include: { resident: true }, orderBy: { sortOrder: 'asc' } } },
  }) as unknown as Promise<Event | null>;
};

export const getEventById = async (id: number): Promise<Event | null> => {
  return prisma.event.findUnique({
    where: { id },
    include: { lineup: { include: { resident: true }, orderBy: { sortOrder: 'asc' } } },
  }) as unknown as Promise<Event | null>;
};

export const getEventsCount = async (): Promise<number> => {
  return prisma.event.count();
};

export const getLineupItemsCount = async (): Promise<number> => {
  return prisma.lineupItem.count();
};

export const getAllEventsAdmin = async (): Promise<Event[]> => {
  return prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    include: { lineup: { include: { resident: true }, orderBy: { sortOrder: 'asc' } } },
  }) as unknown as Promise<Event[]>;
};

const buildLineupCreateData = async (lineup: any[] = []) => {
  const items = [];

  for (const item of lineup) {
    let residentId = item.residentId || null;
    let residentSlug = item.residentSlug || null;

    if (residentId && !residentSlug) {
      const resident = await prisma.resident.findUnique({
        where: { id: Number(residentId) },
        select: { slug: true },
      });
      residentSlug = resident?.slug || null;
    }

    if (!residentId && residentSlug) {
      const resident = await prisma.resident.findUnique({
        where: { slug: residentSlug },
        select: { id: true },
      });
      residentId = resident?.id || null;
    }

    if (!residentId && item.djName) {
      const resident = await prisma.resident.findFirst({
        where: { name: { equals: item.djName.trim(), mode: 'insensitive' } },
        select: { id: true, slug: true },
      });
      residentId = resident?.id || null;
      residentSlug = residentSlug || resident?.slug || null;
    }

    items.push({
      residentId,
      residentSlug,
      djName: item.djName,
      djInstagram: item.djInstagram,
      sortOrder: item.sortOrder || 0,
    });
  }

  return items;
};

export const createEvent = async (data: any): Promise<Event> => {
  const { lineup, ...eventData } = data;
  const lineupData = await buildLineupCreateData(lineup || []);
  
  const event = await prisma.event.create({
    data: {
      ...eventData,
      lineup: {
        create: lineupData,
      },
    },
  });

  await logAction('CREATE_EVENT', `Created event: ${event.title} (${event.slug})`);
  return event as unknown as Event;
};

export const updateEvent = async (id: number, data: any): Promise<Event> => {
  const { lineup, ...eventData } = data;
  const lineupData = await buildLineupCreateData(lineup || []);

  // Get old event to check for poster change
  const oldEvent = await prisma.event.findUnique({ where: { id } });
  
  if (oldEvent?.posterUrl && oldEvent.posterUrl !== eventData.posterUrl && oldEvent.posterUrl.startsWith('/uploads')) {
    await deleteFile(oldEvent.posterUrl);
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...eventData,
      lineup: {
        deleteMany: {},
        create: lineupData,
      },
    },
  });

  await logAction('UPDATE_EVENT', `Updated event: ${event.title} (ID: ${id})`);
  return event as unknown as Event;
};

export const deleteEvent = async (id: number): Promise<void> => {
  const event = await prisma.event.findUnique({ where: { id } });
  
  if (event?.posterUrl && event.posterUrl.startsWith('/uploads')) {
    await deleteFile(event.posterUrl);
  }

  await prisma.event.delete({
    where: { id },
  });

  await logAction('DELETE_EVENT', `Deleted event: ${event?.title || 'Unknown'} (ID: ${id})`);
};
