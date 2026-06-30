"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = JSON.stringify({
      page: pathname,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
    });

    const blob = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/public/stats", blob);
      return;
    }

    void fetch("/api/public/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}