import { prisma } from '@/lib/prisma';

interface TrackPageViewParams {
  page: string;
  referrer?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}

/**
 * Records a single page view in the analytics table.
 */
export const trackPageView = async ({
  page,
  referrer,
  ipHash,
  userAgent,
}: TrackPageViewParams): Promise<void> => {
  try {
    await prisma.analytics.create({
      data: {
        page,
        referrer,
        ipHash,
        userAgent,
      },
    });
  } catch (error) {
    // Log error but don't fail the request (analytics is non-critical)
    console.error('[trackPageView] Failed to record visit:', error);
  }
};
