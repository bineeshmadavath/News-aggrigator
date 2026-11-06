/** Fixed "today" for the demo: Tuesday, 3 November 2026. Months are 0-indexed. */
export const TODAY = new Date(2026, 10, 3);

export const toKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const TODAY_KEY = toKey(TODAY);

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** The last 14 days, ascending, ending today. */
export const DAY_KEYS: string[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - (13 - i));
  return toKey(d);
});

export function formatDay(key: string) {
  const d = parseKey(key);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: d.getDate(),
  };
}

export function formatLong(key: string): string {
  return parseKey(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShort(key: string): string {
  return parseKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parseKey(to).getTime() - parseKey(from).getTime()) / 86400000);
}
