// Invariant (spec: prelaunch-visibility): until LAUNCHED is set, nothing is
// indexed. Every built page carries a robots noindex meta tag, and the host
// headers file sends X-Robots-Tag: noindex on every path.
import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { LAUNCHED } from "../../src/config/site";
import { builtHtml, builtPages, DIST } from "../support/pages";

const ROBOTS_META = '<meta name="robots" content="noindex, nofollow">';

test("noindex is on every page and every response until launch", () => {
  const headersFile = `${DIST}/_headers`;
  for (const path of builtPages()) {
    if (LAUNCHED) expect(builtHtml(path), path).not.toContain(ROBOTS_META);
    else expect(builtHtml(path), path).toContain(ROBOTS_META);
  }
  if (LAUNCHED) {
    expect(existsSync(headersFile) ? readFileSync(headersFile, "utf8") : "").not.toContain(
      "X-Robots-Tag",
    );
  } else {
    expect(readFileSync(headersFile, "utf8")).toMatch(
      /^\/\*\n\s+X-Robots-Tag: noindex, nofollow$/m,
    );
  }
});
