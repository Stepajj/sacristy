"use client";

import { useState, useRef } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        onChange(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError("An error occurred during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={styles.uploadContainer}>
      <label className={styles.label}>{label}</label>
      
      {value ? (
        <div className={styles.previewContainer}>
          <img src={value} alt="Preview" className={styles.preview} />
          <div className={styles.previewOverlay}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.changeBtn}>
              CHANGE
            </button>
            <button type="button" onClick={handleRemove} className={styles.removeBtn}>
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
          {uploading ? "UPLOADING..." : "CLICK TO UPLOAD IMAGE"}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className={styles.hiddenInput}
      />
      
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.urlInputGroup}>
        <label className={styles.smallLabel}>OR ENTER URL MANUALLY</label>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="https://..."
          className={styles.urlInput}
        />
      </div>
    </div>
  );
}
