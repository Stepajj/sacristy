"use client";

import { useState } from "react";
import styles from "./Events.module.css";

type ResidentOption = {
  id: number;
  slug: string;
  name: string;
};

type AdminLineupItem = {
  id?: number;
  residentId?: number | null;
  residentSlug?: string | null;
  djName?: string | null;
  djInstagram?: string | null;
  sortOrder: number;
  resident?: ResidentOption | null;
};

export type AdminEventRow = {
  id: number;
  slug: string;
  title: string;
  displayTitle: string | null;
  eventDate: string;
  location: string;
  mapsLink: string | null;
  coords: string | null;
  posterUrl: string | null;
  ticketLink: string | null;
  racoLink: string | null;
  description: string | null;
  isPublished: boolean;
  lineup: AdminLineupItem[];
};

export type AdminResidentOption = ResidentOption;

type EventFormState = {
  title: string;
  displayTitle: string;
  slug: string;
  eventDate: string;
  location: string;
  ticketLink: string;
  racoLink: string;
  mapsLink: string;
  coords: string;
  description: string;
  posterUrl: string;
  isPublished: boolean;
};

type DraftLineupItem = {
  djName: string;
  djInstagram: string;
  residentSlug: string;
  residentId: number | null;
  sortOrder: number;
};

type FormMessage = {
  type: "neutral" | "ok" | "err";
  text: string;
};

const emptyForm: EventFormState = {
  title: "",
  displayTitle: "",
  slug: "",
  eventDate: "",
  location: "",
  ticketLink: "",
  racoLink: "",
  mapsLink: "",
  coords: "",
  description: "",
  posterUrl: "",
  isPublished: true,
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toSlug(text: string) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80)
    .replace(/^-+|-+$/g, "");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getStatus(eventDate: string) {
  const date = new Date(eventDate);
  const now = new Date();
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (date < now) return { label: "Past", className: styles.badgePast };
  if (date <= monthFromNow) return { label: "Upcoming", className: styles.badgeSoon };
  return { label: "Upcoming", className: styles.badgeUpcoming };
}

function getLineupText(event: AdminEventRow) {
  const names = event.lineup
    .map((item) => item.djName || item.resident?.name || "")
    .filter((name) => name.trim());

  return names.length ? names.join(", ") : "-";
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

function getLineupForm(event: AdminEventRow): DraftLineupItem[] {
  return event.lineup.map((item, index) => ({
    djName: item.djName || item.resident?.name || "",
    djInstagram: item.djInstagram || "",
    residentSlug: item.residentSlug || item.resident?.slug || "",
    residentId: item.residentId || item.resident?.id || null,
    sortOrder: item.sortOrder ?? index,
  }));
}

function getInstagramLabel(url: string) {
  return url
    ? url.replace("https://instagram.com/", "@").replace("https://www.instagram.com/", "@")
    : "-";
}

export default function AdminEventsClient({
  initialEvents,
  residents,
}: {
  initialEvents: AdminEventRow[];
  residents: AdminResidentOption[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [slugManualEdit, setSlugManualEdit] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [lineup, setLineup] = useState<DraftLineupItem[]>([]);
  const [newDjName, setNewDjName] = useState("");
  const [newDjInstagram, setNewDjInstagram] = useState("");
  const [newDjResident, setNewDjResident] = useState("");
  const [message, setMessage] = useState<FormMessage>({ type: "neutral", text: "" });
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const updateForm = <Key extends keyof EventFormState>(key: Key, value: EventFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setSlugManualEdit(false);
    setPosterFile(null);
    setPosterPreview("");
    setLineup([]);
    setNewDjName("");
    setNewDjInstagram("");
    setNewDjResident("");
    setMessage({ type: "neutral", text: "" });
    setUploadProgress(null);
    setModalOpen(true);
  };

  const openEditModal = (event: AdminEventRow) => {
    setEditId(event.id);
    setForm({
      title: event.title || "",
      displayTitle: event.displayTitle || "",
      slug: event.slug || "",
      eventDate: formatDateTimeLocal(event.eventDate),
      location: event.location || "",
      ticketLink: event.ticketLink || "",
      racoLink: event.racoLink || "",
      mapsLink: event.mapsLink || "",
      coords: event.coords || "",
      description: event.description || "",
      posterUrl: event.posterUrl || "",
      isPublished: event.isPublished,
    });
    setSlugManualEdit(true);
    setPosterFile(null);
    setPosterPreview(event.posterUrl || "");
    setLineup(getLineupForm(event));
    setNewDjName("");
    setNewDjInstagram("");
    setNewDjResident("");
    setMessage({ type: "neutral", text: "" });
    setUploadProgress(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setMessage({ type: "neutral", text: "" });
    setUploadProgress(null);
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: !slugManualEdit && !current.displayTitle.trim() ? toSlug(value) : current.slug,
    }));
  };

  const handleDisplayTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      displayTitle: value,
      slug: slugManualEdit ? current.slug : toSlug(value || current.title),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManualEdit(true);
    updateForm("slug", toSlug(value));
  };

  const handlePosterChange = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPosterPreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addDjToLineup = () => {
    const name = newDjName.trim();
    if (!name) {
      setMessage({ type: "err", text: "DJ name required" });
      return;
    }

    const resident = residents.find((item) => item.slug === newDjResident);
    setLineup((current) => [
      ...current,
      {
        djName: name,
        djInstagram: newDjInstagram.trim(),
        residentSlug: newDjResident,
        residentId: resident?.id || null,
        sortOrder: current.length,
      },
    ]);
    setNewDjName("");
    setNewDjInstagram("");
    setNewDjResident("");
    setMessage({ type: "neutral", text: "" });
  };

  const removeDjFromLineup = (index: number) => {
    setLineup((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const uploadPoster = async () => {
    if (!posterFile) return form.posterUrl;

    return new Promise<string>((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append("file", posterFile);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        setMessage({ type: "neutral", text: percent < 100 ? `Uploading poster... ${percent}%` : "Processing image..." });
      };
      xhr.onload = () => {
        setUploadProgress(100);
        try {
          const result = JSON.parse(xhr.responseText) as { success?: boolean; url?: string; error?: string };
          if (xhr.status >= 400 || !result.success || !result.url) {
            reject(new Error(result.error || "Failed to upload file"));
            return;
          }

          resolve(result.url);
        } catch {
          reject(new Error("Failed to upload file"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error - check connection"));
      xhr.open("POST", "/api/admin/upload");
      xhr.send(uploadData);
    });
  };

  const saveEvent = async () => {
    const title = form.title.trim();
    const eventDate = form.eventDate;

    if (!title || !eventDate) {
      setMessage({ type: "err", text: "Title and date are required" });
      return;
    }

    setSaving(true);
    setUploadProgress(posterFile ? 0 : null);
    setMessage({ type: "neutral", text: posterFile ? "Uploading poster... 0%" : "Saving..." });

    try {
      const posterUrl = await uploadPoster();
      const slug = form.slug.trim() || toSlug(form.displayTitle || title);
      const body = {
        title,
        displayTitle: form.displayTitle.trim(),
        slug,
        eventDate,
        location: form.location.trim(),
        ticketLink: form.ticketLink.trim(),
        racoLink: form.racoLink.trim(),
        mapsLink: form.mapsLink.trim(),
        coords: form.coords.trim(),
        description: form.description.trim(),
        posterUrl,
        isPublished: form.isPublished,
        lineup: lineup.map((item, index) => ({
          djName: item.djName,
          djInstagram: item.djInstagram,
          residentSlug: item.residentSlug,
          residentId: item.residentId || undefined,
          sortOrder: index,
        })),
        ...(editId ? { id: editId } : {}),
      };
      const response = await fetch("/api/admin/events", {
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

      setMessage({ type: "ok", text: "✓ Saved!" });
      window.setTimeout(() => {
        window.location.reload();
      }, 650);
    } catch (error) {
      setMessage({ type: "err", text: error instanceof Error ? error.message : "Network error - check connection" });
      setSaving(false);
    }
  };

  const deleteEvent = async (event: AdminEventRow) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;

    const response = await fetch(`/api/admin/events?id=${event.id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok || !result.success) {
      window.alert(result.error || "Failed to delete event");
      return;
    }

    setEvents((current) => current.filter((item) => item.id !== event.id));
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Events</h1>
        <button type="button" className={styles.createBtn} onClick={openAddModal}>
          + Add Event
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Lineup</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const status = getStatus(event.eventDate);

              return (
                <tr key={event.id}>
                  <td>
                    {event.posterUrl ? (
                      <img src={event.posterUrl} alt="" className={styles.posterThumb} />
                    ) : (
                      <div className={styles.posterPlaceholder}>-</div>
                    )}
                  </td>
                  <td className={styles.titleCell}>
                    <strong>{event.title}</strong>
                  </td>
                  <td className={styles.dateCell}>{formatDate(event.eventDate)}</td>
                  <td>{event.location || "-"}</td>
                  <td className={styles.lineupCell}>{getLineupText(event)}</td>
                  <td className={styles.statusCell}>
                    <span className={status.className}>{status.label}</span>
                    {!event.isPublished && <span className={styles.draftBadge}>Draft</span>}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button type="button" className={styles.editBtn} onClick={() => openEditModal(event)}>
                        Edit
                      </button>
                      <button type="button" className={styles.deleteBtn} onClick={() => deleteEvent(event)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  No events yet. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className={`${styles.modalOverlay} ${modalOpen ? styles.modalOverlayOpen : ""}`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>{editId ? "Edit Event" : "Add Event"}</div>
            <button type="button" className={styles.modalClose} onClick={closeModal}>
              {"\u00d7"}
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <label>Poster / Flyer</label>
              {posterPreview && <img src={posterPreview} alt="" className={styles.posterPreview} />}
              <input type="file" accept="image/*" onChange={(event) => handlePosterChange(event.target.files)} />
            </div>

            <div className={styles.formRow}>
              <label>Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="SACRISTY presents..."
              />
            </div>

            <div className={styles.formRowTwo}>
              <div>
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(event) => updateForm("eventDate", event.target.value)}
                />
              </div>
              <div>
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => updateForm("location", event.target.value)}
                  placeholder="Venue name, Bangkok"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label>Ticket Link</label>
              <input
                type="url"
                value={form.ticketLink}
                onChange={(event) => updateForm("ticketLink", event.target.value)}
                placeholder="https://ticketmelon.com/..."
              />
            </div>

            <div className={styles.formRow}>
              <label>RA.co Event Link</label>
              <input
                type="url"
                value={form.racoLink}
                onChange={(event) => updateForm("racoLink", event.target.value)}
                placeholder="https://ra.co/events/..."
              />
            </div>

            <div className={styles.formRow}>
              <label>
                Display Title <span>(shown on /events page)</span>
              </label>
              <input
                type="text"
                value={form.displayTitle}
                onChange={(event) => handleDisplayTitleChange(event.target.value)}
                placeholder="e.g. SACRISTY VOL. IX"
              />
            </div>

            <div className={styles.formRow}>
              <label>
                URL Slug <span>(auto-generated, editable)</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="sacristy-vol-ix"
              />
              <div className={styles.hint}>sacristybangkok.com/events/{form.slug || "..."}</div>
            </div>

            <div className={styles.formRow}>
              <label>
                Google Maps Link <span>(coordinates extracted automatically)</span>
              </label>
              <input
                type="url"
                value={form.mapsLink}
                onChange={(event) => updateForm("mapsLink", event.target.value)}
                placeholder="https://maps.app.goo.gl/... or long URL"
              />
              <div className={`${styles.hint} ${styles.coordsPreview}`}>{form.coords ? `Coords: ${form.coords}` : ""}</div>
            </div>

            <div className={styles.formRow}>
              <label>
                Event Description <span>(shown in expanded view on /events)</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Detailed info about the event..."
              />
            </div>

            <div className={styles.lineupSectionModal}>
              <label className={styles.lineupTitle}>Artist Lineup</label>
              <div className={styles.lineupListModal}>
                {lineup.length ? (
                  lineup.map((item, index) => (
                    <div key={`${item.djName}-${index}`} className={styles.lineupDj}>
                      <div className={styles.lineupDjName}>{item.djName}</div>
                      <div className={styles.lineupDjInfo}>{getInstagramLabel(item.djInstagram)}</div>
                      {item.residentSlug && <span className={styles.lineupDjBadge}>RESIDENT</span>}
                      <button type="button" className={styles.lineupDjRemove} onClick={() => removeDjFromLineup(index)}>
                        {"\u00d7"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyLineup}>No artists added yet</div>
                )}
              </div>

              <div className={styles.lineupAddGrid}>
                <div>
                  <label>DJ Name *</label>
                  <input
                    type="text"
                    value={newDjName}
                    onChange={(event) => setNewDjName(event.target.value)}
                    placeholder="REIKS"
                  />
                </div>
                <div>
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={newDjInstagram}
                    onChange={(event) => setNewDjInstagram(event.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <button type="button" className={styles.lineupAddButton} onClick={addDjToLineup}>
                  + Add
                </button>
              </div>

              <label>
                Link to Resident <span>(optional - auto-connects their profile)</span>
              </label>
              <select value={newDjResident} onChange={(event) => setNewDjResident(event.target.value)}>
                <option value="">{"\u2014 Guest artist \u2014"}</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.slug}>
                    {resident.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`${styles.formMsg} ${
                message.type === "err" ? styles.formMsgErr : message.type === "ok" ? styles.formMsgOk : ""
              }`}
            >
              {message.text}
            </div>
            {uploadProgress !== null && (
              <div className={styles.uploadProgress}>
                <div className={styles.uploadProgressFill} style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className={styles.saveBtn} onClick={saveEvent} disabled={saving}>
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
