"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ResidentsSection } from "@/features/home/components/ResidentsSection";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Resident, Event } from "@/types";

const RESIDENT_DETAIL_FADE_MS = 280;

interface ResidentDetailPageClientProps {
  resident: Resident;
  residents: Resident[];
  upcomingEvents: Event[];
  settings: Record<string, string>;
}

export function ResidentDetailPageClient({
  resident,
  residents,
  upcomingEvents,
  settings,
}: ResidentDetailPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [fading, setFading] = useState(false);
  const [heroResident, setHeroResident] = useState(resident);
  const { visible: cookieBannerVisible, accept, decline } = useCookieConsent();
  const router = useRouter();

  const residentIndex = residents.findIndex((item) => item.id === resident.id);

  const previousResident =
    residentIndex >= 0
      ? residents[(residentIndex - 1 + residents.length) % residents.length]
      : null;

  const nextResident =
    residentIndex >= 0
      ? residents[(residentIndex + 1) % residents.length]
      : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFading(false);
      setHeroResident(resident);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [resident]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

  const handleResidentNavigate = (href: string) => {
    if (fading) return;

    const slug = href.split("/").filter(Boolean).pop();
    const targetResident = residents.find((item) => item.slug === slug);

    setFading(true);

    window.setTimeout(() => {
      if (targetResident) {
        sessionStorage.setItem(
          "sacristy_previous_resident_photo",
          JSON.stringify(heroResident),
        );
      }

      router.push(href);
    }, RESIDENT_DETAIL_FADE_MS);
  };

  const handleBackToResidents = () => {
    if (fading) return;

    setFading(true);
    window.setTimeout(() => {
      router.push("/residents");
    }, RESIDENT_DETAIL_FADE_MS);
  };

  return (
    <Shell
      activeSection="residents"
      activeResident={heroResident}
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
        previousResident && nextResident
          ? {
              previousHref: `/residents/${previousResident.slug}`,
              nextHref: `/residents/${nextResident.slug}`,
            }
          : undefined
      }
      onResidentNavigate={handleResidentNavigate}
    >
      <ResidentsSection
        residents={[]}
        activeResident={resident}
        onBack={handleBackToResidents}
        events={upcomingEvents}
        fading={fading}
      />
    </Shell>
  );
}
