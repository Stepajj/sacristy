"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./AdminLayout.module.css";

const navItems = [
  {
    href: "/admin/events",
    label: "Events",
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="2" width="14" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 1v3M11 1v3M1 6h14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/residents",
    label: "Residents",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1" y="9" width="3" height="6" />
        <rect x="6" y="5" width="3" height="10" />
        <rect x="11" y="1" width="3" height="14" />
      </svg>
    ),
  },
  {
    href: "/admin/seo",
    label: "SEO",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="6" cy="6" r="5" />
        <path d="M10 10l4 4" />
      </svg>
    ),
  },
];

function formatBangkokTime() {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(now)
    .replace(/\//g, ".");
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `${date}\n${time} BKK`;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [clock, setClock] = useState(formatBangkokTime);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    document.documentElement.classList.add("admin-scroll");
    document.body.classList.add("admin-scroll");

    return () => {
      document.documentElement.classList.remove("admin-scroll");
      document.body.classList.remove("admin-scroll");
    };
  }, []);

  useEffect(() => {
    const tick = () => setClock(formatBangkokTime());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/admin/login");
  };

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Link href="/admin/events" aria-label="SACRISTY admin events">
            <img src="/logo.webp" alt="SACRISTY" />
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? styles.activeNavItem : styles.navItem}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.clock}>{clock}</div>

        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarUser}>Admin</div>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            {"\u2190"} Logout
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
