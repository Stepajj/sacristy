import type { Metadata } from "next";
import { getPublicSettings } from "@/services/settings.service";
import {
  DEFAULT_METADATA,
  INDEXABLE_ROBOTS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "../styles/globals.css";

const analyticsScript = `
(() => {
  const endpoint = "/api/public/stats";
  let currentPath = "";

  const getPath = () => window.location.pathname + window.location.search;

  const track = () => {
    const nextPath = getPath();
    if (nextPath === currentPath) return;
    currentPath = nextPath;

    const payload = JSON.stringify({
      page: window.location.pathname,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
    });
    const blob = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  };

  const scheduleTrack = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(track, { timeout: 2000 });
      return;
    }

    setTimeout(track, 0);
  };

  const wrapHistory = (method) => {
    const original = history[method];
    history[method] = function sacristyHistoryWrapper() {
      const result = original.apply(this, arguments);
      queueMicrotask(scheduleTrack);
      return result;
    };
  };

  wrapHistory("pushState");
  wrapHistory("replaceState");
  window.addEventListener("popstate", scheduleTrack);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleTrack, { once: true });
  } else {
    scheduleTrack();
  }
})();
`;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const title = settings.seoTitle || DEFAULT_METADATA.title;
  const description = settings.seoDescription || DEFAULT_METADATA.description;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords:
      "hard techno Bangkok, underground rave Bangkok, techno events Bangkok, schranz Bangkok, industrial techno Thailand, buy techno tickets Bangkok, SACRISTY",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
    icons: { icon: "/favicon.png" },
    robots: INDEXABLE_ROBOTS,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    sameAs: [
      "https://www.instagram.com/sacristy.bangkok/",
      "https://t.me/sacristybangkok",
      "https://soundcloud.com/sacristybangkok",
      "https://ra.co/promoters/175241",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/video-poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/fonts/IBMPlexMono-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/BebasNeue-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased selection:bg-red selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <script dangerouslySetInnerHTML={{ __html: analyticsScript }} />
      </body>
    </html>
  );
}
