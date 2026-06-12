import { PrismaClient } from '@prisma/client';
import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const LEGACY_DB_PATH = path.join(__dirname, '../../sacristy/backend/events.db');

const parseDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

async function main() {
  const args = process.argv.slice(2);
  const truncate = args.includes('--truncate');

  if (!fs.existsSync(LEGACY_DB_PATH)) {
    console.error(`Legacy database not found at ${LEGACY_DB_PATH}`);
    process.exit(1);
  }

  const db = sqlite3(LEGACY_DB_PATH);

  if (truncate) {
    console.log('Truncating existing data...');
    await prisma.lineupItem.deleteMany();
    await prisma.event.deleteMany();
    await prisma.resident.deleteMany();
    console.log('Data cleared.');
  }

  // 1. Migrate Residents
  console.log('Migrating residents...');
  const legacyResidents = db.prepare('SELECT * FROM residents').all() as any[];
  
  for (const res of legacyResidents) {
    await prisma.resident.upsert({
      where: { slug: res.slug },
      update: {
        name: res.name,
        bio: res.bio,
        photo: res.photo,
        photoFull: res.photoFull,
        videoUrl: res.videoUrl,
        instagramUrl: res.instagramUrl,
        soundcloudUrl: res.soundcloudUrl,
        raUrl: res.raUrl,
        soundcloudWidgetUrl: res.soundcloudWidgetUrl,
        createdAt: parseDate(res.createdAt),
      },
      create: {
        slug: res.slug,
        name: res.name,
        bio: res.bio,
        photo: res.photo,
        photoFull: res.photoFull,
        videoUrl: res.videoUrl,
        instagramUrl: res.instagramUrl,
        soundcloudUrl: res.soundcloudUrl,
        raUrl: res.raUrl,
        soundcloudWidgetUrl: res.soundcloudWidgetUrl,
        createdAt: parseDate(res.createdAt),
      },
    });
  }
  console.log(`Migrated ${legacyResidents.length} residents.`);

  // 2. Migrate Events
  console.log('Migrating events...');
  const legacyEvents = db.prepare('SELECT * FROM events').all() as any[];
  const residents = await prisma.resident.findMany();
  const residentsMap = new Map(residents.map(r => [r.slug, r.id]));
  const residentNameMap = new Map(residents.map(r => [r.name.toLowerCase(), r]));

  for (const ev of legacyEvents) {
    let eventDate: Date;
    try {
      eventDate = new Date(ev.eventDate);
      if (isNaN(eventDate.getTime())) throw new Error('Invalid date');
    } catch (e) {
      eventDate = new Date();
    }

    const newEvent = await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {
        title: ev.title,
        displayTitle: ev.displayTitle,
        eventDate: eventDate,
        location: ev.location,
        mapsLink: ev.mapsLink,
        coords: ev.coords,
        posterUrl: ev.posterUrl,
        ticketLink: ev.ticketLink,
        racoLink: ev.racoLink,
        description: ev.description,
        isPublished: true, 
        createdAt: parseDate(ev.createdAt),
      },
      create: {
        slug: ev.slug,
        title: ev.title,
        displayTitle: ev.displayTitle,
        eventDate: eventDate,
        location: ev.location,
        mapsLink: ev.mapsLink,
        coords: ev.coords,
        posterUrl: ev.posterUrl,
        ticketLink: ev.ticketLink,
        racoLink: ev.racoLink,
        description: ev.description,
        isPublished: true,
        createdAt: parseDate(ev.createdAt),
      },
    });

    const legacyLineup = db.prepare('SELECT * FROM event_lineup WHERE eventId = ?').all(ev.id) as any[];
    
    // Always refresh lineup to ensure correct residentId links
    await prisma.lineupItem.deleteMany({ where: { eventId: newEvent.id } });

    for (const item of legacyLineup) {
      const matchedResident = item.residentSlug
        ? null
        : residentNameMap.get((item.djName || '').trim().toLowerCase());
      const residentId = residentsMap.get(item.residentSlug) || matchedResident?.id || null;
      
      await prisma.lineupItem.create({
        data: {
          eventId: newEvent.id,
          residentId,
          residentSlug: item.residentSlug || '',
          djName: item.djName,
          djInstagram: item.djInstagram,
          sortOrder: item.sortOrder || 0,
        },
      });
    }
  }
  
  const finalEventsCount = await prisma.event.count();
  const finalResidentsCount = await prisma.resident.count();
  const finalLineupCount = await prisma.lineupItem.count();
  const legacyLineupCount = db.prepare('SELECT COUNT(*) as n FROM event_lineup').get() as any;

  console.log('\n--- MIGRATION SUMMARY ---');
  console.log(`Events: ${finalEventsCount} (Legacy: ${legacyEvents.length})`);
  console.log(`Residents: ${finalResidentsCount} (Legacy: ${legacyResidents.length})`);
  console.log(`Lineup Items: ${finalLineupCount} (Legacy: ${legacyLineupCount.n})`);
  console.log('-------------------------\n');

  db.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
