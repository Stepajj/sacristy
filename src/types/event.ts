import { LineupItem } from './lineup';

export interface Event {
  id: number;
  slug: string;
  title: string;
  displayTitle?: string | null;
  eventDate: Date;
  location: string;
  mapsLink?: string | null;
  coords?: string | null;
  ticketLink?: string | null;
  racoLink?: string | null;
  posterUrl?: string | null;
  description?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lineup?: LineupItem[];
}

export interface EventData {
  upcoming: Event[];
  past: Event[];
}
