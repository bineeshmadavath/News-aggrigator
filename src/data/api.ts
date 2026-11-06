import type { Region, StoryCluster } from "../types";

/**
 * Fetches live news clusters from the Express proxy server.
 * The proxy server holds the API keys; the browser never sees them.
 */
export async function fetchClusters(
  region: Region,
  date: string
): Promise<StoryCluster[]> {
  const params = new URLSearchParams({ region, date });
  const res = await fetch(`/api/clusters?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ??
        `Server error ${res.status}`
    );
  }
  return res.json() as Promise<StoryCluster[]>;
}
