"use client";

import { useState, useEffect, useRef } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/EventDetails.module.css";
import compStyles from "@/styles/Events.module.css";
import { fmtDate } from "@/features/home/components/EventCard";
import { GuestInfoSection } from "@/features/home/components/GuestInfoSection";
import { Event } from "@/types";
import { motion } from "framer-motion";

interface EventsPageClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  settings: Record<string, string>;
}

const getLineupNames = (event: Event) => event.lineup
  ?.map(item => item.djName?.trim() || item.resident?.name)
  .filter((name): name is string => Boolean(name));

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

interface EventRowProps {
  event: Event;
  isPast?: boolean;
  onNavigate: (slug: string) => void;
}

function EventRow({ event, isPast = false, onNavigate }: EventRowProps) {
  const href = `/events/${event.slug}`;
  const posterSrc = event.posterUrl || "/video-poster.jpg";

  const handleClick = (clickEvent: React.MouseEvent<HTMLAnchorElement>) => {
    if (clickEvent.ctrlKey || clickEvent.metaKey || clickEvent.shiftKey) return;
    clickEvent.preventDefault();
    onNavigate(event.slug);
  };

  return (
    <a
      href={href}
      className={`${styles.evRow} ${isPast ? styles.evRowPast : ""}`}
      onClick={handleClick}
    >
      <div className={styles.evThumbWrap}>
        <Image
          src={posterSrc}
          alt={event.title}
          width={220}
          height={275}
          sizes="(max-width: 768px) 77px, 220px"
          className={styles.evThumb}
          unoptimized={isUploadSrc(posterSrc)}
        />
      </div>

      <div className={styles.evInfo}>
        <div className={styles.evTitle}>{event.displayTitle || event.title}</div>
        <div className={styles.evDate}>{fmtDate(event.eventDate.toISOString())}</div>
        {event.location ? (
          <div className={styles.evLocationText}>{event.location}</div>
        ) : null}
        {getLineupNames(event)?.length ? (
          <div className={styles.evDjs}>{getLineupNames(event)?.join(" · ")}</div>
        ) : null}
      </div>

      <div className={styles.evPlus}>+</div>
    </a>
  );
}

function AnimatedItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.65,
        delay: index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function EventsPageClient({ upcomingEvents, pastEvents, settings }: EventsPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [visiblePastCount, setVisiblePastCount] = useState(3);
  const pastListRef = useRef<HTMLDivElement>(null);
  const previousPastCount = useRef(visiblePastCount);
  const router = useRouter();

  useEffect(() => {
    const consent = localStorage.getItem("sacristy_cookies");
    if (!consent) setCookieBannerVisible(true);
  }, []);

  useEffect(() => {
    const previousCount = previousPastCount.current;
    if (visiblePastCount > previousCount) {
      pastListRef.current?.children.item(previousCount)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    previousPastCount.current = visiblePastCount;
  }, [visiblePastCount]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

  const navigateToEvent = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  return (
    <Shell
      activeSection="events"
      isMobMenuOpen={isMobMenuOpen}
      setIsMobMenuOpen={setIsMobMenuOpen}
      isSignupActive={isSignupActive}
      isSignupVisible={isSignupVisible}
      setIsSignupVisible={setIsSignupVisible}
      setIsSignupActive={setIsSignupActive}
      cookieBannerVisible={cookieBannerVisible}
      onAcceptCookies={() => { localStorage.setItem("sacristy_cookies", "accepted"); setCookieBannerVisible(false); }}
      onDeclineCookies={() => { localStorage.setItem("sacristy_cookies", "declined"); setCookieBannerVisible(false); }}
      onReset={() => router.push("/")}
      onShowSection={(section) => router.push(`/${section}`)}
      onSignup={handleSignup}
      settings={settings}
    >
      <h1 className={compStyles.sectionTitle}>
        <span className="desk-label">Upcoming Sacristy Bangkok Events</span>
        <span className="mob-label">Upcoming Events</span>
      </h1>

      <div className={`${styles.eventsList} ${styles.eventsUpcomingList}`}>
        {upcomingEvents.length > 0 ? upcomingEvents.map((ev, index) => (
          <AnimatedItem key={ev.id} index={index}>
            <EventRow event={ev} onNavigate={navigateToEvent} />
          </AnimatedItem>
        )) : (
          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: "rgba(255,255,255,0.3)", padding: "20px" }}
          >
            No upcoming events scheduled.
          </motion.p>
        )}
      </div>

      <h2 className={compStyles.sectionTitle}>
        <span className="desk-label">Past Events — Bangkok Underground Archive</span>
        <span className="mob-label">Past Events</span>
      </h2>

      <div ref={pastListRef} className={styles.eventsList}>
        {pastEvents.slice(0, visiblePastCount).map((ev, index) => (
          <AnimatedItem key={ev.id} index={index + upcomingEvents.length + 2}>
            <EventRow event={ev} isPast onNavigate={navigateToEvent} />
          </AnimatedItem>
        ))}
      </div>

      {visiblePastCount < pastEvents.length && (
        <motion.div
          className={compStyles.seeMoreWrap}
          style={{ display: "flex" }}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className={compStyles.seeMore}
            onClick={() => setVisiblePastCount(prev => prev + 3)}
          >
            See More
          </button>
        </motion.div>
      )}

      <motion.div
        style={{ marginTop: "40px" }}
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <GuestInfoSection />
      </motion.div>
    </Shell>
  );
}