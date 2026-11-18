// Invariant (spec: site-languages, ADR-0006): Elena's prose (Text blocks
// and Entry Descriptions) exists in every Language. The schemas are what
// fail the build, so they are tested directly here rather than by running a
// whole build inside a test.
import { describe, expect, it } from "vitest";
import { z } from "astro/zod";
import { textBlockSchema } from "../../src/lib/text-blocks";
import { articleSchema } from "../../src/lib/entries";

const tr = (value: string) => ({ value, reviewed: false });

const portrait = {
  block: "portrait",
  heading: { fr: { value: "Journaliste" }, en: tr("Journalist"), it: tr("Giornalista") },
  bio: [{ fr: { value: "Bio." }, en: tr("Bio."), it: tr("Bio.") }],
  byline: { fr: { value: "Par Elena" }, en: tr("By Elena"), it: tr("Di Elena") },
};

function issuePaths(input: unknown, schema: z.ZodType = textBlockSchema): string[] {
  const result = schema.safeParse(input);
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

const article = {
  status: "published",
  order: 1,
  workTitle: "Le fleuve en hiver",
  originalLanguage: "fr",
  outlet: "Le Devoir",
  url: "https://www.ledevoir.com/societe/1/le-fleuve",
  date: "2026-03-12",
  description: { fr: tr("Un reportage."), en: tr("A report."), it: tr("Un reportage.") },
};
const articleIssues = (input: unknown) => issuePaths(input, articleSchema(z.string()));

describe("an Entry Description missing a Language is rejected", () => {
  it.each(["fr", "en", "it"] as const)("when %s is absent, naming the field", (lang) => {
    const description: Record<string, unknown> = { ...article.description };
    delete description[lang];
    expect(articleIssues({ ...article, description })).toContain(`description.${lang}`);
  });

  it("when a Language is empty, naming the field", () => {
    const description = { ...article.description, en: tr("  ") };
    expect(articleIssues({ ...article, description })).toContain("description.en.value");
  });

  it("when the Description is absent", () => {
    const noDescription: Record<string, unknown> = { ...article };
    delete noDescription.description;
    expect(articleIssues(noDescription)).toContain("description");
  });
});
