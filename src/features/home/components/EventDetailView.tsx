import Image from "next/image";
import styles from "@/styles/EventDetails.module.css";
import residentStyles from "@/styles/Residents.module.css";
import { Event } from "@/types/event";
import { fmtDate } from "./EventCard";
import { GuestInfoSection } from "./GuestInfoSection";

interface EventDetailViewProps {
  event: Event;
  onBack: () => void;
}

export const EventDetailView = ({ event, onBack }: EventDetailViewProps) => (
  <div className={styles.eventsDetailView}>
    <button className={residentStyles.backBtn} onClick={onBack}>← All Events</button>
    <div className={styles.evDetailTitle}>{event.displayTitle || event.title}</div>
    <div className={styles.evDetailDate}>{fmtDate(event.eventDate)}</div>
    <div className={styles.evDetailLocation}>{event.location}</div>
    {event.coords && <div className={styles.evDetailCoords}>GPS: <a href={`https://www.google.com/maps?q=${event.coords}`} target="_blank">{event.coords}</a></div>}
    <div className={styles.evDetailLineup}>
      {event.lineup?.map((d, i) => {
        const residentSlug = d.resident?.slug || d.residentSlug;

        return residentSlug ? (
          <a key={i} className={styles.evDetailDjLink} href={`/residents/${residentSlug}`}>{d.djName}</a>
        ) : (
          <span key={i} className={styles.evDetailDjLink}>{d.djName}</span>
        );
      })}
    </div>
    <div className={styles.evDetailDesc}>{event.description}</div>
    {event.ticketLink && (
      <a className={styles.evDetailTicket} href={event.ticketLink} target="_blank" rel="noopener">
        Tickets
      </a>
    )}
    <div style={{marginTop: '24px', borderTop: 'none'}}>
      <GuestInfoSection />
    </div>
  </div>
);
