import Link from "next/link";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>SACRISTY ADMIN</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/events">Events</Link>
          <Link href="/admin/residents">Residents</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/logs">Activity Log</Link>
          <div className={styles.navSpacer} />
          <Link href="/" target="_blank" className={styles.viewSite}>View Site ↗</Link>
        </nav>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
