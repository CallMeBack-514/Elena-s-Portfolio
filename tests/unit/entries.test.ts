import { describe, expect, it } from "vitest";
import { z } from "astro/zod";
import {
  articleSchema,
  assertDistinctOutletSlugs,
  assertUniqueOrder,
  outletSlug,
  previewOf,
  publishedInOrder,
} from "../../src/lib/entries";

// The real collection uses Astro's image() helper; a string stands in here.
const schema = articleSchema(z.string());

const tr = (value: string) => ({ value, reviewed: false });

const article = {
  id: "fleuve",
  status: "published",
  order: 1,
  workTitle: "Le fleuve en hiver",
  originalLanguage: "fr",
  outlet: "Le Devoir",
  url: "https://www.ledevoir.com/societe/123/le-fleuve",
  date: "2026-03-12",
  description: { fr: tr("Un reportage."), en: tr("A report."), it: tr("Un reportage.") },
};

function issuePaths(input: unknown): string[] {
  const result = schema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("articleSchema", () => {
  it("accepts a complete Article, with or without an image", () => {
    expect(schema.safeParse(article).success).toBe(true);
    expect(schema.safeParse({ ...article, image: "./fleuve.jpg" }).success).toBe(true);
  });

  it("requires French Descriptions to say whether they were reviewed", () => {
    const description = { ...article.description, fr: { value: "Un reportage." } };
    expect(issuePaths({ ...article, description })).toContain("description.fr.reviewed");
  });

  it.each(["http://www.ledevoir.com/x", "javascript:alert(1)", "ftp://example.com/x", "/relative"])(
    "rejects the address %s",
    (url) => {
      expect(issuePaths({ ...article, url })).toContain("url");
    },
  );

  it("rejects an Original language that is not one of the three", () => {
    expect(issuePaths({ ...article, originalLanguage: "de" })).toContain("originalLanguage");
  });

  it("rejects a date that is not an ISO date", () => {
    expect(issuePaths({ ...article, date: "12 mars 2026" })).toContain("date");
  });

  it("rejects an Order that is not a positive integer", () => {
    expect(issuePaths({ ...article, order: 0 })).toContain("order");
    expect(issuePaths({ ...article, order: 1.5 })).toContain("order");
  });

  it("rejects an unknown status", () => {
    expect(issuePaths({ ...article, status: "hidden" })).toContain("status");
  });
});

describe("assertUniqueOrder", () => {
  it("accepts distinct Orders", () => {
    expect(() =>
      assertUniqueOrder([
        { id: "a", order: 1 },
        { id: "b", order: 2 },
      ]),
    ).not.toThrow();
  });

  it("names both Entries that share an Order", () => {
    expect(() =>
      assertUniqueOrder([
        { id: "a", order: 1 },
        { id: "b", order: 2 },
        { id: "c", order: 1 },
      ]),
    ).toThrow(/"a".*"c"|"c".*"a"/);
  });
});

describe("outletSlug", () => {
  it.each([
    ["Le Devoir", "le-devoir"],
    ["Radio-Canada", "radio-canada"],
    ["ICI RDI", "ici-rdi"],
    ["Télé-Québec", "tele-quebec"],
    ["  L'actualité ", "l-actualite"],
  ])("%s → %s", (name, slug) => {
    expect(outletSlug(name)).toBe(slug);
  });

  it("fails when two Outlets give the same slug", () => {
    expect(() => assertDistinctOutletSlugs(["Le Devoir", "Le devoir", "Radio-Canada"])).toThrow(
      /Le Devoir.*Le devoir/,
    );
  });

  it("accepts the same Outlet named twice", () => {
    expect(() => assertDistinctOutletSlugs(["Le Devoir", "Le Devoir"])).not.toThrow();
  });
});

describe("publishedInOrder and previewOf", () => {
  const entries = [
    { id: "c", status: "published", order: 3 },
    { id: "draft", status: "draft", order: 1 },
    { id: "a", status: "published", order: 2 },
    { id: "d", status: "published", order: 5 },
    { id: "e", status: "published", order: 4 },
  ] as const;

  it("drops Drafts and sorts by Order", () => {
    expect(publishedInOrder(entries).map((e) => e.id)).toEqual(["a", "c", "e", "d"]);
  });

  it("previews at most the first three", () => {
    expect(previewOf(publishedInOrder(entries)).map((e) => e.id)).toEqual(["a", "c", "e"]);
    expect(previewOf([{ id: "x" }])).toEqual([{ id: "x" }]);
  });
});
