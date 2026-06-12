import styles from "@/styles/Policies.module.css";

interface GuestInfoSectionProps {
  flush?: boolean;
}

export const GuestInfoSection = ({ flush = false }: GuestInfoSectionProps) => (
  <div className={`${styles.evPolicy} ${flush ? styles.evPolicyFlush : ""}`}>
    <div className={styles.evPolicyTitle}>Guest Info & House Rules</div>
    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>Timetable</div>
      <p>We do not publish the artist timetable online. Set times will be available at the entrance when you arrive at the event.</p>
    </div>
    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>No Flash</div>
      <p>If you want to record a short video for your memories, please do it without flash. Flash on the dancefloor distracts people, kills the atmosphere and ruins the moment for others.</p>
      <p>This is a space for music, freedom, and connection.</p>
    </div>
    <div className={styles.evPolicyBlock}>
      <div className={styles.evPolicyLabel}>Respect each other. Respect the artists. Respect the dancefloor.</div>
      <p>We want every guest to feel comfortable and respected, regardless of gender, religion, class, background, or sexual orientation.</p>
      <p>Take care of yourself, your body, and the people around you. Be present, stay aware, and enjoy the music.</p>
      <p>If you are in an inappropriate situation or you see someone who needs help, please talk to our staff, security, ticket seller, any member of the team or DJs.</p>
      <p>If you do not respect the rules, you will be asked to leave.</p>
      <p className={styles.evPolicySign}>Thank You</p>
    </div>
  </div>
);
