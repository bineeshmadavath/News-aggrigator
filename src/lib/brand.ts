/**
 * Display metadata for real news publishers.
 * Lean scores are approximations based on independent media-bias research;
 * they are not editorial judgments by this application.
 */
export const PUBLISHER_BRAND: Record<
  string,
  { initials: string; accent: string; country: string }
> = {
  "The Guardian": { initials: "GU", accent: "#005689", country: "GB" },
  "BBC News": { initials: "BB", accent: "#BB1919", country: "GB" },
  "Reuters": { initials: "RE", accent: "#FF8000", country: "GB" },
  "Associated Press": { initials: "AP", accent: "#D92228", country: "US" },
  "The New York Times": { initials: "NY", accent: "#000000", country: "US" },
  "Bloomberg": { initials: "BL", accent: "#1A1A1A", country: "US" },
  "Financial Times": { initials: "FT", accent: "#C9B08A", country: "GB" },
  "The Washington Post": { initials: "WP", accent: "#000000", country: "US" },
  "Wall Street Journal": { initials: "WJ", accent: "#0274B6", country: "US" },
  "Al Jazeera English": { initials: "AJ", accent: "#8DC63F", country: "QA" },
  "South China Morning Post": { initials: "SC", accent: "#E94D1D", country: "HK" },
  "The Times of India": { initials: "TI", accent: "#D2232A", country: "IN" },
  "France 24": { initials: "F2", accent: "#003189", country: "FR" },
  "Deutsche Welle": { initials: "DW", accent: "#006AB3", country: "DE" },
  "Le Monde": { initials: "LM", accent: "#003189", country: "FR" },
  "Der Spiegel": { initials: "DS", accent: "#CC0000", country: "DE" },
  "Xinhua": { initials: "XH", accent: "#DE2910", country: "CN" },
  "Arab News": { initials: "AN", accent: "#006633", country: "SA" },
  "The Straits Times": { initials: "ST", accent: "#1A3E6C", country: "SG" },
};

/** Human-readable country names for accessible labels. */
export const COUNTRY_NAME: Record<string, string> = {
  GB: "United Kingdom",
  US: "United States",
  CA: "Canada",
  JP: "Japan",
  QA: "Qatar",
  HK: "Hong Kong",
  IN: "India",
  FR: "France",
  DE: "Germany",
  CN: "China",
  AU: "Australia",
  SG: "Singapore",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  KR: "South Korea",
  BR: "Brazil",
  ZA: "South Africa",
  BE: "Belgium",
  VN: "Vietnam",
  LB: "Lebanon",
};
