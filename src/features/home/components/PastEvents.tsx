import { Event } from "@/types/event";
import { EventCard } from "./EventCard";
import { PastEventsReveal } from "./PastEventsReveal";
import styles from "@/styles/Events.module.css";

interface PastEventsProps {
  events: Event[];
}

export const PastEvents = ({ events }: PastEventsProps) => (
  <>
    <div className={styles.pastEventsBlock}>
      <h2 className={styles.sectionTitle}>
        <span className="desk-label">Past Events &mdash; Bangkok Underground Archive</span>
        <span className="mob-label">Past Events</span>
      </h2>
    </div>
    <div className={styles.eventsGrid} data-past-events-grid>
      {events.map((ev, index) => (
        <EventCard
          key={ev.id}
          ev={ev}
          isArchive
          hidden={index >= 3}
          deferImage={index >= 3}
          pastEventIndex={index}
        />
      ))}
    </div>
    <PastEventsReveal totalCount={events.length} />
  </>
);
