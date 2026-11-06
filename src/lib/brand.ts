/**
 * Badge color, initials, and home country for each publisher, keyed by publisher name.
 * Countries are assumptions for these fictional outlets; change them to match your data.
 */
export const PUBLISHER_BRAND: Record<string, { initials: string; accent: string; country: string }> = {
  "Continental Daily": { initials: "CD", accent: "#003C51", country: "DE" },
  "Meridian Wire": { initials: "MW", accent: "#00798A", country: "BE" },
  "Harbor Journal": { initials: "HJ", accent: "#0E1E3A", country: "US" },
  "Cascade Tribune": { initials: "CT", accent: "#0097AC", country: "CA" },
  "Pacific Sentinel": { initials: "PS", accent: "#2C4A6B", country: "JP" },
  "Atlas Standard": { initials: "AS", accent: "#3D5A6C", country: "US" },
  "Mekong Ledger": { initials: "ML", accent: "#1F6F78", country: "VN" },
  "Gulf Dispatch": { initials: "GD", accent: "#5B4B8A", country: "AE" },
  "Levant Local": { initials: "LL", accent: "#8C3B33", country: "LB" },
};

/** Country names for accessible labels. */
export const COUNTRY_NAME: Record<string, string> = {
  DE: "Germany",
  BE: "Belgium",
  US: "United States",
  CA: "Canada",
  JP: "Japan",
  VN: "Vietnam",
  AE: "United Arab Emirates",
  LB: "Lebanon",
};
