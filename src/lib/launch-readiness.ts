// What still stops the site from going public: English or Italian text
// Elena has not reviewed, and values we invented that she must confirm.
// Shared by the build warning (integrations/prelaunch.ts), the launch
// check (scripts/check-launch.ts) and the tests. No Astro imports, so plain
// Node can run it.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface Blocker {
  block: string;
  path: string;
  reason: "unreviewed" | "placeholder";
}

type Json = unknown;

function isRecord(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function walk(node: Json, path: string[], block: string, found: Blocker[]): void {
  if (Array.isArray(node)) {
    node.forEach((child, index) => walk(child, [...path, String(index)], block, found));
    return;
  }
  if (!isRecord(node)) return;

  if (node.placeholder === true) {
    found.push({ block, path: path.join("."), reason: "placeholder" });
  }
  for (const [key, child] of Object.entries(node)) {
    const isTranslation = (key === "en" || key === "it") && isRecord(child);
    // Anything short of an explicit `reviewed: true` blocks: this reads raw
    // files, so it cannot rely on the schema having rejected a missing flag.
    if (isTranslation && child.reviewed !== true) {
      found.push({ block, path: [...path, key].join("."), reason: "unreviewed" });
      continue;
    }
    walk(child, [...path, key], block, found);
  }
}

export function findBlockers(blocks: readonly { block: string }[]): Blocker[] {
  const found: Blocker[] = [];
  for (const { block, ...fields } of blocks) walk(fields, [], block, found);
  return found;
}

export function formatBlocker({ block, path, reason }: Blocker): string {
  return `${block}.${path}: ${reason === "placeholder" ? "placeholder to confirm" : "not reviewed by Elena"}`;
}

/** Reads the raw Text block JSON files (no schema defaults applied). */
export function readTextBlocks(dir: string): { block: string }[] {
  const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
  if (files.length === 0) throw new Error(`no Text blocks found in ${dir}`);
  return files.map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")));
}
