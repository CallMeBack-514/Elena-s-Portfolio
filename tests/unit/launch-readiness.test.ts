import { describe, expect, it } from "vitest";
import { findBlockers } from "../../src/lib/launch-readiness";

const reviewed = (value: string) => ({ value, reviewed: true });

describe("findBlockers", () => {
  it("returns nothing for reviewed text with no placeholders", () => {
    const blocks = [
      {
        block: "these",
        question: { fr: { value: "Q?" }, en: reviewed("Q?"), it: reviewed("Q?") },
      },
      { block: "contact", email: { value: "elena@example.org", placeholder: false } },
    ];
    expect(findBlockers(blocks)).toEqual([]);
  });

  it("lists each unreviewed English or Italian value with its path", () => {
    const blocks = [
      {
        block: "portrait",
        bio: [{ fr: { value: "Bio" }, en: { value: "Bio", reviewed: false }, it: reviewed("Bio") }],
        byline: { fr: { value: "Par" }, en: reviewed("By"), it: { value: "Di", reviewed: false } },
      },
    ];
    expect(findBlockers(blocks)).toEqual([
      { block: "portrait", path: "bio.0.en", reason: "unreviewed" },
      { block: "portrait", path: "byline.it", reason: "unreviewed" },
    ]);
  });

  it("lists placeholder values", () => {
    const blocks = [{ block: "contact", email: { value: "x@example.com", placeholder: true } }];
    expect(findBlockers(blocks)).toEqual([
      { block: "contact", path: "email", reason: "placeholder" },
    ]);
  });

  it("never flags French, which is Elena's original", () => {
    const blocks = [
      {
        block: "site",
        tagline: { fr: { value: "Ligne" }, en: reviewed("Line"), it: reviewed("Linea") },
      },
    ];
    expect(findBlockers(blocks)).toEqual([]);
  });
});
