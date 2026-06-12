import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../sacristy/backend/events.db');
const UPLOADS_DIR = path.join(__dirname, '../../sacristy/backend/uploads');

async function audit() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('Legacy database not found');
    return;
  }

  const db = sqlite3(DB_PATH);
  const events = db.prepare('SELECT title, posterUrl FROM events').all() as any[];
  const residents = db.prepare('SELECT name, photo FROM residents').all() as any[];

  console.log('--- MEDIA AUDIT ---');
  
  const filesInUploads = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
  console.log(`Total files in legacy uploads: ${filesInUploads.length}`);

  const missingEvents: string[] = [];
  const usedByEvents = new Set<string>();
  events.forEach(e => {
    if (e.posterUrl) {
      const fileName = path.basename(e.posterUrl);
      usedByEvents.add(fileName);
      const fullPath = path.join(UPLOADS_DIR, fileName);
      if (!fs.existsSync(fullPath)) {
        missingEvents.push(`${e.title}: ${e.posterUrl}`);
      }
    }
  });

  const missingResidents: string[] = [];
  const usedByResidents = new Set<string>();
  residents.forEach(r => {
    if (r.photo) {
      const fileName = path.basename(r.photo);
      usedByResidents.add(fileName);
      const fullPath = path.join(UPLOADS_DIR, fileName);
      if (!fs.existsSync(fullPath)) {
        missingResidents.push(`${r.name}: ${r.photo}`);
      }
    }
  });

  console.log(`Files used by Events: ${usedByEvents.size}`);
  console.log(`Files used by Residents: ${usedByResidents.size}`);
  
  const totalMissing = missingEvents.length + missingResidents.length;
  console.log(`Total missing files: ${totalMissing}`);

  if (missingEvents.length > 0) {
    console.log('\nMissing Event Posters:');
    missingEvents.forEach(m => console.log(` - ${m}`));
  }

  if (missingResidents.length > 0) {
    console.log('\nMissing Resident Photos:');
    missingResidents.forEach(m => console.log(` - ${m}`));
  }

  const unusedFiles = filesInUploads.filter(f => !usedByEvents.has(f) && !usedByResidents.has(f));
  console.log(`\nUnused files in uploads: ${unusedFiles.length}`);

  db.close();
}

audit();
