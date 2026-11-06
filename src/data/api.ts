import type { Region, StoryCluster } from "../types";
import { getClustersForDate } from "./archive";

export type DataSource = "live" | "demo";

export interface ClustersResult {
  clusters: StoryCluster[];
  source: DataSource;
}

/**
 * Fetches live news clusters from the Express proxy server.
 * Falls back to mock/demo data transparently when:
 *   - The API server isn't running (Vite proxy connection refused)
 *   - API keys haven't been configured yet
 *   - The upstream news API returns an error
 *
 * The browser never contacts the news APIs directly — the proxy server
 * holds the keys.
 */
export async function fetchClusters(
  region: Region,
  date: string
): Promise<ClustersResult> {
  try {
    const params = new URLSearchParams({ region, date });
    const res = await fetch(`/api/clusters?${params}`);

    if (!res.ok) {
      // Log the real error for the developer, but don't crash the UI.
      const body = await res.json().catch(() => ({})) as { error?: string };
      console.warn("[news-api] Server error:", body.error ?? res.status);
      return { clusters: getClustersForDate(date), source: "demo" };
    }

    const clusters = (await res.json()) as StoryCluster[];
    return { clusters, source: "live" };
  } catch (err) {
    // Network error — server likely not running yet.
    console.warn("[news-api] Could not reach API server:", err);
    return { clusters: getClustersForDate(date), source: "demo" };
  }
}
