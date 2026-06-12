export const dynamic = "force-dynamic";

import { getLogs } from "@/services/activity-log.service";
import styles from "../Admin.module.css";

export default async function AdminLogsPage() {
  const logs = await getLogs(100);

  return (
    <div>
      <h1 className={styles.title}>Activity Log</h1>
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
  );
}
