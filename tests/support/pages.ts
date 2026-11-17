// The built Visitor-facing pages, read from dist/ (task 7.1). Invariants
// iterate over this instead of a hard-coded list, so new pages are covered
// automatically.
//
// Call it inside a test, never at module level: Playwright collects tests
// before its web server runs `npm run build`, so on a fresh checkout dist/
// does not exist yet at collection time.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const DIST = "dist";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "_astro" ? [] : walk(path);
    return entry.name === "index.html" ? [path] : [];
  });
}

/** URL paths of every built page, e.g. ["/", "/en/", "/fr/", "/it/"]. */
export function builtPages(): string[] {
  const paths = walk(DIST).map((file) => {
    const dir = relative(DIST, file).split(sep).slice(0, -1).join("/");
    return dir ? `/${dir}/` : "/";
  });
  if (paths.length === 0) throw new Error("No built pages in dist/: did the build run?");
  return paths.sort();
}

/** The HTML of a built page. */
export function builtHtml(urlPath: string): string {
  return readFileSync(join(DIST, urlPath, "index.html"), "utf8");
}

/** The bare-address chooser redirects with JavaScript, so tests treat it apart. */
export const ROOT = "/";
