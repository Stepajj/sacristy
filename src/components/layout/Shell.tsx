"use client";

import React, { useEffect, useRef } from "react";
import styles from "@/styles/Shell.module.css";
import { HomeHero } from "@/features/home/components/HomeHero";
import { MobileMenu } from "@/features/home/components/MobileMenu";
import { MobileBar } from "@/features/home/components/MobileBar";
import { CookieBanner } from "@/features/home/components/CookieBanner";
import { SuccessModal } from "@/features/home/components/SuccessModal";
import { ICONS } from "@/features/home/components/SocialIcons";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import Image from "next/image";
import Link from "next/link";
import mobStyles from "@/styles/Mobile.module.css";
import { NewsletterSection } from "@/features/home/components/NewsletterSection";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface ShellProps {
  children: React.ReactNode;
  activeSection: string;
  activeResident?: Resident | null;
  activeEvent?: Event | null;
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
}

export const Shell = ({
  children,
  activeSection,
  activeResident = null,
  activeEvent = null,
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
}: ShellProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const handleReset = () => {
    window.dispatchEvent(new window.Event("sacristy:restart-video"));
    onReset();
  };

  useEffect(() => {
    const handleSpaceScroll = (event: KeyboardEvent) => {
      if (event.key !== " " || window.matchMedia("(max-width: 1024px)").matches) return;

      const activeElement = document.activeElement as HTMLElement | null;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "SELECT" ||
        activeElement?.isContentEditable
      ) return;

      event.preventDefault();
      scrollRef.current?.scrollBy({
        top: event.shiftKey ? -100 : 100,
        behavior: "smooth",
      });
    };

    document.addEventListener("keydown", handleSpaceScroll);
    return () => document.removeEventListener("keydown", handleSpaceScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let targetScroll = 0;
    let currentScroll = 0;
    let animationFrame: number | null = null;

    const animateScroll = () => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      currentScroll += (targetScroll - currentScroll) * 0.14;

      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        scrollEl.scrollTop = targetScroll;
        animationFrame = null;
        return;
      }

      scrollEl.scrollTop = currentScroll;
      animationFrame = requestAnimationFrame(animateScroll);
    };

    const handleGlobalWheel = (event: WheelEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const target = event.target as HTMLElement | null;

      if (target && scrollEl.contains(target)) {
        return;
      }

      event.preventDefault();

      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

      targetScroll = Math.max(
        0,
        Math.min(maxScroll, targetScroll + event.deltaY * 1.15)
      );

      if (animationFrame === null) {
        currentScroll = scrollEl.scrollTop;
        animationFrame = requestAnimationFrame(animateScroll);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
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
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
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
        <Link className={mobStyles.mobHeaderBrand} href="/" onClick={(e) => { e.preventDefault(); handleReset(); }}>
          <Image src="/logo.webp" alt="SACRISTY" width={100} height={24} className={mobStyles.mobHeaderLogo} />
        </Link>
        <button className={mobStyles.mobMenuBtn} onClick={() => setIsMobMenuOpen(true)}>Menu</button>
      </div>

      <div className={styles.shell}>
        <HomeHero
          activeSection={activeSection}
          activeResident={activeResident}
          activeEvent={activeEvent}
          onReset={handleReset}
          onOpenMobMenu={() => setIsMobMenuOpen(true)}
          onSignup={onSignup}
          residentNavigation={residentNavigation}
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

          <div className={styles.scroll} ref={scrollRef}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </section>
      </div>

      <MobileMenu
        isOpen={isMobMenuOpen}
        onClose={() => setIsMobMenuOpen(false)}
        activeSection={activeSection}
        onShowSection={onShowSection}
        onSignup={onSignup}
        icons={ICONS}
        socials={socials}
      />

      <MobileBar activeSection={activeSection} socials={socials} />

      <SuccessModal
        isActive={isSignupActive}
        isVisible={isSignupVisible}
        onClose={() => {
          setIsSignupVisible(false);
          setTimeout(() => setIsSignupActive(false), 400);
        }}
      />

      <CookieBanner
        isVisible={cookieBannerVisible}
        onAccept={onAcceptCookies}
        onDecline={onDeclineCookies}
      />
    </main>
  );
};