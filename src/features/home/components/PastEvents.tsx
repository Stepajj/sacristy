"use client";

import { useEffect, useRef } from "react";
import { Event } from "@/types/event";
import { EventCard } from "./EventCard";
import styles from "@/styles/Events.module.css";

interface PastEventsProps {
  events: Event[];
  visibleCount: number;
  onSeeMore: () => void;
}

export const PastEvents = ({ events, visibleCount, onSeeMore }: PastEventsProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const previousVisibleCount = useRef(visibleCount);

  useEffect(() => {
    const previousCount = previousVisibleCount.current;
    if (visibleCount > previousCount) {
      gridRef.current?.children.item(previousCount)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    previousVisibleCount.current = visibleCount;
  }, [visibleCount]);

  return (
    <>
    <div className={styles.pastEventsBlock}>
      <h2 className={styles.sectionTitle}>
        <span className="desk-label">Past Events — Bangkok Underground Archive</span>
        <span className="mob-label">Past Events</span>
      </h2>
    </div>
    <div className={styles.eventsGrid} ref={gridRef}>
      {events.slice(0, visibleCount).map(ev => (
        <EventCard key={ev.id} ev={ev} isArchive />
      ))}
    </div>
    {visibleCount < events.length && (
      <div className={styles.seeMoreWrap} style={{display:'flex'}}>
        <button className={styles.seeMore} onClick={onSeeMore}>See More</button>
      </div>
    )}
    </>
  );
};
