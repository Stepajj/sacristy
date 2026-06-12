import styles from "@/styles/Policies.module.css";

export const ContactSection = () => (
  <div className={`${styles.evPolicy} ${styles.evPolicyFlush}`}>
    <div className={styles.evPolicyTitle}>Contact</div>

    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>General</div>
      <p><a href="mailto:info@sacristybangkok.com" style={{color:'rgba(220,220,220,.75)', textDecoration:'underline', textUnderlineOffset:'3px'}}>info@sacristybangkok.com</a></p>
      <p>For general inquiries, collaborations, booking SACRISTY residents, media requests, partnerships, or anything related to SACRISTY Bangkok — reach us by email.</p>
    </div>

    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>Play at Sacristy</div>
      <p>If you want to play at SACRISTY, send your artist information to <a href="mailto:info@sacristybangkok.com" style={{color:'rgba(220,220,220,.75)', textDecoration:'underline', textUnderlineOffset:'3px'}}>info@sacristybangkok.com</a> and reach us on <a href="https://www.instagram.com/sacristy.bangkok/" target="_blank" rel="noopener" style={{color:'rgba(220,220,220,.75)', textDecoration:'underline', textUnderlineOffset:'3px'}}>Instagram</a>.</p>
      <p>— Artist Name<br/>
      — SoundCloud podcast / mix link<br/>
      — YouTube podcast or mix (if available)<br/>
      — Instagram<br/>
      — Short description about yourself<br/>
      — Available or preferred dates</p>
    </div>

    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>Collaborate</div>
      <p>If you are a photographer, videographer, visual artist, light operator, or simply want to help, grow, and build something with us — reach out.</p>
      <p>Send your work, portfolio, ideas, or links by email or contact us on Instagram.</p>
    </div>

    <div className={styles.evPolicyBlock}>
      <p><a href="mailto:info@sacristybangkok.com" style={{color:'rgba(220,220,220,.75)', textDecoration:'underline', textUnderlineOffset:'3px'}}>info@sacristybangkok.com</a></p>
      <p><a href="https://www.instagram.com/sacristy.bangkok/" target="_blank" rel="noopener" style={{color:'rgba(220,220,220,.75)', textDecoration:'underline', textUnderlineOffset:'3px'}}>instagram.com/sacristy.bangkok</a></p>
    </div>
  </div>
);
