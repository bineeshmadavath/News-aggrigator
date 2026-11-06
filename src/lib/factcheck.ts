import type { Article, Claim, Region, Verdict } from "../types";
import { DAY_KEYS } from "./dates";
import { getClustersForDate } from "../data/archive";

/** One extracted claim with the context needed to show where it came from. */
export interface FactCheckRecord {
  key: string;
  claim: Claim;
  article: Article;
  clusterTitle: string;
  region: Region;
  dateKey: string;
}

export interface FactCheckFilters {
  text: string;
  /** Publisher name, or "all" */
  publisher: string;
  /** Verdict, or "all" */
  verdict: Verdict | "all";
}

/** Gathers every claim from every day in the timeline, newest first. */
export function collectFactChecks(): FactCheckRecord[] {
  const records: FactCheckRecord[] = [];
  for (const dateKey of DAY_KEYS) {
    for (const cluster of getClustersForDate(dateKey)) {
      for (const article of cluster.articles) {
        for (const claim of article.claims) {
          records.push({
            key: `${dateKey}|${article.id}|${claim.id}`,
            claim,
            article,
            clusterTitle: cluster.title,
            region: cluster.region,
            dateKey,
          });
        }
      }
    }
  }
  return records.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

/**
 * Filters records by publisher and verdict, then requires every search term
 * to appear somewhere in the claim, its rationale, headline, topic, publisher, or sources.
 */
export function searchFactChecks(records: FactCheckRecord[], filters: FactCheckFilters): FactCheckRecord[] {
  const terms = filters.text.toLowerCase().split(/\s+/).filter(Boolean);
  return records.filter((r) => {
    if (filters.publisher !== "all" && r.article.publisher.name !== filters.publisher) return false;
    if (filters.verdict !== "all" && r.claim.verdict !== filters.verdict) return false;
    if (terms.length === 0) return true;
    const haystack = [
      r.claim.text,
      r.claim.rationale,
      r.article.headline,
      r.clusterTitle,
      r.article.publisher.name,
      ...r.claim.sources.map((s) => `${s.outlet} ${s.reference}`),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
