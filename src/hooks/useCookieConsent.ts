"use client";

import { useEffect, useState } from "react";

const COOKIE_KEY = "sacristy_cookies";

export function useCookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_KEY)) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return { visible, accept, decline };
}
