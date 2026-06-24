"use client";

import styles from "@/styles/Newsletter.module.css";

interface NewsletterSectionProps {
  onSignup: (e: React.FormEvent) => void;
  variant?: "desktop" | "mobile" | "block";
}

export const NewsletterSection = ({ onSignup, variant = "block" }: NewsletterSectionProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector<HTMLInputElement>('input[type="email"]');
    const email = input?.value.trim();

    if (!email || !email.includes("@")) {
      if (input) {
        input.style.outline = "1px solid #b60000";
        window.setTimeout(() => { input.style.outline = ""; }, 1000);
      }
      return;
    }

    void fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => undefined);

    if (input) input.value = "";
    onSignup(event);
  };

  const buttonLabel = variant === "mobile" ? "\u2192" : "Enter";

  if (variant === "desktop") {
    return (
      <div className={styles.rightSignup}>
        <span className={styles.rightSignupLabel}>Sign up to the newsletter</span>
        <form className={styles.rightSignupForm} onSubmit={handleSubmit}>
          <input className={styles.rightSignupInput} type="email" placeholder="YOUR EMAIL" required id="signupEmailTop" name="signup-top" />
          <button type="submit" className={styles.rightSignupBtn}>{buttonLabel}</button>
        </form>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={styles.mobOverlaySignup}>
        <div className={styles.mobOverlaySignupLabel}>Sign up to the newsletter</div>
        <form className={styles.signupBlockForm} onSubmit={handleSubmit}>
          <input className={styles.signupBlockInput} type="email" placeholder="YOUR EMAIL" required id="signupEmailMob" name="signup-mob" />
          <button type="submit" className={styles.signupBlockBtn}>{buttonLabel}</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.signupBlock}>
      <p className={styles.signupBlockHeading}>
        <strong>JOIN THE LIST</strong>
        Be the first to know about upcoming events&nbsp;&nbsp;&bull;&nbsp;&nbsp;Get early access to tickets
      </p>
      <form className={styles.signupBlockForm} onSubmit={handleSubmit}>
        <input className={styles.signupBlockInput} type="email" placeholder="YOUR EMAIL" required id="signupEmail" name="signup-bottom" />
        <button type="submit" className={styles.signupBlockBtn}>{buttonLabel}</button>
      </form>
    </div>
  );
};
