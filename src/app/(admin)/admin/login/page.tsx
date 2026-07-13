"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });

      const result = await res.json();

      if (result.success) {
        window.location.assign("/admin/events");
        return;
      }

      setError(result.error || "Wrong password");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className={`${styles.loginLogo} ${password.length > 0 ? styles.loginLogoActive : ""}`}>
          <img src="/logo.webp" alt="SACRISTY" />
        </div>
        <div className={styles.loginSub}>Admin Panel</div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
            required
            autoFocus
            autoComplete="current-password"
            className={styles.passwordInput}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Authenticating..." : "Enter"}
          </button>
          <div className={styles.error} role="alert" aria-live="polite">
            {error}
          </div>
        </form>
      </div>
    </div>
  );
}
