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
 
export function ResidentDetailPageClient({
  resident,
  residents,
  upcomingEvents,
  settings,
}: ResidentDetailPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
const [fading, setFading] = useState(false);
const [heroResident, setHeroResident] = useState(resident);
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
    const consent = localStorage.getItem("sacristy_cookies");
    if (!consent) setCookieBannerVisible(true);
  }, []);

useEffect(() => {
  setFading(false);
  setHeroResident(resident);
}, [resident]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

 const handleResidentNavigate = (href: string) => {
  const slug = href.split("/").filter(Boolean).pop();
  const targetResident = residents.find((item) => item.slug === slug);

  if (targetResident) {
    setHeroResident(targetResident);
  }

  setFading(true);

  window.setTimeout(() => {
    router.push(href);
  }, 280);
};

  return (
    <Shell
      activeSection="residents"
      activeResident={heroResident}
      residentPhotoLayers={residents}
      isMobMenuOpen={isMobMenuOpen}
      setIsMobMenuOpen={setIsMobMenuOpen}
      isSignupActive={isSignupActive}
      isSignupVisible={isSignupVisible}
      setIsSignupVisible={setIsSignupVisible}
      setIsSignupActive={setIsSignupActive}
      cookieBannerVisible={cookieBannerVisible}
      onAcceptCookies={() => {
        localStorage.setItem("sacristy_cookies", "accepted");
        setCookieBannerVisible(false);
      }}
      onDeclineCookies={() => {
        localStorage.setItem("sacristy_cookies", "declined");
        setCookieBannerVisible(false);
      }}
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
  onBack={() => router.push("/residents")}
  events={upcomingEvents}
  fading={fading}
/>
    </Shell>
  );
}