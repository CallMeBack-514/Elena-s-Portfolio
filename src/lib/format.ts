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
