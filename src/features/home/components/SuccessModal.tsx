import Image from "next/image";
import styles from "@/styles/Modals.module.css";
import { useEffect, useState } from "react";

interface SuccessModalProps {
  isActive: boolean;
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isActive, isVisible, onClose }: SuccessModalProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isVisible]);

  if (!isActive) return null;

  return (
    <div className={`${styles.signupOverlay} ${styles.active} ${isVisible ? styles.visible : ""}`} onClick={onClose}>
      <div className={styles.signupModal} onClick={(e) => e.stopPropagation()}>
        <Image src="/success-photo.webp" alt="" width={700} height={467} className={styles.signupModalPhoto} />
        <div className={styles.signupModalBody}>
          <span className={`${styles.signupModalEmoji} ${animate ? styles.crossAnimate : ""}`}>✝</span>
          <div className={styles.signupModalTitle}>Access confirmed</div>
          <div className={styles.signupModalSub}>You're on the list.</div>
          <button className={styles.signupModalOk} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};
