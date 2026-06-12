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

interface EventsPageClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  settings: Record<string, string>;
}

const getLineupNames = (event: Event) => event.lineup
  ?.map(item => item.djName?.trim() || item.resident?.name)
  .filter((name): name is string => Boolean(name));

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
      <h2 className={compStyles.sectionTitle}>
        <span className="desk-label">Upcoming Sacristy Bangkok Events</span>
        <span className="mob-label">Upcoming Events</span>
      </h2>
      <div className={`${styles.eventsList} ${styles.eventsUpcomingList}`}>
        {upcomingEvents.length > 0 ? upcomingEvents.map(ev => (
          <div key={ev.id} className={styles.evRow} onClick={() => router.push(`/events/${ev.slug}`)}>
            <div className={styles.evThumbWrap}>
              <Image src={ev.posterUrl || '/video-poster.jpg'} alt={ev.title} width={220} height={275} className={styles.evThumb} />
            </div>
            <div className={styles.evInfo}>
              <div className={styles.evTitle}>{ev.displayTitle || ev.title}</div>
              <div className={styles.evDate}>{fmtDate(ev.eventDate.toISOString())}</div>
              <div className={styles.evLocationText}>{ev.location}</div>
              {getLineupNames(ev)?.length ? (
                <div className={styles.evDjs}>{getLineupNames(ev)?.join(" · ")}</div>
              ) : null}
            </div>
            <div className={styles.evPlus}>+</div>
          </div>
        )) : (
          <p style={{ color: 'rgba(255,255,255,0.3)', padding: '20px' }}>No upcoming events scheduled.</p>
        )}
      </div>

      <h2 className={compStyles.sectionTitle}>
        <span className="desk-label">Past Events — Bangkok Underground Archive</span>
        <span className="mob-label">Past Events</span>
      </h2>
      <div ref={pastListRef} className={styles.eventsList}>
        {pastEvents.slice(0, visiblePastCount).map(ev => (
          <div key={ev.id} className={`${styles.evRow} ${styles.evRowPast}`} onClick={() => router.push(`/events/${ev.slug}`)}>
            <div className={styles.evThumbWrap}>
              <Image src={ev.posterUrl || '/video-poster.jpg'} alt={ev.title} width={220} height={275} className={styles.evThumb} style={{ filter: 'grayscale(1)', opacity: 0.82 }} />
            </div>
            <div className={styles.evInfo}>
              <div className={styles.evTitle}>{ev.displayTitle || ev.title}</div>
              <div className={styles.evDate}>{fmtDate(ev.eventDate.toISOString())}</div>
              <div className={styles.evLocationText}>{ev.location}</div>
              {getLineupNames(ev)?.length ? (
                <div className={styles.evDjs}>{getLineupNames(ev)?.join(" · ")}</div>
              ) : null}
            </div>
            <div className={styles.evPlus}>+</div>
          </div>
        ))}
      </div>
      {visiblePastCount < pastEvents.length && (
        <div className={compStyles.seeMoreWrap} style={{ display: 'flex' }}>
          <button className={compStyles.seeMore} onClick={() => setVisiblePastCount(prev => prev + 3)}>See More</button>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <GuestInfoSection />
      </div>
    </Shell>
  );
}
