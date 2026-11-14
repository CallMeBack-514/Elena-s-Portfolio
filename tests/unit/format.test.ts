import { describe, expect, it } from "vitest";
import { formatEntryDate } from "../../src/lib/format";

describe("formatEntryDate", () => {
  it("formats an ISO date as a long-form US date", () => {
    expect(formatEntryDate("2026-03-05")).toBe("March 5, 2026");
  });
});
