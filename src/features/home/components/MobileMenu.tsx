import styles from "@/styles/Mobile.module.css";
import Image from "next/image";
import Link from "next/link";
import { NewsletterSection } from "./NewsletterSection";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onShowSection: (section: string) => void;
  onSignup: (e: React.FormEvent) => void;
  icons: {
    IG: React.ReactNode;
    YT: React.ReactNode;
    TG: React.ReactNode;
    RA: React.ReactNode;
  };
  socials: {
    instagram: string;
    telegram: string;
    youtube: string;
    soundcloud: string;
    ra: string;
  };
}

export const MobileMenu = ({ isOpen, onClose, activeSection, onSignup, icons, socials }: MobileMenuProps) => (
  <div className={`${styles.mobOverlay} ${isOpen ? styles.open : ""}`}>
    <button className={styles.mobOverlayClose} onClick={onClose}>✕ Close</button>
    <nav>
      <Link href="/events" className={activeSection === 'events' ? styles.active : ''} onClick={onClose}>Events</Link>
      <Link href="/residents" className={activeSection === 'residents' ? styles.active : ''} onClick={onClose}>Residents</Link>
      <Link href="/guest-info" className={activeSection === 'guestInfo' ? styles.active : ''} onClick={onClose}>Guest Info</Link>
      <Link href="/archive" className={activeSection === 'archive' ? styles.active : ''} onClick={onClose}>Archive</Link>
      <Link href="/contact" className={activeSection === 'contact' ? styles.active : ''} onClick={onClose}>Contact</Link>
      <a href="#">Shop</a>
      <Link href="/about" onClick={onClose}>About</Link>
    </nav>
    
    <NewsletterSection onSignup={onSignup} variant="mobile" />

    <div className={styles.mobOverlaySocial}>
      <a href={socials.instagram} target="_blank" rel="noopener" aria-label="Instagram">{icons.IG}</a>
      <a href={socials.soundcloud} target="_blank" rel="noopener" aria-label="SoundCloud"><Image src="/sc-logo-sm.webp" alt="SC" width={22} height={22} /></a>
      <a href={socials.youtube} target="_blank" rel="noopener" aria-label="YouTube">{icons.YT}</a>
      <a href={socials.telegram} target="_blank" rel="noopener" aria-label="Telegram">{icons.TG}</a>
      <a href={socials.ra} target="_blank" rel="noopener" aria-label="Resident Advisor">{icons.RA}</a>
    </div>
    <div className={styles.mobOverlayTagline}>Hard Techno • Bangkok • Underground</div>
  </div>
);
