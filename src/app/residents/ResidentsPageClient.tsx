"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ResidentsSection } from "@/features/home/components/ResidentsSection";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Resident, Event } from "@/types";

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
  const { visible: cookieBannerVisible, accept, decline } = useCookieConsent();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupActive(true);
    setTimeout(() => setIsSignupVisible(true), 10);
  };

  return (
    <Shell
      activeSection="residents"
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
    >
      <ResidentsSection
        residents={initialResidents}
        activeResident={null}
        onBack={() => router.push("/")}
        events={upcomingEvents}
      />
    </Shell>
  );
}
