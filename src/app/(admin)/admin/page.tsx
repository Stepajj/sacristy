export const dynamic = "force-dynamic";

import { getEventsCount, getLineupItemsCount } from "@/services/event.service";
import { getResidentsCount } from "@/services/resident.service";
import { getLogs } from "@/services/activity-log.service";
import styles from "./Admin.module.css";

export default async function AdminDashboardPage() {
  const [eventsCount, residentsCount, lineupCount, logs] = await Promise.all([
    getEventsCount(),
    getResidentsCount(),
    getLineupItemsCount(),
    getLogs(10)
  ]);

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>EVENTS</span>
          <span className={styles.statValue}>{eventsCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>RESIDENTS</span>
          <span className={styles.statValue}>{residentsCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>LINEUP ITEMS</span>
          <span className={styles.statValue}>{lineupCount}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>LATEST ACTIVITY</h2>
        <div className={styles.logsTable}>
          {logs.map((log) => (
            <div key={log.id} className={styles.logRow}>
              <span className={styles.logTime}>
                {log.timestamp.toLocaleString('en-GB', { 
                  day: '2-digit', month: '2-digit', year: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                })}
              </span>
              <span className={styles.logAction}>{log.action}</span>
              <span className={styles.logDetails}>{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
