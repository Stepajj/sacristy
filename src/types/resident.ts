import { LineupItem } from './lineup';

export interface Resident {
  id: number;
  slug: string;
  name: string;
  bio?: string | null;
  photo?: string | null;
  photoFull?: string | null;
  videoUrl?: string | null;
  instagramUrl?: string | null;
  soundcloudUrl?: string | null;
  raUrl?: string | null;
  soundcloudWidgetUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lineupItems?: LineupItem[];
}
