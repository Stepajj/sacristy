export interface Analytics {
  id: number;
  page: string;
  referrer?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
  timestamp: Date;
}
