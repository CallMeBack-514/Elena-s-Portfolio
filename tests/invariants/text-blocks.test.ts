// Invariant (spec: site-languages, ADR-0006): Elena's prose exists in every
// Language. The Text block schema is what fails the build, so it is tested
// directly here rather than by running a whole build inside a test.
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

describe("a Text block missing a Language is rejected", () => {
  it("when the Language is absent, naming the field", () => {
    const noItalian = { fr: portrait.byline.fr, en: portrait.byline.en };
    expect(issuePaths({ ...portrait, byline: noItalian })).toContain("byline.it");
  });

  it("when the Language is empty, naming the field", () => {
    const bio = [{ ...portrait.bio[0], it: tr("   ") }];
    expect(issuePaths({ ...portrait, bio })).toContain("bio.0.it.value");
  });

  it("including French, which has no fallback either", () => {
    const heading = { en: portrait.heading.en, it: portrait.heading.it };
    expect(issuePaths({ ...portrait, heading })).toContain("heading.fr");
  });
});
