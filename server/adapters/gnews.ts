import type { Article, Publisher } from "../../src/types.js";
import { resolvePublisher } from "../utils/publisherMeta.js";

const SEARCH_BASE = "https://gnews.io/api/v4/search";

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string; url: string };
}

interface GNewsResponse {
  articles: GNewsArticle[];
}

/**
 * Searches GNews for articles related to a topic keyword and returns them as
 * Articles, skipping any that originate from The Guardian (already in the
 * primary cluster) or whose URL is already represented.
 */
export async function fetchGNewsArticles(
  query: string,
  existingUrls: Set<string>,
  max = 3
): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return []; // gracefully no-op when key absent

  // Strip special characters so the query is safe.
  const q = query.replace(/[^\w\s]/g, " ").trim().split(/\s+/).slice(0, 5).join(" ");
  if (!q) return [];

  const params = new URLSearchParams({
    q,
    lang: "en",
    max: String(max + 2), // fetch a few extras to account for filtered-out items
    apikey: apiKey,
  });

  try {
    const res = await fetch(`${SEARCH_BASE}?${params}`);
    if (!res.ok) return [];
    const data = (await res.json()) as GNewsResponse;
    const articles: Article[] = [];

    for (const a of data.articles) {
      if (articles.length >= max) break;
      // Skip duplicates and Guardian articles (already the primary source).
      if (existingUrls.has(a.url)) continue;
      if (a.source.url.includes("theguardian.com")) continue;

      const meta = resolvePublisher(a.source.name);
      const publisher: Publisher = {
        id: meta.id,
        name: meta.name,
        homeRegion: meta.homeRegion,
        tier: meta.tier,
      };

      existingUrls.add(a.url);
      articles.push({
        id: `gnews-${Buffer.from(a.url).toString("base64").slice(0, 16)}`,
        publisher,
        headline: a.title,
        url: a.url,
        publishedAt: new Date(a.publishedAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        leanScore: meta.leanScore,
        claims: [],
      });
    }

    return articles;
  } catch {
    return []; // never crash the main request over a secondary source
  }
}
