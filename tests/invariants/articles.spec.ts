// Invariant (spec: articles-section): an Article has no detail page. Under
// /{lang}/articles/ there is only the Section page and one page per Outlet.
import { expect, test } from "@playwright/test";
import { builtPages } from "../support/pages";
import { outletSlug } from "../../src/lib/entries";
import { publishedArticles } from "../support/articles";

test("no Article detail pages: only the Articles page and the Outlet filter pages", () => {
  const outlets = new Set(publishedArticles().map((a) => outletSlug(a.outlet)));
  const allowed = outlets.size >= 2 ? outlets : new Set<string>();
  for (const path of builtPages()) {
    const match = path.match(/^\/(fr|en|it)\/articles\/(.*)$/);
    if (!match) continue;
    const rest = match[2].replace(/\/$/, "");
    if (rest === "") continue;
    expect(allowed.has(rest), `${path} is not an Outlet filter page`).toBe(true);
  }
});
