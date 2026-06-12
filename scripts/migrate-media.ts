import path from 'path';
import fs from 'fs';

const LEGACY_UPLOADS_DIR = path.join(__dirname, '../../sacristy/backend/uploads');
const NEW_UPLOADS_DIR = path.join(__dirname, '../public/uploads');

async function migrate() {
  console.log('--- MEDIA MIGRATION ---');

  if (!fs.existsSync(LEGACY_UPLOADS_DIR)) {
    console.error(`Legacy uploads directory not found at ${LEGACY_UPLOADS_DIR}`);
    return;
  }

  if (!fs.existsSync(NEW_UPLOADS_DIR)) {
    console.log(`Creating new uploads directory at ${NEW_UPLOADS_DIR}`);
    fs.mkdirSync(NEW_UPLOADS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(LEGACY_UPLOADS_DIR);
  let copied = 0;
  let skipped = 0;
  let errors = 0;

  files.forEach(file => {
    const src = path.join(LEGACY_UPLOADS_DIR, file);
    const dest = path.join(NEW_UPLOADS_DIR, file);

    try {
      if (fs.existsSync(dest)) {
        console.log(`[SKIP] ${file} already exists`);
        skipped++;
      } else {
        fs.copyFileSync(src, dest);
        console.log(`[OK] Copied ${file}`);
        copied++;
      }
    } catch (e) {
      console.error(`[ERROR] Failed to copy ${file}:`, e);
      errors++;
    }
  });

  console.log('\n--- MIGRATION SUMMARY ---');
  console.log(`Total files processed: ${files.length}`);
  console.log(`Copied: ${copied}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log('-------------------------\n');
}

migrate();
