"use client";

import Link from "next/link";
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
  <article className={styles.eventsDetailView}>
    <button className={residentStyles.backBtn} onClick={onBack}>← All Events</button>
    <h1 className={styles.evDetailTitle}>{event.displayTitle || event.title}</h1>
    <div className={styles.evDetailDate}>{fmtDate(event.eventDate)}</div>
    <div className={styles.evDetailLocation}>{event.location}</div>
    {event.coords && (
      <div className={styles.evDetailCoords}>
        GPS:{" "}
        <a
          href={`https://www.google.com/maps?q=${event.coords}`}
          target="_blank"
          rel="noopener"
        >
          {event.coords}
        </a>
      </div>
    )}
    <div className={styles.evDetailLineup}>
      {event.lineup?.map((d, i) => {
        const residentSlug = d.resident?.slug || d.residentSlug;

        return residentSlug ? (
          <Link
            key={i}
            className={styles.evDetailDjLink}
            href={`/residents/${residentSlug}`}
            prefetch={false}
          >
            {d.djName}
          </Link>
        ) : (
          <span key={i} className={styles.evDetailDjLink}>{d.djName}</span>
        );
      })}
    </div>
    <p className={styles.evDetailDesc}>{event.description}</p>
    {event.ticketLink && (
      <a className={styles.evDetailTicket} href={event.ticketLink} target="_blank" rel="noopener">
        Tickets
      </a>
    )}
    <div style={{ marginTop: "24px", borderTop: "none" }}>
      <GuestInfoSection />
    </div>
  </article>
);
