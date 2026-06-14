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
import { motion, Variants } from "framer-motion";

interface EventsPageClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  settings: Record<string, string>;
}

const getLineupNames = (event: Event) => event.lineup
  ?.map(item => item.djName?.trim() || item.resident?.name)
  .filter((name): name is string => Boolean(name));

const pageVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};

const eventRowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const subtleItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1 className={compStyles.sectionTitle} variants={blockVariants}>
          <span className="desk-label">Upcoming Sacristy Bangkok Events</span>
          <span className="mob-label">Upcoming Events</span>
        </motion.h1>

        <motion.div
          className={`${styles.eventsList} ${styles.eventsUpcomingList}`}
          variants={listVariants}
        >
          {upcomingEvents.length > 0 ? upcomingEvents.map(ev => (
            <motion.div
              key={ev.id}
              className={styles.evRow}
              onClick={() => router.push(`/events/${ev.slug}`)}
              variants={eventRowVariants}
              whileHover={{
                y: -3,
                scale: 1.008,
                transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.992,
                transition: { duration: 0.12 },
              }}
            >
              <motion.div
                className={styles.evThumbWrap}
                variants={subtleItemVariants}
                whileHover={{
                  scale: 1.015,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <Image
                  src={ev.posterUrl || "/video-poster.jpg"}
                  alt={ev.title}
                  width={220}
                  height={275}
                  sizes="(max-width: 768px) 77px, 220px"
                  className={styles.evThumb}
                />
              </motion.div>

              <motion.div className={styles.evInfo} variants={subtleItemVariants}>
                <motion.div className={styles.evTitle} variants={subtleItemVariants}>
                  {ev.displayTitle || ev.title}
                </motion.div>
                <motion.div className={styles.evDate} variants={subtleItemVariants}>
                  {fmtDate(ev.eventDate.toISOString())}
                </motion.div>
                <motion.div className={styles.evLocationText} variants={subtleItemVariants}>
                  {ev.location}
                </motion.div>
                {getLineupNames(ev)?.length ? (
                  <motion.div className={styles.evDjs} variants={subtleItemVariants}>
                    {getLineupNames(ev)?.join(" · ")}
                  </motion.div>
                ) : null}
              </motion.div>

              <motion.div
                className={styles.evPlus}
                variants={subtleItemVariants}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                +
              </motion.div>
            </motion.div>
          )) : (
            <motion.p
              variants={blockVariants}
              style={{ color: "rgba(255,255,255,0.3)", padding: "20px" }}
            >
              No upcoming events scheduled.
            </motion.p>
          )}
        </motion.div>

        <motion.h2 className={compStyles.sectionTitle} variants={blockVariants}>
          <span className="desk-label">Past Events — Bangkok Underground Archive</span>
          <span className="mob-label">Past Events</span>
        </motion.h2>

        <motion.div
          ref={pastListRef}
          className={styles.eventsList}
          variants={listVariants}
        >
          {pastEvents.slice(0, visiblePastCount).map(ev => (
            <motion.div
              key={ev.id}
              className={`${styles.evRow} ${styles.evRowPast}`}
              onClick={() => router.push(`/events/${ev.slug}`)}
              variants={eventRowVariants}
              initial="hidden"
              animate="show"
              whileHover={{
                y: -3,
                scale: 1.008,
                transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.992,
                transition: { duration: 0.12 },
              }}
            >
              <motion.div
                className={styles.evThumbWrap}
                variants={subtleItemVariants}
                whileHover={{
                  scale: 1.015,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <Image
                  src={ev.posterUrl || "/video-poster.jpg"}
                  alt={ev.title}
                  width={220}
                  height={275}
                  sizes="(max-width: 768px) 77px, 220px"
                  className={styles.evThumb}
                />
              </motion.div>

              <motion.div className={styles.evInfo} variants={subtleItemVariants}>
                <motion.div className={styles.evTitle} variants={subtleItemVariants}>
                  {ev.displayTitle || ev.title}
                </motion.div>
                <motion.div className={styles.evDate} variants={subtleItemVariants}>
                  {fmtDate(ev.eventDate.toISOString())}
                </motion.div>
                <motion.div className={styles.evLocationText} variants={subtleItemVariants}>
                  {ev.location}
                </motion.div>
                {getLineupNames(ev)?.length ? (
                  <motion.div className={styles.evDjs} variants={subtleItemVariants}>
                    {getLineupNames(ev)?.join(" · ")}
                  </motion.div>
                ) : null}
              </motion.div>

              <motion.div
                className={styles.evPlus}
                variants={subtleItemVariants}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                +
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {visiblePastCount < pastEvents.length && (
          <motion.div
            className={compStyles.seeMoreWrap}
            style={{ display: "flex" }}
            variants={blockVariants}
          >
            <motion.button
              className={compStyles.seeMore}
              onClick={() => setVisiblePastCount(prev => prev + 3)}
              whileHover={{
                y: -2,
                scale: 1.025,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{ scale: 0.96 }}
            >
              See More
            </motion.button>
          </motion.div>
        )}

        <motion.div
          style={{ marginTop: "40px" }}
          variants={blockVariants}
        >
          <GuestInfoSection />
        </motion.div>
      </motion.div>
    </Shell>
  );
}