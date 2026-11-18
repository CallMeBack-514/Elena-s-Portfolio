import { describe, expect, it } from "vitest";
import { formatDate, formatEntryDate } from "../../src/lib/format";

describe("formatEntryDate", () => {
  it("formats an ISO date as a long-form US date", () => {
    expect(formatEntryDate("2026-03-05")).toBe("March 5, 2026");
  });
});

describe("formatDate", () => {
  it.each([
    ["fr", "12 mars 2026"],
    ["en", "March 12, 2026"],
    ["it", "12 marzo 2026"],
  ] as const)("writes 2026-03-12 in %s as %s", (lang, expected) => {
    expect(formatDate("2026-03-12", lang)).toBe(expected);
  });

  it("does not shift the day in a time zone behind UTC", () => {
    const zone = process.env.TZ;
    process.env.TZ = "America/Toronto";
    try {
      expect(formatDate("2026-01-01", "en")).toBe("January 1, 2026");
    } finally {
      process.env.TZ = zone;
    }
  });
});
