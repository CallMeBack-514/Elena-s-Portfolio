// Integration: the launch-check script, run as `npm run check:launch` runs
// it, against fixture Text blocks.
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const READY_ENTRIES = "tests/fixtures/entries/ready";

function checkLaunch(textBlocksDir: string, entriesDir = READY_ENTRIES) {
  return spawnSync(process.execPath, ["scripts/check-launch.ts", textBlocksDir, entriesDir], {
    encoding: "utf8",
  });
}

describe("check-launch", () => {
  it("fails and lists every blocker", () => {
    const run = checkLaunch("tests/fixtures/text-blocks/blocked");
    expect(run.status).toBe(1);
    expect(run.stderr).toContain("contact.email: placeholder to confirm");
    expect(run.stderr).toContain("contact.links.0.label.en: not reviewed by Elena");
    expect(run.stderr).not.toContain("label.it");
  });

  it("passes when everything is reviewed and confirmed", () => {
    const run = checkLaunch("tests/fixtures/text-blocks/ready");
    expect(run.status).toBe(0);
  });

  it("fails and lists unreviewed Entry Descriptions, French included", () => {
    const run = checkLaunch("tests/fixtures/text-blocks/ready", "tests/fixtures/entries/blocked");
    expect(run.status).toBe(1);
    expect(run.stderr).toContain("articles/fleuve.description.fr: not reviewed by Elena");
    expect(run.stderr).toContain("articles/fleuve.description.it: not reviewed by Elena");
    expect(run.stderr).not.toContain("description.en");
  });

  it("fails rather than passing when the Entries directory is missing", () => {
    const run = checkLaunch("tests/fixtures/text-blocks/ready", "tests/fixtures/does-not-exist");
    expect(run.status).not.toBe(0);
  });

  it("fails rather than passing when the directory has no Text blocks", () => {
    const run = checkLaunch("tests/fixtures/does-not-exist");
    expect(run.status).not.toBe(0);
  });
});
