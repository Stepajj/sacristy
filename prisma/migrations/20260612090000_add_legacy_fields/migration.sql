-- Preserve legacy SQLite fields that were present in events.db.
ALTER TABLE "Resident" ADD COLUMN "photoFull" TEXT;
ALTER TABLE "LineupItem" ADD COLUMN "residentSlug" TEXT;
