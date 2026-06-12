export const dynamic = "force-dynamic";

import { getResidents } from "@/services/resident.service";
import EventForm from "../EventForm";
import styles from "../Events.module.css";

export default async function NewEventPage() {
  const residents = await getResidents();

  return (
    <div>
      <h1 className={styles.title}>New Event</h1>
      <EventForm residents={residents} />
    </div>
  );
}
