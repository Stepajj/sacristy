import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = [
    { key: 'seoTitle', value: 'SACRISTY Bangkok — Hard Techno Events' },
    { key: 'seoDescription', value: 'Underground hard techno events in Bangkok.' },
    { key: 'instagram', value: 'https://instagram.com/sacristy_bangkok' },
    { key: 'telegram', value: 'https://t.me/sacristy_bangkok' },
    { key: 'contactEmail', value: 'info@sacristy-bangkok.com' },
    { key: 'ra', value: 'https://ra.co/promoters/12345' },
  ];

  console.log('Seeding site settings...');

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(` - ${setting.key} set.`);
  }

  console.log('Settings seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
