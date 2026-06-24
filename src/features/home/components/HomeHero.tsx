"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/HomeHero.module.css";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import { NewsletterSection } from "./NewsletterSection";
import mobStyles from "@/styles/Mobile.module.css";
import { useEffect, useRef } from "react";

interface HomeHeroProps {
  
  activeSection: string;
  activeResident: Resident | null;
  activeEvent: Event | null;
  residentPhotoLayers?: Resident[];
  onReset: () => void;
  onOpenMobMenu: () => void;
  onSignup: (e: React.FormEvent) => void;
  residentNavigation?: {
    previousHref: string;
    nextHref: string;
  };
  onResidentNavigate?: (href: string) => void;
}

const isUploadSrc = (src: string) => src.startsWith("/uploads/");

export const HomeHero = ({
  activeSection,
  activeResident,
  activeEvent,
  residentPhotoLayers = [],
  onReset,
  onOpenMobMenu,
  onSignup,
  residentNavigation,
  onResidentNavigate,
}: HomeHeroProps) => {
  const VIDEO_TIME_KEY = "sacristy_bg_video_time";

  const isEventDetail = !!activeEvent;
  const hasPhotoOverlay = !!(activeResident || activeEvent);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    const saveTime = () => {
      sessionStorage.setItem(VIDEO_TIME_KEY, String(video.currentTime));
    };

    const restartVideo = () => {
      sessionStorage.removeItem(VIDEO_TIME_KEY);

      video.pause();
      video.currentTime = 0;
      video.load();
      void video.play().catch(() => undefined);
    };

    window.addEventListener("sacristy:restart-video", restartVideo);

    const interval = window.setInterval(saveTime, 300);

    return () => {
      saveTime();
      window.clearInterval(interval);
      window.removeEventListener("sacristy:restart-video", restartVideo);
    };
  }, []);

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
        autoPlay
        muted
        loop
        playsInline
        poster="/video-poster.jpg"
        style={{ opacity: hasPhotoOverlay ? 0 : 1 }}
      >
        <source src="/party-video.webm" type="video/webm" />
        <source src="/party-video.mp4" type="video/mp4" />
      </video>

      {residentPhotoLayers.map((resident) => {
        const photoSrc = resident.photo || "/video-poster.jpg";
        const isActive =
          !!activeResident &&
          !activeEvent &&
          activeResident.id === resident.id;

        return (
          <div
            key={resident.id}
            className={`${styles.photoLayer} ${
              isActive ? styles.photoLayerActive : ""
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={photoSrc}
              alt={resident.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={styles.residentPhoto}
              unoptimized={isUploadSrc(photoSrc)}
              priority={isActive}
            />
            <div className={styles.photoOverlay} />
          </div>
        );
      })}

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

          <Link href="/events" className={activeSection === "events" ? styles.active : ""}>
            Events
          </Link>
          <Link href="/residents" className={activeSection === "residents" ? styles.active : ""}>
            Residents
          </Link>
          <Link href="/guest-info" className={activeSection === "guestInfo" ? styles.active : ""}>
            Guest Info
          </Link>
          <Link href="/archive" className={activeSection === "archive" ? styles.active : ""}>
            Archive
          </Link>
          <Link href="/contact" className={activeSection === "contact" ? styles.active : ""}>
            Contact
          </Link>
          <a href="#">Shop</a>
          <Link href="/about" className={activeSection === "about" ? styles.active : ""}>
            About
          </Link>
        </nav>

        <div
          className={styles.logoWrap}
          style={{ display: isEventDetail ? "none" : "flex" }}
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
          aria-label="Previous resident"
          onClick={(event) =>
            handleResidentNav(event, residentNavigation.previousHref)
          }
        >
          &lt;
        </Link>

        <Link
          href={residentNavigation.nextHref}
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