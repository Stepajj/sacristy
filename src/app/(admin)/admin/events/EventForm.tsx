"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.css";
import { Event, Resident } from "@/types";
import ImageUpload from "../components/ImageUpload";

interface EventFormProps {
  initialData?: Event;
  residents: Resident[];
}

type LineupFormItem = {
  residentId: number | "";
  djName: string;
  djInstagram: string;
  sortOrder: number;
};

function formatDateTimeLocal(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getApiError(result: unknown) {
  const data = result as { details?: { fieldErrors?: Record<string, string[]> }; error?: string };
  const fieldErrors = data?.details?.fieldErrors;
  if (fieldErrors) {
    const messages = Object.entries(fieldErrors)
      .flatMap(([field, errors]) => (errors as string[]).map((message) => `${field}: ${message}`));

    if (messages.length) return messages.join(" ");
  }

  return data?.error || "Failed to save event";
}

export default function EventForm({ initialData, residents }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    displayTitle: initialData?.displayTitle || "",
    slug: initialData?.slug || "",
    eventDate: formatDateTimeLocal(initialData?.eventDate),
    location: initialData?.location || "",
    mapsLink: initialData?.mapsLink || "",
    racoLink: initialData?.racoLink || "",
    posterUrl: initialData?.posterUrl || "",
    ticketLink: initialData?.ticketLink || "",
    description: initialData?.description || "",
    isPublished: initialData?.isPublished ?? true,
    lineup: (initialData?.lineup?.map(item => ({
      residentId: item.residentId || "",
      djName: item.djName || "",
      djInstagram: item.djInstagram || "",
      sortOrder: item.sortOrder
    })) || []) as LineupFormItem[]
  });

  const addLineupItem = () => {
    setFormData({
      ...formData,
      lineup: [...formData.lineup, { residentId: "", djName: "", djInstagram: "", sortOrder: formData.lineup.length }]
    });
  };

  const removeLineupItem = (index: number) => {
    const newLineup = formData.lineup.filter((_, i) => i !== index);
    setFormData({ ...formData, lineup: newLineup });
  };

  const updateLineupItem = <Key extends keyof LineupFormItem>(index: number, field: Key, value: LineupFormItem[Key]) => {
    const newLineup = [...formData.lineup];
    newLineup[index] = { ...newLineup[index], [field]: value };
    
    // If resident is selected, clear custom DJ info
    if (field === "residentId" && value) {
      newLineup[index].djName = "";
      newLineup[index].djInstagram = "";
    }
    
    setFormData({ ...formData, lineup: newLineup });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = "/api/admin/events";
      const method = initialData ? "PATCH" : "POST";
      const body = initialData ? { ...formData, id: initialData.id } : formData;

      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (result.success) {
        router.push("/admin/events");
        router.refresh();
      } else {
        setError(getApiError(result));
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/events?id=${initialData?.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        router.push("/admin/events");
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
          <h3 className={styles.sectionTitle}>BASIC INFO</h3>
          <div className={styles.inputGroup}>
            <label>TITLE</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className={styles.inputGroup}>
            <label>DISPLAY TITLE</label>
            <input value={formData.displayTitle} onChange={e => setFormData({...formData, displayTitle: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>SLUG</label>
            <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
          </div>
          <div className={styles.inputGroup}>
            <label>DATE & TIME</label>
            <input type="datetime-local" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required />
          </div>
          <div className={styles.inputGroup}>
            <label>LOCATION</label>
            <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>MAPS LINK</label>
            <input value={formData.mapsLink} onChange={e => setFormData({...formData, mapsLink: e.target.value})} />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>MEDIA & LINKS</h3>
          <ImageUpload 
            label="POSTER" 
            value={formData.posterUrl} 
            onChange={url => setFormData({...formData, posterUrl: url})} 
          />
          <div className={styles.inputGroup}>
            <label>TICKET LINK</label>
            <input value={formData.ticketLink} onChange={e => setFormData({...formData, ticketLink: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>RA LINK</label>
            <input value={formData.racoLink} onChange={e => setFormData({...formData, racoLink: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>DESCRIPTION</label>
            <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className={styles.checkboxGroup}>
            <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} id="isPublished" />
            <label htmlFor="isPublished">PUBLISHED</label>
          </div>
        </div>
      </div>

      <div className={styles.lineupSection}>
        <div className={styles.lineupHeader}>
          <h3 className={styles.sectionTitle}>LINEUP</h3>
          <button type="button" onClick={addLineupItem} className={styles.addBtn}>+ ADD ARTIST</button>
        </div>
        
        <div className={styles.lineupList}>
          {formData.lineup.map((item, index) => (
            <div key={index} className={styles.lineupItem}>
              <div className={styles.lineupInputs}>
                <div className={styles.inputGroup}>
                  <label>RESIDENT</label>
                  <select 
                    value={item.residentId} 
                    onChange={e => updateLineupItem(index, "residentId", e.target.value ? parseInt(e.target.value) : "")}
                  >
                    <option value="">-- CUSTOM DJ --</option>
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {!item.residentId && (
                  <>
                    <div className={styles.inputGroup}>
                      <label>DJ NAME</label>
                      <input 
                        value={item.djName} 
                        onChange={e => updateLineupItem(index, "djName", e.target.value)} 
                        placeholder="DJ Name"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>DJ INSTAGRAM</label>
                      <input 
                        value={item.djInstagram} 
                        onChange={e => updateLineupItem(index, "djInstagram", e.target.value)} 
                        placeholder="@username"
                      />
                    </div>
                  </>
                )}
                
                <div className={styles.inputGroup}>
                  <label>ORDER</label>
                  <input 
                    type="number" 
                    value={item.sortOrder} 
                    onChange={e => updateLineupItem(index, "sortOrder", parseInt(e.target.value))} 
                    style={{ width: '60px' }}
                  />
                </div>
              </div>
              <button type="button" onClick={() => removeLineupItem(index)} className={styles.removeBtn}>REMOVE</button>
            </div>
          ))}
          {formData.lineup.length === 0 && (
            <p className={styles.emptyMsg}>No artists in lineup yet.</p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? "SAVING..." : "SAVE EVENT"}
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
