import type { Region, ChannelTier } from "../../src/types.js";

export interface PublisherMeta {
  id: string;
  name: string;
  homeRegion: Region;
  tier: ChannelTier;
  /** –1 (far left) to +1 (far right) */
  leanScore: number;
  country: string;
  accent: string;
  initials: string;
}

/** Keyed by lowercase publisher name or partial name for fuzzy lookup. */
const KNOWN: Record<string, PublisherMeta> = {
  "the guardian": { id: "guardian", name: "The Guardian", homeRegion: "Europe", tier: "major", leanScore: -0.35, country: "GB", accent: "#005689", initials: "GU" },
  "bbc news": { id: "bbc", name: "BBC News", homeRegion: "Europe", tier: "major", leanScore: -0.05, country: "GB", accent: "#BB1919", initials: "BB" },
  "bbc": { id: "bbc", name: "BBC News", homeRegion: "Europe", tier: "major", leanScore: -0.05, country: "GB", accent: "#BB1919", initials: "BB" },
  "reuters": { id: "reuters", name: "Reuters", homeRegion: "Europe", tier: "major", leanScore: 0.0, country: "GB", accent: "#FF8000", initials: "RE" },
  "associated press": { id: "ap", name: "Associated Press", homeRegion: "North America", tier: "major", leanScore: 0.0, country: "US", accent: "#D92228", initials: "AP" },
  "ap news": { id: "ap", name: "Associated Press", homeRegion: "North America", tier: "major", leanScore: 0.0, country: "US", accent: "#D92228", initials: "AP" },
  "the new york times": { id: "nyt", name: "The New York Times", homeRegion: "North America", tier: "major", leanScore: -0.2, country: "US", accent: "#000000", initials: "NY" },
  "new york times": { id: "nyt", name: "The New York Times", homeRegion: "North America", tier: "major", leanScore: -0.2, country: "US", accent: "#000000", initials: "NY" },
  "nytimes": { id: "nyt", name: "The New York Times", homeRegion: "North America", tier: "major", leanScore: -0.2, country: "US", accent: "#000000", initials: "NY" },
  "bloomberg": { id: "bloomberg", name: "Bloomberg", homeRegion: "North America", tier: "major", leanScore: 0.1, country: "US", accent: "#1A1A1A", initials: "BL" },
  "financial times": { id: "ft", name: "Financial Times", homeRegion: "Europe", tier: "major", leanScore: 0.15, country: "GB", accent: "#C9B08A", initials: "FT" },
  "ft.com": { id: "ft", name: "Financial Times", homeRegion: "Europe", tier: "major", leanScore: 0.15, country: "GB", accent: "#C9B08A", initials: "FT" },
  "the washington post": { id: "wapo", name: "The Washington Post", homeRegion: "North America", tier: "major", leanScore: -0.25, country: "US", accent: "#000000", initials: "WP" },
  "washington post": { id: "wapo", name: "The Washington Post", homeRegion: "North America", tier: "major", leanScore: -0.25, country: "US", accent: "#000000", initials: "WP" },
  "the wall street journal": { id: "wsj", name: "Wall Street Journal", homeRegion: "North America", tier: "major", leanScore: 0.4, country: "US", accent: "#0274B6", initials: "WJ" },
  "wall street journal": { id: "wsj", name: "Wall Street Journal", homeRegion: "North America", tier: "major", leanScore: 0.4, country: "US", accent: "#0274B6", initials: "WJ" },
  "al jazeera english": { id: "aljazeera", name: "Al Jazeera English", homeRegion: "Middle East", tier: "major", leanScore: -0.2, country: "QA", accent: "#8DC63F", initials: "AJ" },
  "al jazeera": { id: "aljazeera", name: "Al Jazeera English", homeRegion: "Middle East", tier: "major", leanScore: -0.2, country: "QA", accent: "#8DC63F", initials: "AJ" },
  "aljazeera": { id: "aljazeera", name: "Al Jazeera English", homeRegion: "Middle East", tier: "major", leanScore: -0.2, country: "QA", accent: "#8DC63F", initials: "AJ" },
  "south china morning post": { id: "scmp", name: "South China Morning Post", homeRegion: "Asia", tier: "major", leanScore: 0.1, country: "HK", accent: "#E94D1D", initials: "SC" },
  "scmp": { id: "scmp", name: "South China Morning Post", homeRegion: "Asia", tier: "major", leanScore: 0.1, country: "HK", accent: "#E94D1D", initials: "SC" },
  "the times of india": { id: "toi", name: "The Times of India", homeRegion: "Asia", tier: "major", leanScore: 0.05, country: "IN", accent: "#D2232A", initials: "TI" },
  "times of india": { id: "toi", name: "The Times of India", homeRegion: "Asia", tier: "major", leanScore: 0.05, country: "IN", accent: "#D2232A", initials: "TI" },
  "france 24": { id: "france24", name: "France 24", homeRegion: "Europe", tier: "major", leanScore: -0.1, country: "FR", accent: "#003189", initials: "F2" },
  "deutsche welle": { id: "dw", name: "Deutsche Welle", homeRegion: "Europe", tier: "major", leanScore: -0.05, country: "DE", accent: "#006AB3", initials: "DW" },
  "dw": { id: "dw", name: "Deutsche Welle", homeRegion: "Europe", tier: "major", leanScore: -0.05, country: "DE", accent: "#006AB3", initials: "DW" },
  "le monde": { id: "lemonde", name: "Le Monde", homeRegion: "Europe", tier: "major", leanScore: -0.15, country: "FR", accent: "#003189", initials: "LM" },
  "der spiegel": { id: "spiegel", name: "Der Spiegel", homeRegion: "Europe", tier: "major", leanScore: -0.2, country: "DE", accent: "#CC0000", initials: "DS" },
  "xinhua": { id: "xinhua", name: "Xinhua", homeRegion: "Asia", tier: "major", leanScore: 0.5, country: "CN", accent: "#DE2910", initials: "XH" },
  "arab news": { id: "arabnews", name: "Arab News", homeRegion: "Middle East", tier: "major", leanScore: 0.2, country: "SA", accent: "#006633", initials: "AN" },
  "the straits times": { id: "straitstimes", name: "The Straits Times", homeRegion: "Asia", tier: "major", leanScore: 0.05, country: "SG", accent: "#1A3E6C", initials: "ST" },
  "straits times": { id: "straitstimes", name: "The Straits Times", homeRegion: "Asia", tier: "major", leanScore: 0.05, country: "SG", accent: "#1A3E6C", initials: "ST" },
};

/** Looks up a publisher by name, falling back to a generated generic entry. */
export function resolvePublisher(sourceName: string): PublisherMeta {
  const key = sourceName.toLowerCase().trim();
  if (KNOWN[key]) return KNOWN[key];
  for (const [pattern, meta] of Object.entries(KNOWN)) {
    if (key.includes(pattern) || pattern.includes(key)) return meta;
  }
  // Generic fallback for unknown outlets
  return {
    id: key.replace(/[^a-z0-9]/g, "-"),
    name: sourceName,
    homeRegion: "Europe",
    tier: "regional",
    leanScore: 0,
    country: "GB",
    accent: "#4DB7C5",
    initials: sourceName.substring(0, 2).toUpperCase(),
  };
}
