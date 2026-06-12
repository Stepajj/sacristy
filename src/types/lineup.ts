import { Resident } from './resident';

export interface LineupItem {
  id: number;
  eventId: number;
  residentId?: number | null;
  resident?: Resident | null;
  residentSlug?: string | null;
  djName?: string | null;
  djInstagram?: string | null;
  sortOrder: number;
}
