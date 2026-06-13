import Image from "next/image";
import styles from "@/styles/Modals.module.css";

interface SuccessModalProps {
  isActive: boolean;
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isActive, isVisible, onClose }: SuccessModalProps) => {
  if (!isActive) return null;

  return (
    <div className={`${styles.signupOverlay} ${styles.active} ${isVisible ? styles.visible : ""}`} onClick={onClose}>
      <div className={styles.signupModal} onClick={(e) => e.stopPropagation()}>
        <Image src="/success-photo.webp" alt="" width={700} height={467} sizes="(max-width: 768px) 95vw, 700px" className={styles.signupModalPhoto} />
        <div className={styles.signupModalBody}>
          <span className={`${styles.signupModalEmoji} ${isVisible ? styles.crossAnimate : ""}`}>✝</span>
          <div className={styles.signupModalTitle}>Access confirmed</div>
          <div className={styles.signupModalSub}>You&apos;re on the list.</div>
          <button className={styles.signupModalOk} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};
