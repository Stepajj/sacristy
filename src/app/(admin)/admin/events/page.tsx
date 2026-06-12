export const dynamic = "force-dynamic";

import { getAllEventsAdmin } from "@/services/event.service";
import Link from "next/link";
import styles from "./Events.module.css";
import { fmtDate } from "@/features/home/components/EventCard";

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Events</h1>
        <Link href="/admin/events/new" className={styles.createBtn}>+ NEW EVENT</Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>TITLE</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.dateCell}>{fmtDate(event.eventDate)}</td>
                <td className={styles.titleCell}>
                  <strong>{event.title}</strong>
                  <span className={styles.slug}>/{event.slug}</span>
                </td>
                <td>{event.location}</td>
                <td>
                  <span className={event.isPublished ? styles.statusActive : styles.statusDraft}>
                    {event.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <Link href={`/admin/events/${event.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
