import type { Article, Publisher, Region, StoryCluster } from "../../src/types.js";
import { resolvePublisher } from "../utils/publisherMeta.js";

const BASE = "https://content.guardianapi.com/search";

/** Guardian section IDs for each app region. */
const SECTION_MAP: Record<Region, string> = {
  Europe: "world/europe-news",
  "North America": "us-news",
  Asia: "world/asia",
  "Middle East": "world/middle-east",
};

interface GuardianTag {
  id: string;
  type: string;
  webTitle: string;
}

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  tags: GuardianTag[];
  fields?: {
    standfirst?: string;
    headline?: string;
  };
}

interface GuardianResponse {
  response: {
    status: string;
    total: number;
    results: GuardianResult[];
  };
}

export async function fetchGuardianClusters(
  region: Region,
  date: string
): Promise<StoryCluster[]> {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) throw new Error("GUARDIAN_API_KEY not set");

  const params = new URLSearchParams({
    section: SECTION_MAP[region],
    "from-date": date,
    "to-date": date,
    "show-fields": "headline,standfirst",
    "show-tags": "keyword",
    "page-size": "20",
    "order-by": "relevance",
    "api-key": apiKey,
  });

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Guardian API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as GuardianResponse;
  const rawArticles = data.response.results;

  if (rawArticles.length === 0) return [];

  return groupIntoClusters(rawArticles, region);
}

function groupIntoClusters(
  rawArticles: GuardianResult[],
  region: Region
): StoryCluster[] {
  const publisher: Publisher = {
    id: "guardian",
    name: "The Guardian",
    homeRegion: "Europe",
    tier: "major",
  };
  const meta = resolvePublisher("The Guardian");

  // Count how many articles share each keyword tag.
  const tagFreq = new Map<string, number>();
  for (const a of rawArticles) {
    for (const tag of a.tags.filter((t) => t.type === "keyword").slice(0, 3)) {
      tagFreq.set(tag.id, (tagFreq.get(tag.id) ?? 0) + 1);
    }
  }

  // Tags shared by 2+ articles form cluster headings.
  const clusterTags = new Set(
    [...tagFreq.entries()].filter(([, n]) => n >= 2).map(([id]) => id)
  );

  const clusters = new Map<
    string,
    { tag: GuardianTag; articles: GuardianResult[] }
  >();
  const singletons: GuardianResult[] = [];

  for (const article of rawArticles) {
    const matchTag = article.tags.find((t) => clusterTags.has(t.id));
    if (matchTag) {
      if (!clusters.has(matchTag.id)) {
        clusters.set(matchTag.id, { tag: matchTag, articles: [] });
      }
      clusters.get(matchTag.id)!.articles.push(article);
    } else {
      singletons.push(article);
    }
  }

  const result: StoryCluster[] = [];

  // Multi-article clusters first, largest first, capped at 5.
  for (const { tag, articles } of [...clusters.values()]
    .sort((a, b) => b.articles.length - a.articles.length)
    .slice(0, 5)) {
    result.push({
      id: tag.id.replace(/\//g, "-"),
      title: tag.webTitle,
      summary:
        articles[0].fields?.standfirst?.replace(/<[^>]+>/g, "") ??
        articles[0].webTitle,
      region,
      articles: articles.map((a, i) =>
        toArticle(a, publisher, meta.leanScore, i)
      ),
    });
  }

  // Top singletons fill up to 6 total clusters.
  for (const a of singletons.slice(0, Math.max(0, 6 - result.length))) {
    result.push({
      id: a.id.replace(/\//g, "-"),
      title: a.fields?.headline ?? a.webTitle,
      summary:
        a.fields?.standfirst?.replace(/<[^>]+>/g, "") ?? a.webTitle,
      region,
      articles: [toArticle(a, publisher, meta.leanScore, 0)],
    });
  }

  return result;
}

function toArticle(
  raw: GuardianResult,
  publisher: Publisher,
  leanScore: number,
  _idx: number
): Article {
  return {
    id: raw.id.replace(/\//g, "-"),
    publisher,
    headline: raw.fields?.headline ?? raw.webTitle,
    url: raw.webUrl,
    publishedAt: new Date(raw.webPublicationDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    leanScore,
    claims: [],
  };
}
