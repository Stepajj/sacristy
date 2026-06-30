import Image from "next/image";
import { Event } from "@/types/event";
import styles from "@/styles/Events.module.css";

interface EventCardProps {
  ev: Event;
  featured?: boolean;
  isArchive?: boolean;
  hidden?: boolean;
  deferImage?: boolean;
  pastEventIndex?: number;
}

export const fmtDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return String(d.getDate()).padStart(2, "0") + " " + m[d.getMonth()] + " " + d.getFullYear();
};

const EMPTY_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export const EventCard = ({
  ev,
  featured,
  isArchive,
  hidden,
  deferImage,
  pastEventIndex,
}: EventCardProps) => (
  <article
    className={`${styles.posterCard} ${isArchive ? styles.archive : ""}`}
    hidden={hidden}
    data-past-event={pastEventIndex === undefined ? undefined : ""}
    data-past-event-index={pastEventIndex}
  >
    <div className={styles.posterWrap}>
      <a href={(isArchive ? ev.racoLink || ev.ticketLink : ev.ticketLink) || "#"} target="_blank" rel="noopener">
        {deferImage ? (
          // Deferred past-event posters are hydrated from data-src by PastEventsReveal.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={EMPTY_IMAGE}
            data-src={ev.posterUrl || "/og-image.jpg"}
            alt={ev.title}
            width={400}
            height={500}
            className={styles.poster}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Image
            src={ev.posterUrl || "/og-image.jpg"}
            alt={ev.title}
            width={400}
            height={500}
            className={styles.poster}
            priority={featured}
            sizes="(max-width: 768px) 108px, (max-width: 1180px) 20vw, 13vw"
          />
        )}
      </a>
    </div>
    {!isArchive && ev.ticketLink && (
      <a className={styles.ticketRow} href={ev.ticketLink} target="_blank" rel="noopener">
        <span className={styles.ticketIcon}></span> Tickets
      </a>
    )}
    <div className={styles.meta}>
      {ev.ticketLink ? (
        <a className={styles.title} href={ev.ticketLink} target="_blank" rel="noopener">
          {ev.displayTitle || ev.title}
        </a>
      ) : (
        <div className={styles.title}>{ev.displayTitle || ev.title}</div>
      )}
      <div className={styles.info}>
        {fmtDate(ev.eventDate)} <br /> {ev.location}
      </div>

      {!isArchive && ev.ticketLink ? (
        <a className={styles.mobTicketBtn} href={ev.ticketLink} target="_blank" rel="noopener">
          Tickets
        </a>
      ) : !isArchive ? (
        <span className={styles.mobTicketBtn}>Coming Soon</span>
      ) : null}
    </div>
  </article>
);
