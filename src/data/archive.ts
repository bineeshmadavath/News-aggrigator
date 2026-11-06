import { CLUSTERS } from "./mockData";
import { TODAY_KEY, daysBetween, formatShort } from "../lib/dates";
import type { StoryCluster } from "../types";

/**
 * Returns the news for a given day.
 * Today uses the full mock dataset. Past days are placeholders that reuse the
 * template stories with a different subset per day, to exercise the timeline.
 * Replace this function with a real API call when a backend exists.
 */
export function getClustersForDate(key: string): StoryCluster[] {
  if (key === TODAY_KEY) return CLUSTERS;

  const offset = Math.abs(daysBetween(key, TODAY_KEY));
  return CLUSTERS.filter((_, i) => (i + offset) % 4 !== 0).map((cluster) => ({
    ...cluster,
    id: `${cluster.id}-${key}`,
    articles: cluster.articles.map((article) => ({
      ...article,
      id: `${article.id}-${key}`,
      publishedAt: formatShort(key),
    })),
  }));
}
