import { buildPageMetadata } from "@/lib/seo";
import { GalleryCanvas } from "@/features/home/components/GalleryCanvas";
import styles from "@/styles/About.module.css";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "About - SACRISTY Bangkok",
  description: "Explore the visual archive of SACRISTY Bangkok.",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <main className={styles.about}>
      <GalleryCanvas />

      <nav className={styles.navigation} aria-label="About navigation">
        <Link href="/" prefetch={false} className={styles.brand}>
          SACRISTY
        </Link>
        <div className={styles.links}>
          <Link href="/events" prefetch={false}>Events</Link>
          <Link href="/residents" prefetch={false}>Residents</Link>
          <a href="#">Shop</a>
          <Link href="/about" prefetch={false} className={styles.active}>
            About
          </Link>
        </div>
      </nav>

      <div className={styles.hint}>
        Drag &bull; Scroll to zoom &bull; 0 &mdash; reset
      </div>
    </main>
  );
}
