import type { Article, LeanBucket, Region, StoryCluster } from "../types";

export const REGIONS: Region[] = ["North America", "Europe", "Asia", "Middle East"];
export const LEAN_BUCKETS: LeanBucket[] = ["left", "center", "right"];

export const LEAN_LABEL: Record<LeanBucket, string> = {
  left: "Left",
  center: "Center",
  right: "Right",
};

/** Maps a continuous lean score onto a three-way bucket. */
export function toLeanBucket(score: number): LeanBucket {
  if (score <= -0.25) return "left";
  if (score >= 0.25) return "right";
  return "center";
}

export interface FeedFilters {
  region: Region;
  majorOnly: boolean;
}

export interface FeedItem {
  cluster: StoryCluster;
  /** Articles visible under the current channel filter */
  articles: Article[];
  /** Lean buckets with zero visible coverage */
  missingLeans: LeanBucket[];
}

/**
 * Applies the region and channel-tier filters to the cluster list,
 * then derives which political lean buckets are absent from each cluster.
 */
export function buildFeed(clusters: StoryCluster[], { region, majorOnly }: FeedFilters): FeedItem[] {
  return clusters
    .filter((cluster) => cluster.region === region)
    .map((cluster) => {
      const articles = cluster.articles.filter(
        (article) => !majorOnly || article.publisher.tier === "major"
      );
      const present = new Set(articles.map((a) => toLeanBucket(a.leanScore)));
      const missingLeans = LEAN_BUCKETS.filter((bucket) => !present.has(bucket));
      return { cluster, articles, missingLeans };
    })
    .filter((item) => item.articles.length > 0);
}
