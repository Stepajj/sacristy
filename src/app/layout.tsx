import type { Metadata } from "next";
import AnalyticsTracker from "@/components/shared/AnalyticsTracker";
import { getPublicSettings } from "@/services/settings.service";
import "../styles/globals.css";

const SITE_URL = "https://sacristybangkok.com";
const DEFAULT_TITLE = "SACRISTY \u2014 Hard Techno Events Bangkok";
const DEFAULT_DESCRIPTION = "SACRISTY is Bangkok's underground hard techno promo.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const title = settings.seoTitle || DEFAULT_TITLE;
  const description = settings.seoDescription || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: "hard techno Bangkok, underground rave Bangkok, techno events Bangkok, schranz Bangkok, industrial techno Thailand, buy techno tickets Bangkok, SACRISTY",
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "SACRISTY Bangkok",
      type: "website",
      locale: "en_US",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "SACRISTY Bangkok" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
    icons: { icon: "/favicon.png" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SACRISTY Bangkok",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    sameAs: [
      "https://www.instagram.com/sacristy.bangkok/",
      "https://t.me/sacristybangkok",
      "https://soundcloud.com/sacristybangkok",
      "https://ra.co/promoters/175241",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/video-poster.jpg" fetchPriority="high" />
      </head>
      <body className="antialiased selection:bg-red selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
