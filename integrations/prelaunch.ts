// Pre-launch safety net (spec: prelaunch-visibility).
// - On build start, warns about everything `check:launch` would block on.
// - On build done, while LAUNCHED is false, writes dist/_headers so the host
//   sends `X-Robots-Tag: noindex, nofollow` on every response. Pages also
//   carry a robots meta (src/layouts/BaseLayout.astro).
import { writeFileSync } from "node:fs";
import type { AstroIntegration } from "astro";
import { LAUNCHED } from "../src/config/site.ts";
import { findBlockers, formatBlocker, readTextBlocks } from "../src/lib/launch-readiness.ts";

export const NOINDEX_HEADERS = "/*\n  X-Robots-Tag: noindex, nofollow\n";

export default function prelaunch(): AstroIntegration {
  return {
    name: "prelaunch",
    hooks: {
      "astro:build:start": ({ logger }) => {
        const blockers = findBlockers(readTextBlocks("src/data/text-blocks"));
        if (blockers.length === 0) return;
        logger.warn(
          `${blockers.length} item(s) must be reviewed or confirmed before launch:\n` +
            blockers.map((b) => `  - ${formatBlocker(b)}`).join("\n"),
        );
      },
      "astro:build:done": ({ dir, logger }) => {
        if (LAUNCHED) return;
        writeFileSync(new URL("_headers", dir), NOINDEX_HEADERS);
        logger.info("Not launched: wrote _headers with X-Robots-Tag noindex.");
      },
    },
  };
}
