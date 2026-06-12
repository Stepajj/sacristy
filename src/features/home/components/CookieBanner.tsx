import styles from "@/styles/CookieBanner.module.css";

interface CookieBannerProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieBanner = ({ isVisible, onAccept, onDecline }: CookieBannerProps) => {
  if (!isVisible) return null;
  
  return (
    <div className={`${styles.cookieBanner} ${styles.cookieBannerVisible}`}>
      <p className={styles.cookieBannerText}>
        We use cookies to analyze traffic and improve your experience.
      </p>
      <div className={styles.cookieBannerActions}>
        <button className={`${styles.cookieBtn} ${styles.cookieBtnDecline}`} onClick={onDecline}>Decline</button>
        <button className={`${styles.cookieBtn} ${styles.cookieBtnAccept}`} onClick={onAccept}>Accept</button>
      </div>
    </div>
  );
};
