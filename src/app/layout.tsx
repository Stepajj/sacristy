import type { Metadata } from "next";
import AnalyticsTracker from "@/components/shared/AnalyticsTracker";
import { getPublicSettings } from "@/services/settings.service";
import "../styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  
  return {
    title: settings.seoTitle || "SACRISTY — Hard Techno Events Bangkok",
    description: settings.seoDescription || "SACRISTY is Bangkok's underground hard techno promo.",
    keywords: "hard techno Bangkok, underground rave Bangkok, techno events Bangkok, schranz Bangkok, industrial techno Thailand, buy techno tickets Bangkok, SACRISTY",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-red selection:text-white">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
