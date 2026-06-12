"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      try {
        await api.trackPageView({
          page: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        // Analytics failures are silent
        console.warn("[Analytics] Tracking failed:", error);
      }
    };

    track();
  }, [pathname]);

  return null;
}
