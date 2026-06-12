export interface ActivityLog {
  id: number;
  action: string;
  details?: string | null;
  timestamp: Date;
}
