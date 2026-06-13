import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';

/**
 * Returns a single setting value by its key.
 */
export const getSetting = async (key: string): Promise<string | null> => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key },
  });
  return setting?.value ?? null;
};

/**
 * Returns multiple settings by their keys as an object mapping keys to values.
 */
export const getSettings = async (keys: string[]): Promise<Record<string, string>> => {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: { in: keys },
    },
  });
  
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Returns all public settings relevant for the frontend layout and contact.
 */
const getPublicSettingsUncached = async (): Promise<Record<string, string>> => {
  const publicKeys = [
    'instagram',
    'telegram',
    'youtube',
    'soundcloud',
    'ra',
    'contactEmail',
    'contactPhone',
    'seoTitle',
    'seoDescription',
  ];
  
  return getSettings(publicKeys);
};

export const getPublicSettings = unstable_cache(
  getPublicSettingsUncached,
  ['public-settings'],
  { revalidate: 3600, tags: [CACHE_TAGS.settings] },
);

export const updateSetting = async (key: string, value: string): Promise<void> => {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
