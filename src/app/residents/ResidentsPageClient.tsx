"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ResidentsSection } from "@/features/home/components/ResidentsSection";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Resident, Event } from "@/types";

const RESIDENT_DETAIL_FADE_MS = 280;

interface ResidentsPageClientProps {
  initialResidents: Resident[];
  upcomingEvents: Event[];
  settings: Record<string, string>;
}

export function ResidentsPageClient({
  initialResidents,
  upcomingEvents,
  settings,
}: ResidentsPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [activeResident, setActiveResident] = useState<Resident | null>(null);
  const [fading, setFading] = useState(false);
  const [isClosingToList, setIsClosingToList] = useState(false);
  const activeResidentRef = useRef<Resident | null>(null);
  const listFadeTimerRef = useRef<number | null>(null);
  const { visible: cookieBannerVisible, accept, decline } = useCookieConsent();
  const router = useRouter();

  const activeResidentIndex = useMemo(
    () =>
      activeResident
        ? initialResidents.findIndex((item) => item.id === activeResident.id)
        : -1,
    [activeResident, initialResidents]
  );

  const previousResident =
    activeResidentIndex >= 0
      ? initialResidents[
          (activeResidentIndex - 1 + initialResidents.length) %
            initialResidents.length
        ]
      : null;

  const nextResident =
    activeResidentIndex >= 0
      ? initialResidents[(activeResidentIndex + 1) % initialResidents.length]
      : null;

  const openResident = (resident: Resident) => {
    activeResidentRef.current = resident;
    setIsClosingToList(false);
    setFading(false);
    setActiveResident(resident);
    window.dispatchEvent(new window.Event("sacristy:reset-scroll"));
    window.history.pushState(
      { page: "residentDetail", slug: resident.slug },
      "",
      `/residents/${resident.slug}`
    );
  };

  const showResidentsList = (pushHistory = true, animate = true) => {
    if (listFadeTimerRef.current !== null) return;

    const finish = () => {
      listFadeTimerRef.current = null;
      activeResidentRef.current = null;
      setIsClosingToList(false);
      setFading(false);
      setActiveResident(null);

      if (pushHistory) {
        window.history.pushState({ page: "residents" }, "", "/residents");
      }
    };

    if (activeResidentRef.current && animate) {
      setIsClosingToList(true);
      setFading(true);
      listFadeTimerRef.current = window.setTimeout(
        finish,
        RESIDENT_DETAIL_FADE_MS
      );
      return;
    }

    activeResidentRef.current = null;
    setIsClosingToList(false);
    setFading(false);
    setActiveResident(null);

    if (pushHistory) {
      window.history.pushState({ page: "residents" }, "", "/residents");
    }
  };

  const handleResidentNavigate = (href: string) => {
    if (fading) return;

    const slug = href.split("/").filter(Boolean).pop();
    const targetResident = initialResidents.find((item) => item.slug === slug);

    if (!targetResident) {
      router.push(href);
      return;
    }

    setFading(true);
    setIsClosingToList(false);

    window.setTimeout(() => {
      if (activeResident) {
        sessionStorage.setItem(
          "sacristy_previous_resident_photo",
          JSON.stringify(activeResident)
        );
      }

      window.dispatchEvent(new window.Event("sacristy:reset-scroll"));
      setIsClosingToList(false);
      activeResidentRef.current = targetResident;
      setActiveResident(targetResident);
      setFading(false);
      window.history.pushState(
        { page: "residentDetail", slug: targetResident.slug },
        "",
        `/residents/${targetResident.slug}`
      );
    }, RESIDENT_DETAIL_FADE_MS);
  };

  useEffect(() => {
    const syncFromPath = () => {
      const path = window.location.pathname;

      if (path === "/residents") {
        showResidentsList(false);
        return;
      }

      const match = path.match(/^\/residents\/([^/?#]+)/);
      if (!match) return;

      const resident = initialResidents.find(
        (item) => item.slug === decodeURIComponent(match[1])
      );
      if (!resident) return;

      activeResidentRef.current = resident;
      setIsClosingToList(false);
      setFading(false);
      setActiveResident(resident);
    };

    window.history.replaceState(
      { ...window.history.state, page: "residents" },
      ""
    );

    const handlePopState = () => syncFromPath();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialResidents]);

  useEffect(() => {
    return () => {
      if (listFadeTimerRef.current !== null) {
        window.clearTimeout(listFadeTimerRef.current);
      }
    };
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

  return (
    <Shell
      activeSection="residents"
      activeResident={isClosingToList ? null : activeResident}
      isMobMenuOpen={isMobMenuOpen}
      setIsMobMenuOpen={setIsMobMenuOpen}
      isSignupActive={isSignupActive}
      isSignupVisible={isSignupVisible}
      setIsSignupVisible={setIsSignupVisible}
      setIsSignupActive={setIsSignupActive}
      cookieBannerVisible={cookieBannerVisible}
      onAcceptCookies={accept}
      onDeclineCookies={decline}
      onReset={() => router.push("/")}
      onShowSection={(section) => router.push(`/${section}`)}
      onSignup={handleSignup}
      settings={settings}
      residentNavigation={
        activeResident && !isClosingToList && previousResident && nextResident
          ? {
              previousHref: `/residents/${previousResident.slug}`,
              nextHref: `/residents/${nextResident.slug}`,
            }
          : undefined
      }
      onResidentNavigate={handleResidentNavigate}
    >
      <ResidentsSection
        residents={initialResidents}
        activeResident={activeResident}
        onBack={() => showResidentsList()}
        onSelectResident={openResident}
        events={upcomingEvents}
        fading={fading}
      />
    </Shell>
  );
}
