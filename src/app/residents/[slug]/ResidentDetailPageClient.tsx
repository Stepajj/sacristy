"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ResidentsSection } from "@/features/home/components/ResidentsSection";
import { Resident, Event } from "@/types";

interface ResidentDetailPageClientProps {
  resident: Resident;
  residents: Resident[];
  upcomingEvents: Event[];
  settings: Record<string, string>;
}

export function ResidentDetailPageClient({ resident, residents, upcomingEvents, settings }: ResidentDetailPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const router = useRouter();
  const residentIndex = residents.findIndex((item) => item.id === resident.id);
  const previousResident = residentIndex >= 0
    ? residents[(residentIndex - 1 + residents.length) % residents.length]
    : null;
  const nextResident = residentIndex >= 0
    ? residents[(residentIndex + 1) % residents.length]
    : null;

  useEffect(() => {
    const consent = localStorage.getItem("sacristy_cookies");
    if (!consent) setCookieBannerVisible(true);
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

  return (
    <Shell
      activeSection="residents"
      activeResident={resident}
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
      residentNavigation={previousResident && nextResident ? {
        previousHref: `/residents/${previousResident.slug}`,
        nextHref: `/residents/${nextResident.slug}`,
      } : undefined}
    >
      <ResidentsSection
  residents={[]}
  activeResident={resident}
  onBack={() => router.push("/residents")}
  events={upcomingEvents}
/>
    </Shell>
  );
}
