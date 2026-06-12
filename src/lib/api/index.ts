import { Event, Resident, ArchiveArtist } from "@/types";

const BASE_URL = "/api/public";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Unified fetch wrapper for Public API.
 */
async function fetchApi<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();
    return result as ApiResponse<T>;
  } catch (error) {
    console.error(`[API Client] Error fetching ${path}:`, error);
    return {
      success: false,
      error: "Network error or server unavailable",
    };
  }
}

export const api = {
  /**
   * Events
   */
  getUpcomingEvents: () => fetchApi<Event[]>("/events"),
  
  getArchiveEvents: () => fetchApi<Event[]>("/archive"),
  
  getEvent: (slug: string) => fetchApi<Event>(`/events/${slug}`),

  /**
   * Residents
   */
  getResidents: () => fetchApi<Resident[]>("/residents"),
  
  getResident: (slug: string) => fetchApi<Resident>(`/residents/${slug}`),

  /**
   * Artists Archive
   */
  getArtistArchive: () => fetchApi<ArchiveArtist[]>("/archive/artists"),

  /**
   * Settings
   */
  getSettings: () => fetchApi<Record<string, string>>("/settings"),

  /**
   * Analytics
   */
  trackPageView: (data: { page: string; referrer?: string | null; userAgent?: string }) => 
    fetchApi<void>("/stats", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
