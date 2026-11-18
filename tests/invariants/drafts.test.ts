// Invariant (spec: section-pages, "Draft Entries are never shown"): no built
// page shows, links to or names a Draft. Builds the real site once against a
// fixture holding one Published and one Draft Article, so it exercises the
// actual pages and the one filter that drops Drafts, not a copy of them.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const FIXTURE = "tests/fixtures/entries/drafts";
const DRAFT = { title: "Brouillon secret témoin", url: "ici.radio-canada.ca/fixture/2" };
const PUBLISHED = "Article publié témoin";

let outDir: string;
let pages: Map<string, string>;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

beforeAll(() => {
  // Inside the project, not the OS temp dir: Astro moves files with rename(),
  // which fails across filesystems. test-results/ is git-ignored.
  mkdirSync("test-results", { recursive: true });
  outDir = mkdtempSync(join("test-results", "drafts-build-"));
  const build = spawnSync("npx", ["astro", "build", "--outDir", outDir], {
    env: { ...process.env, ENTRIES_DIR: FIXTURE },
    encoding: "utf8",
  });
  if (build.status !== 0)
    throw new Error(`fixture build failed:\n${build.stdout}\n${build.stderr}`);
  pages = new Map(
    htmlFiles(outDir).map((file) => [
      "/" + relative(outDir, file).split(sep).join("/"),
      readFileSync(file, "utf8"),
    ]),
  );
}, 180_000);

afterAll(() => {
  if (outDir) rmSync(outDir, { recursive: true, force: true });
});

describe("a Draft Article", () => {
  it("appears on no page, in any Language, by title or by link", () => {
    expect(pages.size).toBeGreaterThan(10);
    for (const [path, html] of pages) {
      expect.soft(html.includes(DRAFT.title), `${path} names the Draft`).toBe(false);
      expect.soft(html.includes(DRAFT.url), `${path} links to the Draft`).toBe(false);
    }
  });

  it("does not create an Outlet filter page or filter link of its own", () => {
    const paths = [...pages.keys()];
    expect(paths.some((p) => p.includes("/articles/radio-canada/"))).toBe(false);
    // With one Outlet left, there is no filter at all (spec: articles-section).
    expect(paths.some((p) => p.includes("/articles/le-devoir/"))).toBe(false);
    expect(pages.get("/fr/articles/index.html")).not.toContain('class="filter"');
  });

  it("while the Published Article is shown, so the check is not vacuous", () => {
    for (const lang of ["fr", "en", "it"]) {
      expect(pages.get(`/${lang}/articles/index.html`)).toContain(PUBLISHED);
      expect(pages.get(`/${lang}/index.html`)).toContain(PUBLISHED);
    }
  });
});
