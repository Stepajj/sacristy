"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/HomeHero.module.css";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import { NewsletterSection } from "./NewsletterSection";
import mobStyles from "@/styles/Mobile.module.css";
import { useEffect, useRef, useState } from "react";

interface HomeHeroProps {
  activeSection: string;
  activeResident: Resident | null;
  activeEvent: Event | null;
  onReset: () => void;
  onOpenMobMenu: () => void;
  onSignup: (e: React.FormEvent) => void;
  residentNavigation?: {
    previousHref: string;
    nextHref: string;
  };
  onResidentNavigate?: (href: string) => void;
}

const VIDEO_TIME_KEY = "sacristy_bg_video_time";
const VIDEO_LOAD_DELAY_MS = 900;
const PREVIOUS_RESIDENT_PHOTO_KEY = "sacristy_previous_resident_photo";

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

const getStoredPreviousResident = (activeResident: Resident | null) => {
  if (!activeResident || typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(PREVIOUS_RESIDENT_PHOTO_KEY);
  if (!stored) return null;

  sessionStorage.removeItem(PREVIOUS_RESIDENT_PHOTO_KEY);

  try {
    const parsed = JSON.parse(stored) as Resident;
    return parsed.id !== activeResident.id ? parsed : null;
  } catch {
    return null;
  }
};

export const HomeHero = ({
  activeSection,
  activeResident,
  activeEvent,
  onReset,
  onOpenMobMenu,
  onSignup,
  residentNavigation,
  onResidentNavigate,
}: HomeHeroProps) => {
  const isEventDetail = !!activeEvent;
  const hasPhotoOverlay = !!(activeResident || activeEvent);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedAtRef = useRef(0);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!hasPhotoOverlay);
  const [videoReady, setVideoReady] = useState(false);
  const [residentPhotoState, setResidentPhotoState] = useState<{
    current: Resident | null;
    previous: Resident | null;
    sequence: number;
    currentActive: boolean;
    previousActive: boolean;
    currentSettled: boolean;
  }>(() => {
    const previous = getStoredPreviousResident(activeResident);

    return {
      current: activeResident,
      previous,
      sequence: previous ? 1 : 0,
      currentActive: Boolean(previous),
      previousActive: Boolean(previous),
      currentSettled: Boolean(previous),
    };
  });
  const [eventPhotoState, setEventPhotoState] = useState<{
    current: Event | null;
    previous: Event | null;
    sequence: number;
    currentActive: boolean;
    previousActive: boolean;
    currentSettled: boolean;
  }>({
    current: activeEvent,
    previous: null,
    sequence: 0,
    currentActive: false,
    previousActive: false,
    currentSettled: false,
  });

  const eventPoster = activeEvent?.posterUrl || "/og-image.jpg";

  useEffect(() => {
    let frame: number | null = null;
    let activationFallback: number | null = null;
    let timer: number | null = null;

    setResidentPhotoState((state) => {
      if (!activeResident) {
        return {
          current: null,
          previous: state.current,
          sequence: state.sequence,
          currentActive: false,
          previousActive: Boolean(state.current),
          currentSettled: false,
        };
      }

      if (state.current?.id === activeResident.id) {
        return { ...state, current: activeResident };
      }

      return {
        current: activeResident,
        previous: state.current,
        sequence: state.sequence + 1,
        currentActive: Boolean(state.current),
        previousActive: Boolean(state.current),
        currentSettled: Boolean(state.current),
      };
    });

    const activateResidentLayers = () => {
      setResidentPhotoState((state) => {
        if (!activeResident) {
          return { ...state, currentActive: false, previousActive: false };
        }

        if (state.current?.id !== activeResident.id) return state;

        return {
          ...state,
          currentActive: true,
          previousActive: false,
          currentSettled: false,
        };
      });
    };

    frame = requestAnimationFrame(activateResidentLayers);
    activationFallback = window.setTimeout(activateResidentLayers, 20);

    timer = window.setTimeout(() => {
      setResidentPhotoState((state) =>
        !activeResident || state.current?.id === activeResident.id
          ? {
              ...state,
              previous: null,
              previousActive: false,
              currentSettled: Boolean(state.current),
            }
          : state
      );
    }, 520);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (activationFallback !== null) window.clearTimeout(activationFallback);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [activeResident]);

  useEffect(() => {
    let frame: number | null = null;
    let activationFallback: number | null = null;
    let timer: number | null = null;

    setEventPhotoState((state) => {
      if (!activeEvent) {
        return {
          current: null,
          previous: state.current,
          sequence: state.sequence,
          currentActive: false,
          previousActive: Boolean(state.current),
          currentSettled: false,
        };
      }

      if (state.current?.id === activeEvent.id) {
        return { ...state, current: activeEvent };
      }

      return {
        current: activeEvent,
        previous: state.current,
        sequence: state.sequence + 1,
        currentActive: Boolean(state.current),
        previousActive: Boolean(state.current),
        currentSettled: Boolean(state.current),
      };
    });

    const activateEventLayers = () => {
      setEventPhotoState((state) => {
        if (!activeEvent) {
          return { ...state, currentActive: false, previousActive: false };
        }

        if (state.current?.id !== activeEvent.id) return state;

        return {
          ...state,
          currentActive: true,
          previousActive: false,
          currentSettled: false,
        };
      });
    };

    frame = requestAnimationFrame(activateEventLayers);
    activationFallback = window.setTimeout(activateEventLayers, 20);

    timer = window.setTimeout(() => {
      setEventPhotoState((state) =>
        !activeEvent || state.current?.id === activeEvent.id
          ? {
              ...state,
              previous: null,
              previousActive: false,
              currentSettled: Boolean(state.current),
            }
          : state
      );
    }, 520);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (activationFallback !== null) window.clearTimeout(activationFallback);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [activeEvent]);

  useEffect(() => {
    if (hasPhotoOverlay || shouldLoadVideo) return;

    let timeoutId: number | null = null;
    const frameId = requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        setShouldLoadVideo(true);
      }, VIDEO_LOAD_DELAY_MS);
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [hasPhotoOverlay, shouldLoadVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const restoreTime = () => {
      const savedTime = sessionStorage.getItem(VIDEO_TIME_KEY);
      if (!savedTime) return;
      const time = Number(savedTime);
      if (!Number.isNaN(time)) {
        video.currentTime = time;
      }
    };

    if (shouldLoadVideo) {
      restoreTime();
    }

    const saveTime = (force = false) => {
      if (!shouldLoadVideo || !video.currentSrc) return;

      const now = performance.now();

      if (!force && now - lastSavedAtRef.current < 2000) {
        return;
      }

      lastSavedAtRef.current = now;
      sessionStorage.setItem(VIDEO_TIME_KEY, String(video.currentTime));
    };

    const restartVideo = () => {
      sessionStorage.removeItem(VIDEO_TIME_KEY);
      lastSavedAtRef.current = 0;
      setShouldLoadVideo(true);
      setVideoReady(false);

      window.setTimeout(() => {
        const currentVideo = videoRef.current;
        if (!currentVideo) return;

        currentVideo.pause();
        currentVideo.currentTime = 0;
        currentVideo.load();

        if (!hasPhotoOverlay) {
          void currentVideo.play().catch(() => undefined);
        }
      }, 0);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveTime(true);
        video.pause();
        return;
      }

      if (shouldLoadVideo && !hasPhotoOverlay) {
        void video.play().catch(() => undefined);
      }
    };

    const handlePageHide = () => saveTime(true);
    const handlePause = () => saveTime(true);
    const handleTimeUpdate = () => saveTime(false);

    video.addEventListener("loadedmetadata", restoreTime);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("sacristy:restart-video", restartVideo);

    return () => {
      saveTime(true);
      video.removeEventListener("loadedmetadata", restoreTime);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("sacristy:restart-video", restartVideo);
    };
  }, [hasPhotoOverlay, shouldLoadVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldLoadVideo) return;

    if (hasPhotoOverlay || document.hidden) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [hasPhotoOverlay, shouldLoadVideo]);

  const handleViewEvents = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (activeSection !== "home") return;

    event.preventDefault();
    document.getElementById("home-events")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleResidentNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!onResidentNavigate) return;

    event.preventDefault();
    onResidentNavigate(href);
  };

  return (
    <section
      className={`${styles.left} ${activeResident ? styles.leftResident : ""}`}
      data-scroll-panel="left"
    >
      <video
        ref={videoRef}
        autoPlay={shouldLoadVideo && !hasPhotoOverlay}
        muted
        loop
        playsInline
        preload={shouldLoadVideo ? "auto" : "none"}
        poster="/video-poster.jpg"
        style={{ opacity: hasPhotoOverlay ? 0 : 1 }}
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
      >
        {shouldLoadVideo && (
          <>
            <source src="/party-video.webm" type="video/webm" />
            <source src="/party-video.mp4" type="video/mp4" />
          </>
        )}
      </video>

      {!hasPhotoOverlay && (
        <Image
          src="/video-poster.jpg"
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          sizes="(max-width: 768px) 100vw, 60vw"
          className={`${styles.videoPoster} ${videoReady ? styles.videoPosterHidden : ""}`}
        />
      )}

      {residentPhotoState.current && !activeEvent && (
        <div
          key={`resident-current-${residentPhotoState.current.id}-${residentPhotoState.sequence}`}
          className={`${styles.photoLayer} ${
            residentPhotoState.currentActive ? styles.photoLayerActive : ""
          }`}
          style={{
            opacity: residentPhotoState.currentActive ? 1 : 0,
            transition: residentPhotoState.currentSettled ? "none" : undefined,
          }}
        >
          <Image
            src={residentPhotoState.current.photo || "/video-poster.jpg"}
            alt={residentPhotoState.current.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.residentPhoto}
            unoptimized={isUploadSrc(residentPhotoState.current.photo || "")}
            priority
          />
          <div className={styles.photoOverlay} />
        </div>
      )}

      {residentPhotoState.previous && !activeEvent && (
        <div
          key={`resident-prev-${residentPhotoState.previous.id}-${residentPhotoState.sequence}`}
          className={`${styles.photoLayer} ${
            residentPhotoState.previousActive ? styles.photoLayerActive : ""
          }`}
          style={{ opacity: residentPhotoState.previousActive ? 1 : 0 }}
        >
          <Image
            src={residentPhotoState.previous.photo || "/video-poster.jpg"}
            alt={residentPhotoState.previous.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.residentPhoto}
            unoptimized={isUploadSrc(residentPhotoState.previous.photo || "")}
            priority
          />
          <div className={styles.photoOverlay} />
        </div>
      )}

      {eventPhotoState.current && (
        <div
          key={`event-current-${eventPhotoState.current.id}-${eventPhotoState.sequence}`}
          className={`${styles.photoLayer} ${
            eventPhotoState.currentActive ? styles.photoLayerActive : ""
          }`}
          style={{
            opacity: eventPhotoState.currentActive ? 1 : 0,
            transition: eventPhotoState.currentSettled ? "none" : undefined,
          }}
        >
          <Image
            src={eventPhotoState.current.posterUrl || eventPoster}
            alt={eventPhotoState.current.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.eventPhoto}
            unoptimized={isUploadSrc(eventPhotoState.current.posterUrl || "")}
          />
          <div className={styles.eventPhotoOverlay} />
        </div>
      )}

      {eventPhotoState.previous && (
        <div
          key={`event-prev-${eventPhotoState.previous.id}-${eventPhotoState.sequence}`}
          className={`${styles.photoLayer} ${
            eventPhotoState.previousActive ? styles.photoLayerActive : ""
          }`}
          style={{ opacity: eventPhotoState.previousActive ? 1 : 0 }}
        >
          <Image
            src={eventPhotoState.previous.posterUrl || "/og-image.jpg"}
            alt={eventPhotoState.previous.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.eventPhoto}
            unoptimized={isUploadSrc(eventPhotoState.previous.posterUrl || "")}
          />
          <div className={styles.eventPhotoOverlay} />
        </div>
      )}

      {activeResident && residentNavigation && (
        <nav className={styles.residentDesktopNav} aria-label="Resident navigation">
          <Link
            href={residentNavigation.previousHref}
            prefetch={false}
            className={`${styles.residentDesktopArrow} ${styles.residentDesktopArrowPrev}`}
            aria-label="Previous resident"
            onClick={(event) =>
              handleResidentNav(event, residentNavigation.previousHref)
            }
          >
            &lt;
          </Link>

          <Link
            href={residentNavigation.nextHref}
            prefetch={false}
            className={`${styles.residentDesktopArrow} ${styles.residentDesktopArrowNext}`}
            aria-label="Next resident"
            onClick={(event) =>
              handleResidentNav(event, residentNavigation.nextHref)
            }
          >
            &gt;
          </Link>
        </nav>
      )}

      <div className={styles.leftInner} data-scroll-panel="left-inner">
        <nav className={styles.leftTopnav}>
          <Link
            href="/"
            prefetch={false}
            className={`${styles.navLogoLink} ${
              activeSection === "home" ? styles.active : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
          >
            <Image
              src="/logo.webp"
              alt="SACRISTY"
              width={121}
              height={60}
              sizes="81px"
              className={styles.navLogoImg}
            />
          </Link>

          <Link href="/events" prefetch={false} className={activeSection === "events" ? styles.active : ""}>
            Events
          </Link>
          <Link href="/residents" prefetch={false} className={activeSection === "residents" ? styles.active : ""}>
            Residents
          </Link>
          <Link href="/guest-info" prefetch={false} className={activeSection === "guestInfo" ? styles.active : ""}>
            Guest Info
          </Link>
          <Link href="/archive" prefetch={false} className={activeSection === "archive" ? styles.active : ""}>
            Archive
          </Link>
          <Link href="/contact" prefetch={false} className={activeSection === "contact" ? styles.active : ""}>
            Contact
          </Link>
          <a href="#">Shop</a>
          <Link href="/about" prefetch={false} className={activeSection === "about" ? styles.active : ""}>
            About
          </Link>
        </nav>

        <div className={styles.logoWrap} style={{ display: isEventDetail ? "none" : undefined }}>
          <Image
            src="/logo.webp"
            alt="Sacristy logo"
            width={242}
            height={121}
            sizes="(max-width: 768px) 160px, 260px"
            priority
          />
        </div>

        {activeResident && (
          <>
            <div className={styles.residentMobileLogo}>
              <Image
                src="/logo.webp"
                alt="Sacristy logo"
                width={242}
                height={121}
                sizes="160px"
                priority
              />
            </div>

            {residentNavigation && (
              <nav className={styles.residentMobileNav} aria-label="Resident navigation">
                <Link
                  href={residentNavigation.previousHref}
                  prefetch={false}
                  aria-label="Previous resident"
                  onClick={(event) =>
                    handleResidentNav(event, residentNavigation.previousHref)
                  }
                >
                  &lt;
                </Link>

                <Link
                  href={residentNavigation.nextHref}
                  prefetch={false}
                  aria-label="Next resident"
                  onClick={(event) =>
                    handleResidentNav(event, residentNavigation.nextHref)
                  }
                >
                  &gt;
                </Link>
              </nav>
            )}

            <div className={styles.residentMobileBottom}>
              <div className={styles.leftBottom}>
                Hard techno &bull; Bangkok &bull; Underground
              </div>

              <div className={mobStyles.mobHeroCta}>
                <Link
                  className={`${mobStyles.mobHeroBtn} ${mobStyles.mobHeroBtnSolid}`}
                  href="/events"
                  prefetch={false}
                >
                  View Events
                </Link>
                <button className={mobStyles.mobHeroBtn} onClick={onOpenMobMenu}>
                  Join the List
                </button>
              </div>
            </div>
          </>
        )}

        {!isEventDetail && <NewsletterSection onSignup={onSignup} variant="block" />}

        {!isEventDetail && activeResident && (
          <div className={`${styles.leftBottom} ${styles.residentDesktopBottom}`}>
            Hard techno &bull; Bangkok &bull; Underground
          </div>
        )}

        {!isEventDetail && !activeResident && (
          <div className={styles.mobileHeroBottom}>
            <div className={styles.leftBottom}>
              Hard techno • Bangkok • Underground
            </div>

            <div className={mobStyles.mobHeroCta}>
              <Link
                className={`${mobStyles.mobHeroBtn} ${mobStyles.mobHeroBtnSolid}`}
                href="/events"
                prefetch={false}
                onClick={handleViewEvents}
              >
                View Events
              </Link>
              <button className={mobStyles.mobHeroBtn} onClick={onOpenMobMenu}>
                Join the List
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
