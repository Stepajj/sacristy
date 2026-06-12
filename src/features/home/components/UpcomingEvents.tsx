import { Event } from "@/types/event";
import { EventCard } from "./EventCard";
import styles from "@/styles/Events.module.css";

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents = ({ events }: UpcomingEventsProps) => (
  <>
    <h1 className={styles.sectionTitle} id="home-events">
      <span className="desk-label">Upcoming Techno Events in Bangkok</span>
      <span className="mob-label">Upcoming Events</span>
    </h1>
    <div className={styles.eventsGrid}>
      {events.map((ev, i) => (
        <EventCard key={ev.id} ev={ev} featured={i === 0} />
      ))}
    </div>
  </>
);
