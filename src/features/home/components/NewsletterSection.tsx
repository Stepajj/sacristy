"use client";

import { useState } from "react";
import styles from "@/styles/Newsletter.module.css";

interface NewsletterSectionProps {
  onSignup: (e: React.FormEvent) => void;
  variant?: "desktop" | "mobile" | "block";
}

export const NewsletterSection = ({ onSignup, variant = "block" }: NewsletterSectionProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector<HTMLInputElement>('input[type="email"]');
    const email = input?.value.trim();

    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      if (input) input.value = "";
      setStatus("idle");
      onSignup(event);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const buttonLabel = status === "loading"
    ? "..."
    : status === "error"
      ? "Retry"
      : variant === "mobile"
        ? "\u2192"
        : "Enter";

  if (variant === "desktop") {
    return (
      <div className={styles.rightSignup}>
        <span className={styles.rightSignupLabel}>Sign up to the newsletter</span>
        <form className={styles.rightSignupForm} onSubmit={handleSubmit}>
          <input className={styles.rightSignupInput} type="email" placeholder="YOUR EMAIL" required id="signupEmailTop" name="signup-top" />
          <button type="submit" className={styles.rightSignupBtn} disabled={status === "loading"}>{buttonLabel}</button>
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
          <button type="submit" className={styles.signupBlockBtn} disabled={status === "loading"}>{buttonLabel}</button>
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
        <button type="submit" className={styles.signupBlockBtn} disabled={status === "loading"}>{buttonLabel}</button>
      </form>
    </div>
  );
};
