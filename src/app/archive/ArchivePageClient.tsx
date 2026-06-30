"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { ArchiveSection } from "@/features/home/components/ArchiveSection";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { ArchiveArtist } from "@/types";

interface ArchivePageClientProps {
  archive: ArchiveArtist[];
  settings: Record<string, string>;
}

export function ArchivePageClient({ archive, settings }: ArchivePageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const { visible: cookieBannerVisible, accept, decline } = useCookieConsent();
  const router = useRouter();

  return (
    <Shell
      activeSection="archive"
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
      onSignup={(e) => {
        e.preventDefault();
        setIsSignupActive(true);
        setTimeout(() => setIsSignupVisible(true), 10);
      }}
      settings={settings}
    >
      <ArchiveSection archive={archive} />
    </Shell>
  );
}
