"use client";

import { useRef } from "react";
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
  onSelectResident?: (resident: Resident) => void;
  events?: Event[];
  fading?: boolean;
}

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

export const ResidentsSection = ({
  residents,
  activeResident,
  onBack,
  onSelectResident,
  events = [],
  fading = false,
}: ResidentsSectionProps) => {
  const pointerStartRef = useRef<{
    slug: string;
    x: number;
    y: number;
    pointerType: string;
  } | null>(null);

  if (activeResident) {
    const residentEvents = events.filter(ev =>
      ev.lineup?.some(d =>
        d.residentId === activeResident.id ||
        d.residentSlug === activeResident.slug ||
        d.djName?.trim().toLowerCase() === activeResident.name.toLowerCase()
      )
    );

    return (
      <div
        className={`${styles.residentDetail} ${
          fading ? styles.residentDetailFading : ""
        }`}
        style={{ opacity: fading ? 0 : 1 }}
      >
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

          const openResident = () => {
            if (!onSelectResident) return;
            if (window.location.pathname === `/residents/${r.slug}`) return;

            onSelectResident(r);
          };

          const hasModifiedClick = (
            event:
              | React.MouseEvent<HTMLAnchorElement>
              | React.PointerEvent<HTMLAnchorElement>
          ) =>
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey;

          const handlePointerDown = (
            event: React.PointerEvent<HTMLAnchorElement>
          ) => {
            if (!onSelectResident) return;
            if (event.button !== 0 || hasModifiedClick(event)) return;

            pointerStartRef.current = {
              slug: r.slug,
              x: event.clientX,
              y: event.clientY,
              pointerType: event.pointerType,
            };

            if (event.pointerType === "mouse") {
              event.preventDefault();
              openResident();
            }
          };

          const handlePointerUp = (
            event: React.PointerEvent<HTMLAnchorElement>
          ) => {
            if (!onSelectResident) return;
            if (hasModifiedClick(event)) return;

            const start = pointerStartRef.current;
            pointerStartRef.current = null;

            if (!start || start.slug !== r.slug || start.pointerType === "mouse") {
              return;
            }

            const moved =
              Math.abs(event.clientX - start.x) > 8 ||
              Math.abs(event.clientY - start.y) > 8;

            if (moved) return;

            event.preventDefault();
            openResident();
          };

          const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (!onSelectResident) return;
            if (hasModifiedClick(event)) return;

            event.preventDefault();
            openResident();
          };

          return (
            <Link
              key={r.id}
              href={`/residents/${r.slug}`}
              prefetch={false}
              className={styles.residentCard}
              style={{ textDecoration: "none", color: "inherit" }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                pointerStartRef.current = null;
              }}
              onClick={handleClick}
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
