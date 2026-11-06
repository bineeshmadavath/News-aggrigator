export type Region = "North America" | "Europe" | "Asia" | "Middle East";
export type ChannelTier = "major" | "regional";
export type LeanBucket = "left" | "center" | "right";
export type Verdict = "supported" | "partially-supported" | "disputed" | "unverified";

export interface Publisher {
  id: string;
  name: string;
  homeRegion: Region;
  tier: ChannelTier;
}

export interface ClaimSource {
  outlet: string;
  stance: "corroborates" | "contradicts" | "context";
  reference: string;
}

export interface ClaimBasis {
  metric: string;
  value: string;
  rule: string;
}

export interface Claim {
  id: string;
  text: string;
  verdict: Verdict;
  /** Model confidence in the verdict, 0 to 1 */
  confidence: number;
  rationale: string;
  /** The measured value and rule behind the verdict, shown on hover. */
  basis: ClaimBasis;
  sources: ClaimSource[];
}

export interface Article {
  id: string;
  publisher: Publisher;
  headline: string;
  url: string;
  publishedAt: string;
  /** -1 (far left) to +1 (far right) */
  leanScore: number;
  claims: Claim[];
}

export interface StoryCluster {
  id: string;
  title: string;
  summary: string;
  region: Region;
  articles: Article[];
}
