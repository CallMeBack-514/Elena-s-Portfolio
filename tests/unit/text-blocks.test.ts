import { describe, expect, it } from "vitest";
import { textBlockSchema } from "../../src/lib/text-blocks";

const tr = (value: string) => ({ value, reviewed: false });

const portrait = {
  block: "portrait",
  heading: { fr: { value: "Journaliste" }, en: tr("Journalist"), it: tr("Giornalista") },
  bio: [{ fr: { value: "Bio." }, en: tr("Bio."), it: tr("Bio.") }],
  byline: { fr: { value: "Par Elena" }, en: tr("By Elena"), it: tr("Di Elena") },
};

function issuePaths(input: unknown): string[] {
  const result = textBlockSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("textBlockSchema", () => {
  it("accepts a complete Text block", () => {
    expect(textBlockSchema.safeParse(portrait).success).toBe(true);
  });

  it("rejects a missing Language, naming the field", () => {
    const noItalian = { fr: portrait.byline.fr, en: portrait.byline.en };
    expect(issuePaths({ ...portrait, byline: noItalian })).toContain("byline.it");
  });

  it("rejects an empty Language value, naming the field", () => {
    const bio = [{ ...portrait.bio[0], it: tr("   ") }];
    expect(issuePaths({ ...portrait, bio })).toContain("bio.0.it.value");
  });

  it("requires English and Italian values to say whether they were reviewed", () => {
    const heading = { ...portrait.heading, en: { value: "Journalist" } };
    expect(issuePaths({ ...portrait, heading })).toContain("heading.en.reviewed");
  });

  it("rejects an unknown block", () => {
    expect(textBlockSchema.safeParse({ block: "unknown" }).success).toBe(false);
  });
});
