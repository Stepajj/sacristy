import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/HomeHero.module.css";
import { Resident } from "@/types/resident";
import { Event } from "@/types/event";
import { NewsletterSection } from "./NewsletterSection";
import mobStyles from "@/styles/Mobile.module.css";

interface HomeHeroProps {
  activeSection: string;
  activeResident: Resident | null;
  activeEvent: Event | null;
  onReset: () => void;
  onShowSection: (section: string) => void;
  onOpenMobMenu: () => void;
  onSignup: (e: React.FormEvent) => void;
  residentNavigation?: {
    previousHref: string;
    nextHref: string;
  };
}

export const HomeHero = ({
  activeSection,
  activeResident,
  activeEvent,
  onReset,
  onShowSection,
  onOpenMobMenu,
  onSignup,
  residentNavigation
}: HomeHeroProps) => {
  const isDetailActive = !!(activeResident || activeEvent);

  const handleViewEvents = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (activeSection !== "home") return;

    event.preventDefault();
    document.getElementById("home-events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.left}>
      <video autoPlay muted loop playsInline poster="/video-poster.jpg" style={{ opacity: isDetailActive ? 0 : 1 }}>
        <source src="/party-video.webm" type="video/webm" />
        <source src="/party-video.mp4" type="video/mp4" />
      </video>
      
      {/* Resident Photo Layer */}
      {activeResident && (
        <div style={{position:'absolute', inset:0, zIndex:1}}>
          <Image src={activeResident.photo || "/video-poster.jpg"} alt={activeResident.name} fill style={{objectFit:'cover', filter:'grayscale(100%) contrast(1.1)', opacity:0.75}} />
          <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)'}}></div>
        </div>
      )}

      {/* Event Photo Layer */}
      {activeEvent && (
        <div style={{position:'absolute', inset:0, zIndex:1}}>
          <Image src={activeEvent.posterUrl || "/og-image.jpg"} alt={activeEvent.title} fill style={{objectFit:'cover', filter:'grayscale(15%) contrast(1.05)', opacity:0.82}} />
          <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%)'}}></div>
        </div>
      )}

      <div className={styles.leftInner}>
        <nav className={styles.leftTopnav}>
          <Link href="/" className={`${styles.navLogoLink} ${activeSection === 'home' ? styles.active : ''}`} onClick={(e) => { e.preventDefault(); onReset(); }}>
            <Image src="/logo.webp" alt="SACRISTY" width={120} height={40} className={styles.navLogoImg} />
          </Link>
          <Link href="/events" className={activeSection === 'events' ? styles.active : ''}>Events</Link>
          <Link href="/residents" className={activeSection === 'residents' ? styles.active : ''}>Residents</Link>
          <Link href="/guest-info" className={activeSection === 'guestInfo' ? styles.active : ''}>Guest Info</Link>
          <Link href="/archive" className={activeSection === 'archive' ? styles.active : ''}>Archive</Link>
          <Link href="/contact" className={activeSection === 'contact' ? styles.active : ''}>Contact</Link>
          <a href="#">Shop</a>
          <Link href="/about" className={activeSection === 'about' ? styles.active : ''}>About</Link>
        </nav>

        <div className={styles.logoWrap} style={{ display: isDetailActive ? 'none' : 'flex' }}>
          <Image src="/logo.webp" alt="Sacristy logo" width={242} height={121} priority />
        </div>

        {activeResident && (
          <>
            <div className={styles.residentMobileLogo}>
              <Image src="/logo.webp" alt="Sacristy logo" width={242} height={121} priority />
            </div>

            {residentNavigation && (
              <nav className={styles.residentMobileNav} aria-label="Resident navigation">
                <Link href={residentNavigation.previousHref} aria-label="Previous resident">&lt;</Link>
                <Link href={residentNavigation.nextHref} aria-label="Next resident">&gt;</Link>
              </nav>
            )}

            <div className={styles.residentMobileBottom}>
              <div className={styles.leftBottom}>
                Hard techno &bull; Bangkok &bull; Underground
              </div>
              <div className={mobStyles.mobHeroCta}>
                <Link className={`${mobStyles.mobHeroBtn} ${mobStyles.mobHeroBtnSolid}`} href="/events">View Events</Link>
                <button className={mobStyles.mobHeroBtn} onClick={onOpenMobMenu}>Join the List</button>
              </div>
            </div>
          </>
        )}

        {!isDetailActive && <NewsletterSection onSignup={onSignup} variant="block" />}

        {!isDetailActive && <div className={styles.mobileHeroBottom}>
        <div className={styles.leftBottom}>
          Hard techno • Bangkok • Underground
        </div>
        
        <div className={mobStyles.mobHeroCta}>
          <Link className={`${mobStyles.mobHeroBtn} ${mobStyles.mobHeroBtnSolid}`} href="/events" onClick={handleViewEvents}>View Events</Link>
          <button className={mobStyles.mobHeroBtn} onClick={onOpenMobMenu}>Join the List</button>
        </div>
        </div>}
      </div>
    </section>
  );
};
