// `npm run check:launch`: exits non-zero while anything stops the site from
// going public (see src/lib/launch-readiness.ts). /sdd-release runs it
// before flipping LAUNCHED. Runs on plain Node 24 (type stripping).
//
// Usage: node scripts/check-launch.ts [text-blocks directory] [entries directory]
import { allBlockers, formatBlocker, type Blocker } from "../src/lib/launch-readiness.ts";

const textBlocksDir = process.argv[2] ?? "src/data/text-blocks";
const entriesDir = process.argv[3] ?? "src/data/entries";

let blockers: Blocker[];
try {
  blockers = allBlockers(textBlocksDir, entriesDir);
} catch (error) {
  console.error(`check:launch: ${(error as Error).message}`);
  process.exit(2);
}

if (blockers.length > 0) {
  console.error(`check:launch: ${blockers.length} item(s) block the launch:`);
  for (const blocker of blockers) console.error(`  - ${formatBlocker(blocker)}`);
  process.exit(1);
}
console.log("check:launch: ready to launch.");
