import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Mobile.module.css";
import { ICONS } from "@/features/home/components/SocialIcons";

interface MobileBarProps {
  activeSection: string;
  socials: {
    instagram: string;
    telegram: string;
    youtube: string;
    soundcloud: string;
    ra: string;
  };
}

export const MobileBar = ({ activeSection, socials }: MobileBarProps) => (
  <div className={styles.mobBar}>
    <Link 
      href="/events"
      className={`${styles.mobBarItem} ${activeSection === 'events' ? styles.mobBarItemActive : ''}`} 
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span>Events</span>
    </Link>
    <a href={socials.instagram} target="_blank" rel="noopener" className={styles.mobBarItem}>{ICONS.IG}<span>IG</span></a>
    <a href={socials.telegram} target="_blank" rel="noopener" className={styles.mobBarItem}>{ICONS.TG}<span>TG</span></a>
    <a href={socials.ra} target="_blank" rel="noopener" className={styles.mobBarItem}>{ICONS.RA}<span>RA</span></a>
    <a href={socials.soundcloud} target="_blank" rel="noopener" className={styles.mobBarItem}><Image src="/sc-logo-sm.webp" alt="" width={20} height={20} className={styles.mobBarScIcon} /><span>SC</span></a>
  </div>
);
