"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../events/EventForm.module.css";
import { Resident } from "@/types";
import ImageUpload from "../components/ImageUpload";

interface ResidentFormProps {
  initialData?: Resident;
}

export default function ResidentForm({ initialData }: ResidentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    bio: initialData?.bio || "",
    photo: initialData?.photo || "",
    instagramUrl: initialData?.instagramUrl || "",
    soundcloudUrl: initialData?.soundcloudUrl || "",
    soundcloudWidgetUrl: initialData?.soundcloudWidgetUrl || "",
    raUrl: initialData?.raUrl || "",
    videoUrl: initialData?.videoUrl || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = "/api/admin/residents";
      const method = initialData ? "PATCH" : "POST";
      const body = initialData ? { ...formData, id: initialData.id } : formData;

      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (result.success) {
        router.push("/admin/residents");
        router.refresh();
      } else {
        setError(result.error || "Failed to save resident");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resident?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/residents?id=${initialData?.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        router.push("/admin/residents");
        router.refresh();
      }
    } catch (err) {
      setError("Failed to delete");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>PROFILE</h3>
          <div className={styles.inputGroup}>
            <label>NAME</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className={styles.inputGroup}>
            <label>SLUG</label>
            <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
          </div>
          <div className={styles.inputGroup}>
            <label>BIO</label>
            <textarea rows={6} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>MEDIA & SOCIALS</h3>
          <ImageUpload 
            label="PHOTO" 
            value={formData.photo} 
            onChange={url => setFormData({...formData, photo: url})} 
          />
          <div className={styles.inputGroup}>
            <label>INSTAGRAM URL</label>
            <input value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>SOUNDCLOUD URL</label>
            <input value={formData.soundcloudUrl} onChange={e => setFormData({...formData, soundcloudUrl: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>SOUNDCLOUD WIDGET URL</label>
            <input value={formData.soundcloudWidgetUrl} onChange={e => setFormData({...formData, soundcloudWidgetUrl: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>RA URL</label>
            <input value={formData.raUrl} onChange={e => setFormData({...formData, raUrl: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>VIDEO URL</label>
            <input value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? "SAVING..." : "SAVE RESIDENT"}
        </button>
        {initialData && (
          <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
            DELETE
          </button>
        )}
      </div>
    </form>
  );
}
