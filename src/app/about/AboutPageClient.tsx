"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import { GalleryCanvas } from "@/features/home/components/GalleryCanvas";

interface AboutPageClientProps {
  settings: Record<string, string>;
}

export function AboutPageClient({ settings }: AboutPageClientProps) {
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
      activeSection="about"
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
      hideRightTop={true}
      settings={settings}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none' }}>
        <GalleryCanvas />
        <div style={{ 
          position: 'fixed', 
          bottom: '22px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          fontSize: '8px', 
          letterSpacing: '.25em', 
          textTransform: 'uppercase', 
          color: 'rgba(255, 255, 255, .1)', 
          zIndex: 8000, 
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          Drag · Scroll to zoom · 0 — reset
        </div>
      </div>
    </Shell>
  );
}
