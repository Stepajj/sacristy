"use client";

import { useState } from "react";
import styles from "../events/Events.module.css";

export type AdminResidentRow = {
  id: number;
  slug: string;
  name: string;
  bio: string | null;
  photo: string | null;
  photoFull: string | null;
  videoUrl: string | null;
  instagramUrl: string | null;
  soundcloudUrl: string | null;
  raUrl: string | null;
  soundcloudWidgetUrl: string | null;
};

type ResidentFormState = {
  name: string;
  slug: string;
  bio: string;
  photo: string;
  photoFull: string;
  instagramUrl: string;
  soundcloudUrl: string;
  soundcloudWidgetUrl: string;
  raUrl: string;
  videoUrl: string;
};

type FormMessage = {
  type: "neutral" | "ok" | "err";
  text: string;
};

const emptyResidentForm: ResidentFormState = {
  name: "",
  slug: "",
  bio: "",
  photo: "",
  photoFull: "",
  instagramUrl: "",
  soundcloudUrl: "",
  soundcloudWidgetUrl: "",
  raUrl: "",
  videoUrl: "",
};

function sanitizeResidentSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function getApiError(result: unknown) {
  const data = result as { details?: { fieldErrors?: Record<string, string[]> }; error?: string } | null;
  const fieldErrors = data?.details?.fieldErrors;

  if (fieldErrors) {
    const messages = Object.entries(fieldErrors).flatMap(([field, errors]) =>
      errors.map((message) => `${field}: ${message}`),
    );

    if (messages.length) return messages.join(" ");
  }

  return data?.error || "Server error";
}

export default function AdminResidentsClient({ initialResidents }: { initialResidents: AdminResidentRow[] }) {
  const [residents, setResidents] = useState(initialResidents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ResidentFormState>(emptyResidentForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState<FormMessage>({ type: "neutral", text: "" });
  const [saving, setSaving] = useState(false);

  const updateForm = <Key extends keyof ResidentFormState>(key: Key, value: ResidentFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(emptyResidentForm);
    setPhotoFile(null);
    setPhotoPreview("");
    setMessage({ type: "neutral", text: "" });
    setModalOpen(true);
  };

  const openEditModal = (resident: AdminResidentRow) => {
    setEditId(resident.id);
    setForm({
      name: resident.name || "",
      slug: resident.slug || "",
      bio: resident.bio || "",
      photo: resident.photo || "",
      photoFull: resident.photoFull || "",
      instagramUrl: resident.instagramUrl || "",
      soundcloudUrl: resident.soundcloudUrl || "",
      soundcloudWidgetUrl: resident.soundcloudWidgetUrl || "",
      raUrl: resident.raUrl || "",
      videoUrl: resident.videoUrl || "",
    });
    setPhotoFile(null);
    setPhotoPreview("");
    setMessage({ type: "neutral", text: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setMessage({ type: "neutral", text: "" });
  };

  const handlePhotoChange = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPhotoPreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return form.photo;

    const uploadData = new FormData();
    uploadData.append("file", photoFile);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to upload file");
    }

    return result.url as string;
  };

  const saveResident = async () => {
    const name = form.name.trim();
    const slug = form.slug.trim();

    if (!name || !slug) {
      setMessage({ type: "err", text: "Name and slug are required" });
      return;
    }

    setSaving(true);
    setMessage({ type: "neutral", text: photoFile ? "Processing image..." : "Saving..." });

    try {
      const photo = await uploadPhoto();
      const body = {
        name,
        slug,
        bio: form.bio.trim(),
        photo,
        photoFull: form.photoFull,
        videoUrl: form.videoUrl.trim(),
        instagramUrl: form.instagramUrl.trim(),
        soundcloudUrl: form.soundcloudUrl.trim(),
        raUrl: form.raUrl.trim(),
        soundcloudWidgetUrl: form.soundcloudWidgetUrl.trim(),
        ...(editId ? { id: editId } : {}),
      };
      const response = await fetch("/api/admin/residents", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage({ type: "err", text: getApiError(result) });
        setSaving(false);
        return;
      }

      setMessage({ type: "ok", text: "Saved!" });
      window.setTimeout(() => {
        window.location.reload();
      }, 650);
    } catch (error) {
      setMessage({ type: "err", text: error instanceof Error ? error.message : "Network error - check connection" });
      setSaving(false);
    }
  };

  const deleteResident = async (resident: AdminResidentRow) => {
    if (!window.confirm("Delete resident?")) return;

    const response = await fetch(`/api/admin/residents?id=${resident.id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok || !result.success) {
      window.alert(result.error || "Failed to delete resident");
      return;
    }

    setResidents((current) => current.filter((item) => item.id !== resident.id));
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Residents</h1>
        <button type="button" className={styles.saveBtn} onClick={openAddModal}>
          + Add Resident
        </button>
      </div>

      <div className={styles.residentsList}>
        {residents.map((resident) => (
          <div key={resident.id} className={styles.residentRow}>
            {resident.photo ? (
              <img src={resident.photo} alt={resident.name} className={styles.residentThumb} />
            ) : (
              <div className={styles.residentThumbEmpty} />
            )}
            <div className={styles.residentInfo}>
              <div className={styles.residentName}>{resident.name}</div>
              <div className={styles.residentSlug}>{resident.slug}</div>
            </div>
            <div className={styles.residentActions}>
              <button type="button" className={styles.editBtn} onClick={() => openEditModal(resident)}>
                Edit
              </button>
              <button type="button" className={styles.deleteBtn} onClick={() => deleteResident(resident)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {residents.length === 0 && <div className={styles.emptyResidents}>No residents yet</div>}
      </div>

      <div
        className={`${styles.modalOverlay} ${modalOpen ? styles.modalOverlayOpen : ""}`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>{editId ? "Edit Resident" : "Add Resident"}</div>
            <button type="button" className={styles.modalClose} onClick={closeModal}>
              {"\u00d7"}
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <label>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="REIKS"
              />
            </div>
            <div className={styles.formRow}>
              <label>URL Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => updateForm("slug", sanitizeResidentSlug(event.target.value))}
                placeholder="reiks"
              />
              <div className={styles.hint}>Latin only, no spaces - sacristybangkok.com/residents/reiks</div>
            </div>
            <div className={styles.formRow}>
              <label>Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(event) => updateForm("bio", event.target.value)}
                placeholder="Short bio..."
              />
            </div>
            <div className={styles.formRow}>
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={(event) => handlePhotoChange(event.target.files)} />
              {photoPreview && (
                <div className={styles.cropPreview}>
                  <img src={photoPreview} alt="" />
                </div>
              )}
            </div>
            <div className={styles.formRow}>
              <label>Instagram</label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(event) => updateForm("instagramUrl", event.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className={styles.formRow}>
              <label>SoundCloud</label>
              <input
                type="url"
                value={form.soundcloudUrl}
                onChange={(event) => updateForm("soundcloudUrl", event.target.value)}
                placeholder="https://soundcloud.com/..."
              />
            </div>
            <div className={styles.formRow}>
              <label>SoundCloud Widget URL</label>
              <input
                type="url"
                value={form.soundcloudWidgetUrl}
                onChange={(event) => updateForm("soundcloudWidgetUrl", event.target.value)}
                placeholder="https://soundcloud.com/.../sets/..."
              />
            </div>
            <div className={styles.formRow}>
              <label>Resident Advisor</label>
              <input
                type="url"
                value={form.raUrl}
                onChange={(event) => updateForm("raUrl", event.target.value)}
                placeholder="https://ra.co/dj/..."
              />
            </div>
            <div className={styles.formRow}>
              <label>Video URL</label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(event) => updateForm("videoUrl", event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div
              className={`${styles.formMsg} ${
                message.type === "err" ? styles.formMsgErr : message.type === "ok" ? styles.formMsgOk : ""
              }`}
            >
              {message.text}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className={styles.saveBtn} onClick={saveResident} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
