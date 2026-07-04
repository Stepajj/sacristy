"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Shell.module.css";
import { HomeHero } from "@/features/home/components/HomeHero";
import { MobileBar } from "@/features/home/components/MobileBar";
import { CookieBanner } from "@/features/home/components/CookieBanner";
import { ICONS } from "@/features/home/components/SocialIcons";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import Image from "next/image";
import Link from "next/link";
import mobStyles from "@/styles/Mobile.module.css";
import { NewsletterSection } from "@/features/home/components/NewsletterSection";
import { usePathname } from "next/navigation";

const MobileMenu = dynamic(
  () => import("@/features/home/components/MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false },
);

const SuccessModal = dynamic(
  () => import("@/features/home/components/SuccessModal").then((mod) => mod.SuccessModal),
  { ssr: false },
);

interface ShellProps {
  children: React.ReactNode;
  activeSection: string;
  activeResident?: Resident | null;
  activeEvent?: Event | null;
  eventPhotoEvents?: Event[];
  isMobMenuOpen: boolean;
  setIsMobMenuOpen: (open: boolean) => void;
  isSignupActive: boolean;
  isSignupVisible: boolean;
  setIsSignupVisible: (visible: boolean) => void;
  setIsSignupActive: (active: boolean) => void;
  cookieBannerVisible: boolean;
  onAcceptCookies: () => void;
  onDeclineCookies: () => void;
  onReset: () => void;
  onShowSection: (section: string) => void;
  onSignup: (e: React.FormEvent) => void;
  hideRightTop?: boolean;
  settings?: Record<string, string>;
  residentNavigation?: {
    previousHref: string;
    nextHref: string;
  };
  onResidentNavigate?: (href: string) => void;
}

export const Shell = ({
  children,
  activeSection,
  activeResident = null,
  activeEvent = null,
  eventPhotoEvents = [],
  isMobMenuOpen,
  setIsMobMenuOpen,
  isSignupActive,
  isSignupVisible,
  setIsSignupVisible,
  setIsSignupActive,
  cookieBannerVisible,
  onAcceptCookies,
  onDeclineCookies,
  onReset,
  onShowSection,
  onSignup,
  hideRightTop = false,
  settings = {},
  residentNavigation,
  onResidentNavigate,
}: ShellProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const handleReset = () => {
    window.dispatchEvent(new window.Event("sacristy:restart-video"));
    onReset();
  };

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const leftPanel = document.querySelector<HTMLElement>("[data-scroll-panel='left']");
    const leftInner = document.querySelector<HTMLElement>("[data-scroll-panel='left-inner']");

    let st = 0;
    let sc = 0;
    let vel = 0;
    let raf: number | null = null;

    const ease = () => {
      vel *= 0.88;
      st += vel;
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      st = Math.min(Math.max(st, 0), max);
      const d = st - sc;
      sc += d * 0.072;
      scrollEl.scrollTop = sc;

      if (Math.abs(d) > 0.1 || Math.abs(vel) > 0.1) {
        raf = requestAnimationFrame(ease);
      } else {
        sc = st;
        scrollEl.scrollTop = sc;
        raf = null;
      }
    };

    const startEase = () => {
      if (raf === null) {
        sc = scrollEl.scrollTop;
        st = sc;
        raf = requestAnimationFrame(ease);
      }
    };

    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      vel += event.deltaY * 0.25;
      vel = Math.max(Math.min(vel, 60), -60);
      startEase();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== " ") return;

      const activeElement = document.activeElement as HTMLElement | null;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "SELECT" ||
        activeElement?.isContentEditable
      ) return;

      event.preventDefault();
      vel += event.shiftKey ? -100 : 100;
      vel = Math.max(Math.min(vel, 200), -200);
      startEase();
    };

    let midScroll = false;
    let midStartY = 0;
    let midY = 0;
    let midRAF: number | null = null;
    const MIDSPEED = 0.055;

    const startMidScroll = (event: MouseEvent) => {
      if (event.button !== 1) return;
      event.preventDefault();
      midScroll = true;
      midStartY = event.clientY;
      midY = event.clientY;
      document.body.style.cursor = "ns-resize";

      const tick = () => {
        if (!midScroll) return;
        const speed = (midY - midStartY) * MIDSPEED;
        vel += speed;
        vel = Math.max(Math.min(vel, 60), -60);
        startEase();
        midRAF = requestAnimationFrame(tick);
      };

      tick();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (midScroll) midY = event.clientY;
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button !== 1 || !midScroll) return;
      midScroll = false;
      document.body.style.cursor = "";
      if (midRAF !== null) cancelAnimationFrame(midRAF);
      vel *= 0.3;
    };

    const wheelOpts = { passive: false as const };

    scrollEl.addEventListener("wheel", wheel, wheelOpts);
    leftPanel?.addEventListener("wheel", wheel, wheelOpts);
    leftInner?.addEventListener("wheel", wheel, wheelOpts);
    scrollEl.addEventListener("mousedown", startMidScroll);
    leftPanel?.addEventListener("mousedown", startMidScroll);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const resetScroll = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      st = 0;
      sc = 0;
      vel = 0;
      scrollEl.scrollTop = 0;
    };

    window.addEventListener("sacristy:reset-scroll", resetScroll);

    return () => {
      scrollEl.removeEventListener("wheel", wheel);
      leftPanel?.removeEventListener("wheel", wheel);
      leftInner?.removeEventListener("wheel", wheel);
      scrollEl.removeEventListener("mousedown", startMidScroll);
      leftPanel?.removeEventListener("mousedown", startMidScroll);
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("sacristy:reset-scroll", resetScroll);

      if (raf !== null) cancelAnimationFrame(raf);
      if (midRAF !== null) cancelAnimationFrame(midRAF);
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    const setMobileScroll = (top: number) => {
      window.scrollTo(0, top);
      document.documentElement.scrollTop = top;
      document.body.scrollTop = top;
    };

    const scrollToPageStart = () => {
      if (activeSection === "home" || activeResident) {
        setMobileScroll(0);
        return;
      }

      const right = rightRef.current;
      if (!right) return;
      const header = document.querySelector<HTMLElement>(`[class*="mobHeader"]`);
      const headerHeight = header?.offsetHeight || 0;
      let top = 0;
      let element: HTMLElement | null = right;

      while (element) {
        top += element.offsetTop;
        element = element.offsetParent as HTMLElement | null;
      }

      top -= headerHeight;
      setMobileScroll(Math.max(0, top));
    };

    const frame = requestAnimationFrame(() => requestAnimationFrame(scrollToPageStart));
    const timer = window.setTimeout(scrollToPageStart, 100);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [activeSection, activeResident, activeEvent]);

  useEffect(() => {
    window.dispatchEvent(new window.Event("sacristy:reset-scroll"));
  }, [pathname]);

  const socials = {
    instagram: settings.instagram || "https://www.instagram.com/sacristy.bangkok/",
    telegram: settings.telegram || "https://t.me/sacristybangkok",
    youtube: settings.youtube || "https://www.youtube.com/@SacristyBangkok",
    soundcloud: settings.soundcloud || "https://soundcloud.com/sacristybangkok",
    ra: settings.ra || "https://ra.co/promoters/175241",
  };

  return (
    <main>
      <div className={mobStyles.mobHeader}>
        <Link className={mobStyles.mobHeaderBrand} href="/" prefetch={false} onClick={(e) => { e.preventDefault(); handleReset(); }}>
          <Image src="/logo.webp" alt="SACRISTY" width={100} height={24} className={mobStyles.mobHeaderLogo} />
        </Link>
        <button className={mobStyles.mobMenuBtn} onClick={() => setIsMobMenuOpen(true)}>Menu</button>
      </div>

      <div className={styles.shell}>
        <HomeHero
          activeSection={activeSection}
          activeResident={activeResident}
          activeEvent={activeEvent}
          eventPhotoEvents={eventPhotoEvents}
          onReset={handleReset}
          onOpenMobMenu={() => setIsMobMenuOpen(true)}
          onSignup={onSignup}
          residentNavigation={residentNavigation}
          onResidentNavigate={onResidentNavigate}
        />

        <section className={styles.right} ref={rightRef}>
          {!hideRightTop && (
            <div className={styles.rightTop}>
              <NewsletterSection onSignup={onSignup} variant="desktop" />
              <nav className={styles.rightNav}>
                <a href={socials.instagram} target="_blank" rel="noopener" aria-label="Instagram">{ICONS.IG}</a>
                <a href={socials.soundcloud} target="_blank" rel="noopener" aria-label="SoundCloud">
                  <Image src="/sc-logo-sm.webp" alt="SC" width={20} height={20} />
                </a>
                <a href={socials.youtube} target="_blank" rel="noopener" aria-label="YouTube">{ICONS.YT}</a>
                <a href={socials.telegram} target="_blank" rel="noopener" aria-label="Telegram">{ICONS.TG}</a>
                <a href={socials.ra} target="_blank" rel="noopener" aria-label="Resident Advisor">{ICONS.RA}</a>
              </nav>
            </div>
          )}

          <div className={styles.scroll} ref={scrollRef} data-scroll-panel="scroll">
            {children}
          </div>
        </section>
      </div>

      {isMobMenuOpen && (
        <MobileMenu
          isOpen={isMobMenuOpen}
          onClose={() => setIsMobMenuOpen(false)}
          activeSection={activeSection}
          onShowSection={onShowSection}
          onSignup={onSignup}
          icons={ICONS}
          socials={socials}
        />
      )}

      <MobileBar activeSection={activeSection} socials={socials} />

      {isSignupActive && (
        <SuccessModal
          isActive={isSignupActive}
          isVisible={isSignupVisible}
          onClose={() => {
            setIsSignupVisible(false);
            setTimeout(() => setIsSignupActive(false), 400);
          }}
        />
      )}

      <CookieBanner
        isVisible={cookieBannerVisible}
        onAccept={onAcceptCookies}
        onDecline={onDeclineCookies}
      />
    </main>
  );
};
