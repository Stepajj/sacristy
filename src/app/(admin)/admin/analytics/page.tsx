export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import styles from "../events/Events.module.css";

type DayRow = {
  day: string;
  n: number;
};

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateWindow(days: number) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const rows: DayRow[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    rows.push({ day: toDayKey(cursor), n: 0 });
  }

  return { start, rows };
}

function getSourceLabel(referrer: string | null) {
  if (!referrer) return "Direct";

  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

export default async function AdminAnalyticsPage() {
  const { start, rows } = getDateWindow(30);
  const visits = await prisma.analytics.findMany({
    where: { timestamp: { gte: start } },
    select: { page: true, referrer: true, ipHash: true, timestamp: true },
    orderBy: { timestamp: "asc" },
  });

  const byDayMap = new Map(rows.map((row) => [row.day, row.n]));
  const byPageMap = new Map<string, number>();
  const byRefMap = new Map<string, number>();
  const uniqueIps = new Set<string>();
  const today = toDayKey(new Date());
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  let todayCount = 0;
  let weekCount = 0;

  for (const visit of visits) {
    const day = toDayKey(visit.timestamp);
    byDayMap.set(day, (byDayMap.get(day) || 0) + 1);
    byPageMap.set(visit.page, (byPageMap.get(visit.page) || 0) + 1);
    byRefMap.set(getSourceLabel(visit.referrer), (byRefMap.get(getSourceLabel(visit.referrer)) || 0) + 1);

    if (visit.ipHash) uniqueIps.add(visit.ipHash);
    if (day === today) todayCount += 1;
    if (visit.timestamp >= weekAgo) weekCount += 1;
  }

  const byDay = rows.map((row) => ({ day: row.day, n: byDayMap.get(row.day) || 0 }));
  const maxDay = Math.max(...byDay.map((row) => row.n), 1);
  const byPage = Array.from(byPageMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const byRef = Array.from(byRefMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const mid = byDay[Math.floor(byDay.length / 2)];
  const hasVisits = visits.length > 0;

  return (
    <div>
      <h1 className={styles.title}>Analytics</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Views (30d)</div>
          <div className={styles.statNum}>{hasVisits ? visits.length : "-"}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Unique Visitors (30d)</div>
          <div className={styles.statNum}>{uniqueIps.size ? uniqueIps.size : "-"}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Today</div>
          <div className={styles.statNum}>{hasVisits ? todayCount : "-"}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>This Week</div>
          <div className={styles.statNum}>{hasVisits ? weekCount : "-"}</div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <div className={styles.chartTitle}>Daily Views - Last 30 Days</div>
        <div className={styles.chartBars}>
          {hasVisits ? (
            byDay.map((row) => (
              <div
                key={row.day}
                className={styles.chartBar}
                data-n={row.n}
                title={`${row.day}: ${row.n} views`}
                style={{ height: `${Math.max(4, (row.n / maxDay) * 100)}%` }}
              />
            ))
          ) : (
            <span className={styles.noData}>-</span>
          )}
        </div>
        <div className={styles.chartDates}>
          <span>{hasVisits ? byDay[0]?.day.slice(5) || "-" : "-"}</span>
          <span>{hasVisits ? mid?.day.slice(5) || "-" : "-"}</span>
          <span>{hasVisits ? byDay[byDay.length - 1]?.day.slice(5) || "-" : "-"}</span>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.chartWrap}>
          <div className={styles.chartTitle}>Top Pages</div>
          <ul className={styles.pagesList}>
            {byPage.length ? (
              byPage.map(([page, count]) => (
                <li key={page}>
                  <span>{page}</span>
                  <span>{count}</span>
                </li>
              ))
            ) : (
              <li>
                <span>-</span>
                <span>-</span>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.chartWrap}>
          <div className={styles.chartTitle}>Traffic Sources</div>
          <ul className={styles.refsList}>
            {byRef.length ? (
              byRef.map(([referrer, count]) => (
                <li key={referrer}>
                  <span>{referrer}</span>
                  <span>{count}</span>
                </li>
              ))
            ) : (
              <li>
                <span>-</span>
                <span>-</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
