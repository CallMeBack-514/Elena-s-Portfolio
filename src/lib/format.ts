import type { Language } from "./languages";

export function formatEntryDate(iso: string): string {
  // Date-only ISO strings ("2026-03-05") parse as UTC midnight. Formatting
  // in UTC too avoids the date shifting by a day in timezones behind UTC.
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** An Entry's date in the page's Language: "12 mars 2026" (spec: entry-cards). */
export function formatDate(iso: string, lang: Language): string {
  // Pinned to UTC for the same reason as above: a date-only ISO string is
  // UTC midnight, and the build machine's zone must not move the day.
  return new Date(iso).toLocaleDateString(lang, { dateStyle: "long", timeZone: "UTC" });
}
