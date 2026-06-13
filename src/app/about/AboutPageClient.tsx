import Link from "next/link";
import { GalleryCanvas } from "@/features/home/components/GalleryCanvas";
import styles from "@/styles/About.module.css";

export function AboutPageClient() {
  return (
    <main className={styles.about}>
      <GalleryCanvas />

      <nav className={styles.navigation} aria-label="About navigation">
        <Link href="/" className={styles.brand}>SACRISTY</Link>
        <div className={styles.links}>
          <Link href="/events">Events</Link>
          <Link href="/residents">Residents</Link>
          <a href="#">Shop</a>
          <Link href="/about" className={styles.active}>About</Link>
        </div>
      </nav>

      <div className={styles.hint}>Drag &bull; Scroll to zoom &bull; 0 &mdash; reset</div>
    </main>
  );
}
