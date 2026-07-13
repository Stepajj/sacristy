import { existsSync } from "fs";
import path from "path";
import { DEFAULT_METADATA, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { getEventsCount } from "@/services/event.service";
import { getResidentsCount } from "@/services/resident.service";
import { getPublicSettings } from "@/services/settings.service";
import styles from "../events/Events.module.css";

export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const KEYWORDS =
  "hard techno Bangkok, underground rave Bangkok, techno events Bangkok, schranz Bangkok, industrial techno Thailand, buy techno tickets Bangkok, SACRISTY";
const LONG_TAIL_KEYWORDS = "buy techno tickets Bangkok, industrial techno Thailand, underground club Bangkok";

function isPresent(value: string) {
  return value.trim().length > 0 && value.trim() !== "-";
}

function SeoItem({
  title,
  value,
  warn = false,
}: {
  title: string;
  value: string;
  warn?: boolean;
}) {
  const hasValue = isPresent(value);

  return (
    <div className={styles.seoItem}>
      <div className={warn || !hasValue ? styles.seoCheckWarn : styles.seoCheck}>
        {hasValue ? (warn ? "!" : "\u2713") : "-"}
      </div>
      <div className={styles.seoText}>
        <strong>{title}</strong>
        <p>{hasValue ? value : "-"}</p>
      </div>
    </div>
  );
}

export default async function AdminSeoPage() {
  const [settings, eventsCount, residentsCount] = await Promise.all([
    getPublicSettings(),
    getEventsCount(),
    getResidentsCount(),
  ]);

  const title = settings.seoTitle || DEFAULT_METADATA.title || "-";
  const description = settings.seoDescription || DEFAULT_METADATA.description || "-";
  const ogImagePath = path.join(ROOT, "public", DEFAULT_OG_IMAGE.replace(/^\//, ""));
  const hasOgImage = existsSync(ogImagePath);
  const hasSitemapRoute = existsSync(path.join(ROOT, "src", "app", "sitemap.ts"));
  const hasRobotsRoute = existsSync(path.join(ROOT, "src", "app", "robots.ts"));
  const eventPages = eventsCount > 0 ? `${eventsCount} event records in database` : "-";
  const residentPages = residentsCount > 0 ? `${residentsCount} resident records in database` : "-";

  return (
    <div>
      <h1 className={styles.title}>SEO & Marketing</h1>

      <div className={styles.seoSection}>
        <h3>{"\u2705"} Already Done</h3>
        <SeoItem title="Meta Tags" value={`${title} / ${description}`} />
        <SeoItem title="Open Graph" value={hasOgImage ? `${DEFAULT_OG_IMAGE} (${SITE_URL}${DEFAULT_OG_IMAGE})` : "-"} />
        <SeoItem
          title="Schema.org"
          value="Organization, WebSite, CollectionPage, ItemList, BreadcrumbList, MusicEvent, Person"
        />
        <SeoItem title="Hreflang + Geo" value="-" />
        <SeoItem title="Sitemap.xml" value={hasSitemapRoute ? `${SITE_URL}/sitemap.xml` : "-"} />
        <SeoItem title="Robots.txt" value={hasRobotsRoute ? `${SITE_URL}/robots.txt` : "-"} />
      </div>

      <div className={styles.seoSection}>
        <h3>{"\u26a1"} Action Required</h3>
        <SeoItem title="Google Search Console" value="-" warn />
        <SeoItem title="Google Business Profile" value="-" warn />
        <SeoItem title="OG Image" value={hasOgImage ? `public${DEFAULT_OG_IMAGE}` : "-"} warn={!hasOgImage} />
        <SeoItem title="Resident Artist Pages" value={residentPages} warn={!isPresent(residentPages)} />
        <SeoItem title="Event Pages" value={eventPages} warn={!isPresent(eventPages)} />
      </div>

      <div className={styles.seoSection}>
        <h3>{"\ud83c\udfaf"} Target Keywords</h3>
        <div className={styles.seoItem}>
          <div className={styles.seoText}>
            <strong>Main:</strong>
            <p>{KEYWORDS}</p>
          </div>
        </div>
        <div className={styles.seoItem}>
          <div className={styles.seoText}>
            <strong>Long tail:</strong>
            <p>{LONG_TAIL_KEYWORDS}</p>
          </div>
        </div>
      </div>

      <div className={styles.seoSection}>
        <h3>{"\ud83d\udce3"} Marketing Checklist</h3>
        <SeoItem title="Resident Advisor Profile" value={settings.ra || "-"} warn={!settings.ra} />
        <SeoItem title="Backlinks" value="-" warn />
        <SeoItem title="Instagram Bio Link" value={settings.instagram || "-"} warn={!settings.instagram} />
      </div>
    </div>
  );
}
