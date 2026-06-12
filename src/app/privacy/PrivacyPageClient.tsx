"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useRouter } from "next/navigation";
import styles from "@/styles/Policies.module.css";
import Link from "next/link";

interface PrivacyPageClientProps {
  settings: Record<string, string>;
}

export function PrivacyPageClient({ settings }: PrivacyPageClientProps) {
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const consent = localStorage.getItem("sacristy_cookies");
    if (!consent) setCookieBannerVisible(true);
  }, []);

  return (
    <Shell
      activeSection="privacy"
      isMobMenuOpen={isMobMenuOpen}
      setIsMobMenuOpen={setIsMobMenuOpen}
      isSignupActive={isSignupActive}
      isSignupVisible={isSignupVisible}
      setIsSignupVisible={setIsSignupVisible}
      setIsSignupActive={setIsSignupActive}
      cookieBannerVisible={cookieBannerVisible}
      onAcceptCookies={() => { localStorage.setItem("sacristy_cookies", "accepted"); setCookieBannerVisible(false); }}
      onDeclineCookies={() => { localStorage.setItem("sacristy_cookies", "declined"); setCookieBannerVisible(false); }}
      onReset={() => router.push("/")}
      onShowSection={(section) => router.push(`/${section}`)}
      onSignup={(e) => { e.preventDefault(); setIsSignupActive(true); setTimeout(() => setIsSignupVisible(true), 10); }}
      settings={settings}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/" className={styles.backBtn} style={{ marginBottom: '40px', display: 'inline-block', textDecoration: 'none' }}>
          ← Back to SACRISTY
        </Link>
        
        <h1 className={styles.evPolicyTitle} style={{ fontSize: '42px', color: '#fff', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <div style={{ fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, .3)', marginBottom: '48px' }}>
          Last updated: June 2, 2026
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>1. Who We Are</div>
          <p>SACRISTY is a hard techno promotion collective based in Bangkok, Thailand. Website: <a href="https://sacristybangkok.com" style={{ color: 'rgba(255,255,255,.5)' }}>sacristybangkok.com</a>. Contact: <a href="mailto:info@sacristybangkok.com" style={{ color: 'rgba(255,255,255,.5)' }}>info@sacristybangkok.com</a></p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>2. Data We Collect</div>
          <p>We collect the following data only when you interact with our site:</p>
          <p>— <strong>Email address</strong> — when you sign up to our newsletter voluntarily.<br/>
          — <strong>Anonymous usage data</strong> — page views, referrer, browser type. IP addresses are hashed and never stored in plain text.<br/>
          — <strong>Cookies</strong> — only after you give consent via the cookie banner.</p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>3. How We Use Your Data</div>
          <p>— Email: to send you updates about upcoming SACRISTY events. You can unsubscribe at any time.<br/>
          — Analytics: to understand how people find and use our website. Data is aggregated and anonymous.<br/>
          — We do not sell, rent, or share your data with third parties for marketing purposes.</p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>4. Third-Party Services</div>
          <p>— <strong>Google Analytics 4</strong> — loaded only after cookie consent. Governed by <a href="https://policies.google.com/privacy" target="_blank" style={{ color: 'rgba(255,255,255,.5)' }}>Google Privacy Policy</a>.<br/>
          — <strong>Brevo (Sendinblue)</strong> — email list management. Governed by <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" style={{ color: 'rgba(255,255,255,.5)' }}>Brevo Privacy Policy</a>.<br/>
          — <strong>SoundCloud</strong> — embedded players on resident pages. Governed by <a href="https://soundcloud.com/pages/privacy" target="_blank" style={{ color: 'rgba(255,255,255,.5)' }}>SoundCloud Privacy Policy</a>.</p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>5. Cookies</div>
          <p>We use cookies only with your consent. You can accept or decline via the banner on your first visit. Declining will prevent Google Analytics from loading. Your choice is saved in your browser's localStorage.</p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>6. Your Rights</div>
          <p>Under GDPR and Thailand's PDPA you have the right to:<br/>
          — Access the data we hold about you<br/>
          — Request deletion of your data<br/>
          — Withdraw consent at any time<br/><br/>
          To exercise these rights, contact us at <a href="mailto:info@sacristybangkok.com" style={{ color: 'rgba(255,255,255,.5)' }}>info@sacristybangkok.com</a></p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>7. Data Retention</div>
          <p>Newsletter emails are retained until you unsubscribe. Anonymous analytics data is retained for 90 days.</p>
        </div>

        <div className={styles.evPolicyBlock}>
          <div className={styles.evPolicyLabel}>8. Changes</div>
          <p>We may update this policy. Changes will be posted on this page with an updated date.</p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.08)', margin: '40px 0' }} />
        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,.25)', letterSpacing: '.1em' }}>SACRISTY Bangkok · info@sacristybangkok.com</p>
      </div>
    </Shell>
  );
}
