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
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const titleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.985,
    filter: "blur(12px)",
  },
  show: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.78,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const innerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.1 + index * 0.035,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
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
        <motion.h1 className={compStyles.sectionTitle} variants={titleVariants}>
          <span className="desk-label">Upcoming Sacristy Bangkok Events</span>
          <span className="mob-label">Upcoming Events</span>
        </motion.h1>

        <div className={`${styles.eventsList} ${styles.eventsUpcomingList}`}>
          {upcomingEvents.length > 0 ? upcomingEvents.map((ev, index) => (
            <motion.div
              key={ev.id}
              className={styles.evRow}
              onClick={() => router.push(`/events/${ev.slug}`)}
              variants={rowVariants}
              initial="hidden"
              animate="show"
              custom={index}
              whileHover={{
                y: -4,
                scale: 1.006,
                transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.992,
                transition: { duration: 0.12 },
              }}
            >
              <motion.div
                className={styles.evThumbWrap}
                variants={innerVariants}
                initial="hidden"
                animate="show"
                custom={0}
                whileHover={{
                  scale: 1.018,
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

              <div className={styles.evInfo}>
                <motion.div
                  className={styles.evTitle}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={1}
                >
                  {ev.displayTitle || ev.title}
                </motion.div>

                <motion.div
                  className={styles.evDate}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={2}
                >
                  {fmtDate(ev.eventDate.toISOString())}
                </motion.div>

                <motion.div
                  className={styles.evLocationText}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={3}
                >
                  {ev.location}
                </motion.div>

                {getLineupNames(ev)?.length ? (
                  <motion.div
                    className={styles.evDjs}
                    variants={innerVariants}
                    initial="hidden"
                    animate="show"
                    custom={4}
                  >
                    {getLineupNames(ev)?.join(" · ")}
                  </motion.div>
                ) : null}
              </div>

              <motion.div
                className={styles.evPlus}
                variants={innerVariants}
                initial="hidden"
                animate="show"
                custom={5}
                whileHover={{ rotate: 90, scale: 1.12 }}
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
        </div>

        <motion.h2 className={compStyles.sectionTitle} variants={titleVariants}>
          <span className="desk-label">Past Events — Bangkok Underground Archive</span>
          <span className="mob-label">Past Events</span>
        </motion.h2>

        <div ref={pastListRef} className={styles.eventsList}>
          {pastEvents.slice(0, visiblePastCount).map((ev, index) => (
            <motion.div
              key={ev.id}
              className={`${styles.evRow} ${styles.evRowPast}`}
              onClick={() => router.push(`/events/${ev.slug}`)}
              variants={rowVariants}
              initial="hidden"
              animate="show"
              custom={index + upcomingEvents.length + 2}
              whileHover={{
                y: -4,
                scale: 1.006,
                transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.992,
                transition: { duration: 0.12 },
              }}
            >
              <motion.div
                className={styles.evThumbWrap}
                variants={innerVariants}
                initial="hidden"
                animate="show"
                custom={0}
                whileHover={{
                  scale: 1.018,
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

              <div className={styles.evInfo}>
                <motion.div
                  className={styles.evTitle}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={1}
                >
                  {ev.displayTitle || ev.title}
                </motion.div>

                <motion.div
                  className={styles.evDate}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={2}
                >
                  {fmtDate(ev.eventDate.toISOString())}
                </motion.div>

                <motion.div
                  className={styles.evLocationText}
                  variants={innerVariants}
                  initial="hidden"
                  animate="show"
                  custom={3}
                >
                  {ev.location}
                </motion.div>

                {getLineupNames(ev)?.length ? (
                  <motion.div
                    className={styles.evDjs}
                    variants={innerVariants}
                    initial="hidden"
                    animate="show"
                    custom={4}
                  >
                    {getLineupNames(ev)?.join(" · ")}
                  </motion.div>
                ) : null}
              </div>

              <motion.div
                className={styles.evPlus}
                variants={innerVariants}
                initial="hidden"
                animate="show"
                custom={5}
                whileHover={{ rotate: 90, scale: 1.12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                +
              </motion.div>
            </motion.div>
          ))}
        </div>

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