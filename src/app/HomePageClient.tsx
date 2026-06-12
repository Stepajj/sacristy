"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { UpcomingEvents } from "@/features/home/components/UpcomingEvents";
import { PastEvents } from "@/features/home/components/PastEvents";
import { useRouter } from "next/navigation";
import { Event } from "@/types";

interface HomePageClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  settings: Record<string, string>;
}

export function HomePageClient({ upcomingEvents, pastEvents, settings }: HomePageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [visibleArchiveCount, setVisibleArchiveCount] = useState(3);
  const router = useRouter();

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
      activeSection="home"
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
    >
      <UpcomingEvents events={upcomingEvents} />
      <PastEvents 
        events={pastEvents} 
        visibleCount={visibleArchiveCount} 
        onSeeMore={() => setVisibleArchiveCount(prev => prev + 3)} 
      />
    </Shell>
  );
}
