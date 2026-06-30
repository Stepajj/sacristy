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

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

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
  const [videoReady, setVideoReady] = useState(false);

  const eventPoster = activeEvent?.posterUrl || "/og-image.jpg";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = sessionStorage.getItem(VIDEO_TIME_KEY);

    if (savedTime) {
      const time = Number(savedTime);
      if (!Number.isNaN(time)) {
        video.currentTime = time;
      }
    }

    const saveTime = (force = false) => {
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
      setVideoReady(false);

      video.pause();
      video.currentTime = 0;
      video.load();

      if (!hasPhotoOverlay) {
        void video.play().catch(() => undefined);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveTime(true);
        video.pause();
        return;
      }

      if (!hasPhotoOverlay) {
        void video.play().catch(() => undefined);
      }
    };

    const handlePageHide = () => saveTime(true);
    const handlePause = () => saveTime(true);
    const handleTimeUpdate = () => saveTime(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("sacristy:restart-video", restartVideo);

    return () => {
      saveTime(true);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("sacristy:restart-video", restartVideo);
    };
  }, [hasPhotoOverlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hasPhotoOverlay || document.hidden) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [hasPhotoOverlay]);

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
    <section className={styles.left} data-scroll-panel="left">
      <video
        ref={videoRef}
        autoPlay={!hasPhotoOverlay}
        muted
        loop
        playsInline
        poster="/video-poster.jpg"
        style={{ opacity: hasPhotoOverlay ? 0 : 1 }}
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
      >
        <source src="/party-video.webm" type="video/webm" />
        <source src="/party-video.mp4" type="video/mp4" />
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

      {activeResident && !activeEvent && (
        <div className={`${styles.photoLayer} ${styles.photoLayerActive}`}>
          <Image
            src={activeResident.photo || "/video-poster.jpg"}
            alt={activeResident.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.residentPhoto}
            unoptimized={isUploadSrc(activeResident.photo || "")}
            priority
          />
          <div className={styles.photoOverlay} />
        </div>
      )}

      {activeEvent && (
        <div className={`${styles.photoLayer} ${styles.photoLayerActive}`}>
          <Image
            src={eventPoster}
            alt={activeEvent.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={styles.eventPhoto}
            unoptimized={isUploadSrc(eventPoster)}
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

        <div
          className={`${styles.logoWrap} ${activeResident ? styles.logoWrapResident : ""}`}
          style={{ display: isEventDetail ? "none" : undefined }}
        >
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
