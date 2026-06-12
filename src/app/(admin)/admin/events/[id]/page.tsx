import { getEventById } from "@/services/event.service";
import { getResidents } from "@/services/resident.service";
import { notFound } from "next/navigation";
import EventForm from "../EventForm";
import styles from "../Events.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const [event, residents] = await Promise.all([
    getEventById(parseInt(id)),
    getResidents()
  ]);

  if (!event) notFound();

  return (
    <div>
      <h1 className={styles.title}>Edit Event</h1>
      <EventForm initialData={event} residents={residents} />
    </div>
  );
}
