"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { GuestInfoSection } from "@/features/home/components/GuestInfoSection";

interface GuestInfoPageClientProps {
  settings: Record<string, string>;
}

export function GuestInfoPageClient({ settings }: GuestInfoPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const consent = localStorage.getItem("sacristy_cookies");
    if (!consent) setCookieBannerVisible(true);
  }, []);

  return (
    <Shell
      activeSection="guestInfo"
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
      onSignup={(e) => { e.preventDefault(); setIsSignupActive(true); setTimeout(() => setIsSignupVisible(true), 10); }}
      settings={settings}
    >
      <GuestInfoSection flush />
    </Shell>
  );
}
