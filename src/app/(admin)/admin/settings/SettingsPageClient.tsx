"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../events/EventForm.module.css";

interface SettingsPageClientProps {
  initialSettings: Record<string, string>;
}

export default function SettingsPageClient({ initialSettings }: SettingsPageClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState(initialSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || "Failed to save settings");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>SOCIAL LINKS</h3>
          {['instagram', 'telegram', 'youtube', 'soundcloud', 'ra'].map(key => (
            <div key={key} className={styles.inputGroup}>
              <label>{key.toUpperCase()}</label>
              <input 
                value={formData[key] || ""} 
                onChange={e => setFormData({...formData, [key]: e.target.value})} 
              />
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>SEO & CONTACT</h3>
          <div className={styles.inputGroup}>
            <label>SEO TITLE</label>
            <input value={formData.seoTitle || ""} onChange={e => setFormData({...formData, seoTitle: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>SEO DESCRIPTION</label>
            <textarea rows={3} value={formData.seoDescription || ""} onChange={e => setFormData({...formData, seoDescription: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>CONTACT EMAIL</label>
            <input value={formData.contactEmail || ""} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p style={{ color: '#00C896', fontSize: '12px' }}>Settings saved successfully</p>}
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? "SAVING..." : "SAVE SETTINGS"}
        </button>
      </div>
    </form>
  );
}
