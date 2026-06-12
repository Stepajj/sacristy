import { prisma } from '@/lib/prisma';
import { ActivityLog } from '@/types';

/**
 * Returns latest activity logs.
 */
export const getLogs = async (limit: number = 50): Promise<ActivityLog[]> => {
  return prisma.activityLog.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
  }) as unknown as Promise<ActivityLog[]>;
};

/**
 * Creates a new entry in the activity log.
 */
export const logAction = async (action: string, details?: string): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        details,
      },
    });
  } catch (error) {
    console.error('[logAction] Failed to create log entry:', error);
  }
};
