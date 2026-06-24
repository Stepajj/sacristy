"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Residents.module.css";
import compStyles from "@/styles/Events.module.css";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import { EventCard } from "./EventCard";

interface ResidentsSectionProps {
  residents: Resident[];
  activeResident: Resident | null;
  onBack: () => void;
  events?: Event[];
  fading?: boolean;
}

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

export const ResidentsSection = ({ residents, activeResident, onBack, events = [], fading = false }: ResidentsSectionProps) => {
  if (activeResident) {
    const residentEvents = events.filter(ev =>
      ev.lineup?.some(d =>
        d.residentId === activeResident.id ||
        d.residentSlug === activeResident.slug ||
        d.djName?.trim().toLowerCase() === activeResident.name.toLowerCase()
      )
    );

    return (
      <div className={`${styles.residentDetail} ${fading ? styles.residentDetailFading : ""}`}>
        <button className={styles.backBtn} onClick={onBack}>
          ← All Residents
        </button>

        <h1 className={styles.rdName}>{activeResident.name}</h1>

        <div className={styles.rdBio}>{activeResident.bio}</div>

        <div className={styles.rdLinks}>
          {activeResident.instagramUrl && (
            <a href={activeResident.instagramUrl} className={styles.resLink} target="_blank" rel="noopener">
              Instagram
            </a>
          )}

          {activeResident.soundcloudUrl && (
            <a href={activeResident.soundcloudUrl} className={styles.resLink} target="_blank" rel="noopener">
              SoundCloud
            </a>
          )}
        </div>

        {activeResident.soundcloudWidgetUrl && (
          <iframe
            src={activeResident.soundcloudWidgetUrl}
            style={{ width: "100%", border: "none", height: "300px", marginTop: "20px" }}
            allow="autoplay"
            scrolling="no"
            frameBorder="no"
          />
        )}

        {residentEvents.length > 0 && (
          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
            <div
              style={{
                fontSize: "8px",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                color: "rgba(220, 220, 220, .3)",
                marginBottom: "16px",
              }}
            >
              Upcoming with {activeResident.name.toUpperCase()} at Sacristy Bangkok
            </div>

            <div className={compStyles.eventsGrid}>
              {residentEvents.map((ev) => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <h1 className={compStyles.sectionTitle}>Sacristy Residents</h1>

      <div>
        {residents.map((r) => {
          const photoSrc = r.photo || "/video-poster.jpg";

          return (
            <Link
              key={r.id}
              href={`/residents/${r.slug}`}
              className={styles.residentCard}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Image
                src={photoSrc}
                alt={r.name}
                width={138}
                height={173}
                sizes="138px"
                className={styles.residentThumb}
                unoptimized={isUploadSrc(photoSrc)}
              />

              <div className={styles.residentInfo}>
                <div className={styles.residentName}>{r.name}</div>
                <div className={styles.resPlus}>+</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};
