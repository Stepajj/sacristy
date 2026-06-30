"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ContactSection } from "@/features/home/components/ContactSection";
import { useCookieConsent } from "@/hooks/useCookieConsent";

interface ContactPageClientProps {
  settings: Record<string, string>;
}

export function ContactPageClient({ settings }: ContactPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const { visible: cookieBannerVisible, accept, decline } = useCookieConsent();
  const router = useRouter();

  return (
    <Shell
      activeSection="contact"
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
      onSignup={(e) => { e.preventDefault(); setIsSignupActive(true); setTimeout(() => setIsSignupVisible(true), 10); }}
      settings={settings}
    >
      <ContactSection />
    </Shell>
  );
}
