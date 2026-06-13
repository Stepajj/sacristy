import { prisma } from '@/lib/prisma';
import { Resident } from '@/types';
import { logAction } from './activity-log.service';
import { deleteFile } from '@/lib/storage/upload';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';

/**
 * Returns all residents sorted by name ascending.
 */
const getResidentsUncached = async (): Promise<Resident[]> => {
  return prisma.resident.findMany({
    orderBy: {
      name: 'asc',
    },
  }) as unknown as Promise<Resident[]>;
};

export const getResidents = unstable_cache(
  getResidentsUncached,
  ['public-residents'],
  { revalidate: 300, tags: [CACHE_TAGS.residents] },
);

/**
 * Returns a resident profile by slug with their associated events.
 */
const getResidentBySlugUncached = async (slug: string): Promise<Resident | null> => {
  return prisma.resident.findUnique({
    where: { slug },
    include: {
      lineup: {
        where: {
          event: {
            isPublished: true,
          },
        },
        include: {
          event: true,
        },
        orderBy: {
          event: {
            eventDate: 'desc',
          },
        },
      },
    },
  }) as unknown as Promise<Resident | null>;
};

export const getResidentBySlug = unstable_cache(
  getResidentBySlugUncached,
  ['resident-by-slug'],
  { revalidate: 300, tags: [CACHE_TAGS.residents, CACHE_TAGS.events] },
);

export const getResidentById = async (id: number): Promise<Resident | null> => {
  return prisma.resident.findUnique({
    where: { id },
  }) as unknown as Promise<Resident | null>;
};

export const getResidentsCount = async (): Promise<number> => {
  return prisma.resident.count();
};

export const createResident = async (data: any): Promise<Resident> => {
  const resident = await prisma.resident.create({
    data,
  });

  await logAction('CREATE_RESIDENT', `Created resident: ${resident.name} (${resident.slug})`);
  return resident as unknown as Resident;
};

export const updateResident = async (id: number, data: any): Promise<Resident> => {
  // Get old resident to check for photo change
  const oldResident = await prisma.resident.findUnique({ where: { id } });
  
  if (oldResident?.photo && oldResident.photo !== data.photo && oldResident.photo.startsWith('/uploads')) {
    await deleteFile(oldResident.photo);
  }

  const resident = await prisma.resident.update({
    where: { id },
    data,
  });

  await logAction('UPDATE_RESIDENT', `Updated resident: ${resident.name} (ID: ${id})`);
  return resident as unknown as Resident;
};

export const deleteResident = async (id: number): Promise<void> => {
  const resident = await prisma.resident.findUnique({ where: { id } });
  
  if (resident?.photo && resident.photo.startsWith('/uploads')) {
    await deleteFile(resident.photo);
  }

  await prisma.resident.delete({
    where: { id },
  });

  await logAction('DELETE_RESIDENT', `Deleted resident: ${resident?.name || 'Unknown'} (ID: ${id})`);
};
