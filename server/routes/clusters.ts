import { Router } from "express";
import type { Request, Response } from "express";
import type { Region, StoryCluster } from "../../src/types.js";
import { fetchGuardianClusters } from "../adapters/guardian.js";
import { fetchGNewsArticles } from "../adapters/gnews.js";

export const clustersRouter = Router();

/** Simple in-memory cache: (region:date) → { data, timestamp } */
const cache = new Map<string, { data: StoryCluster[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const VALID_REGIONS = new Set<Region>([
  "Europe",
  "North America",
  "Asia",
  "Middle East",
]);

clustersRouter.get("/clusters", async (req: Request, res: Response) => {
  const region = (req.query.region as string) ?? "Europe";
  const date = (req.query.date as string) ?? todayISO();

  if (!VALID_REGIONS.has(region as Region)) {
    res.status(400).json({ error: "Invalid region" });
    return;
  }

  const cacheKey = `${region}:${date}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    res.setHeader("X-Data-Source", "cache");
    res.json(cached.data);
    return;
  }

  try {
    // 1. Fetch primary clusters from Guardian.
    const clusters = await fetchGuardianClusters(region as Region, date);

    // 2. Enrich the top 3 clusters with cross-publisher articles from GNews.
    //    We do these sequentially to stay well inside GNews rate limits.
    for (let i = 0; i < Math.min(3, clusters.length); i++) {
      const cluster = clusters[i];
      const existingUrls = new Set(cluster.articles.map((a) => a.url));
      const extra = await fetchGNewsArticles(cluster.title, existingUrls, 2);
      cluster.articles = [...cluster.articles, ...extra];
    }

    cache.set(cacheKey, { data: clusters, ts: Date.now() });
    res.setHeader("X-Data-Source", "live");
    res.json(clusters);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[clusters]", message);
    res.status(502).json({ error: message });
  }
});

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
