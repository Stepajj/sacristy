import { prisma } from '@/lib/prisma';
import { Resident } from '@/types';
import { logAction } from './activity-log.service';
import { deleteFile } from '@/lib/storage/upload';

/**
 * Returns all residents sorted by name ascending.
 */
export const getResidents = async (): Promise<Resident[]> => {
  return prisma.resident.findMany({
    orderBy: {
      name: 'asc',
    },
  }) as unknown as Promise<Resident[]>;
};

/**
 * Returns a resident profile by slug with their associated events.
 */
export const getResidentBySlug = async (slug: string): Promise<Resident | null> => {
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
