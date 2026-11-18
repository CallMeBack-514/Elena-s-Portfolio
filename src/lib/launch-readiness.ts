// What still stops the site from going public: text Elena has not reviewed
// (English and Italian in Text blocks; every Language in Entries, whose
// French we draft too), and values we invented that she must confirm.
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

type Checked = readonly string[];
const TEXT_BLOCK_LANGUAGES: Checked = ["en", "it"];
const ENTRY_LANGUAGES: Checked = ["fr", "en", "it"];

function walk(node: Json, path: string[], block: string, checked: Checked, found: Blocker[]): void {
  if (Array.isArray(node)) {
    node.forEach((child, index) => walk(child, [...path, String(index)], block, checked, found));
    return;
  }
  if (!isRecord(node)) return;

  if (node.placeholder === true) {
    found.push({ block, path: path.join("."), reason: "placeholder" });
  }
  for (const [key, child] of Object.entries(node)) {
    const isTranslation = checked.includes(key) && isRecord(child);
    // Anything short of an explicit `reviewed: true` blocks: this reads raw
    // files, so it cannot rely on the schema having rejected a missing flag.
    if (isTranslation && child.reviewed !== true) {
      found.push({ block, path: [...path, key].join("."), reason: "unreviewed" });
      continue;
    }
    walk(child, [...path, key], block, checked, found);
  }
}

/** Blockers in Text blocks, where French is Elena's own and never flagged. */
export function findBlockers(blocks: readonly { block: string }[]): Blocker[] {
  const found: Blocker[] = [];
  for (const { block, ...fields } of blocks) walk(fields, [], block, TEXT_BLOCK_LANGUAGES, found);
  return found;
}

/** Blockers in one Section's Entries, named "<section>/<id>". */
export function findEntryBlockers(section: string, entries: readonly { id: string }[]): Blocker[] {
  const found: Blocker[] = [];
  for (const { id, ...fields } of entries) {
    walk(fields, [], `${section}/${id}`, ENTRY_LANGUAGES, found);
  }
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

/**
 * Reads the raw Entry files (one JSON array per Section, named after it)
 * and returns their blockers.
 */
export function readEntryBlockers(dir: string): Blocker[] {
  const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
  if (files.length === 0) throw new Error(`no Entries found in ${dir}`);
  return files.flatMap((name) => {
    const entries: unknown = JSON.parse(readFileSync(join(dir, name), "utf8"));
    if (!Array.isArray(entries)) throw new Error(`${join(dir, name)} is not a JSON array`);
    return findEntryBlockers(name.replace(/\.json$/, ""), entries);
  });
}

/** Everything that blocks the launch, from the Text block and Entry files. */
export function allBlockers(textBlocksDir: string, entriesDir: string): Blocker[] {
  return [...findBlockers(readTextBlocks(textBlocksDir)), ...readEntryBlockers(entriesDir)];
}
