// The build must fail, not warn, on a repeated Entry id: under Astro's
// default ("warn"), the file() loader keeps the last Article with that id and
// silently drops the other (found in review of PR #17).
import { describe, expect, it } from "vitest";
import config from "../../astro.config.mjs";

describe("astro.config", () => {
  it("treats a repeated id or path as an error", () => {
    expect(config.prerenderConflictBehavior).toBe("error");
  });
});
