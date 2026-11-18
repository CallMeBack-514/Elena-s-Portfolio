// Reading content in pages. The only module that knows where Text blocks
// and Entries come from: build step 3 changes the collections' loaders, not
// this API.
import { getCollection, getEntry } from "astro:content";
import type { Language, Section } from "./languages";
import type { Localized, TextBlock, TextBlockOf } from "./text-blocks";
import {
  assertDistinctOutletSlugs,
  assertUniqueOrder,
  previewOf,
  publishedInOrder,
  type EntryLocalized,
} from "./entries";

export async function textBlock<B extends TextBlock["block"]>(id: B): Promise<TextBlockOf<B>> {
  const entry = await getEntry("textBlocks", id);
  if (!entry || entry.data.block !== id) {
    throw new Error(`Text block "${id}" is missing: add src/data/text-blocks/${id}.json`);
  }
  return entry.data as TextBlockOf<B>;
}

/** A localized value in one Language. */
export function inLang(field: Localized | EntryLocalized, lang: Language): string {
  return field[lang].value;
}

export type Article = Awaited<ReturnType<typeof articles>>[number];

async function articles() {
  const all = (await getCollection("articles")).map((entry) => ({ ...entry.data, id: entry.id }));
  // Checked across the whole Section, Drafts included, so a clash fails the
  // build even before it would be visible.
  assertUniqueOrder(all);
  assertDistinctOutletSlugs(all.map((a) => a.outlet));
  return all;
}

/**
 * A Section's Published Entries in Elena's Order. Sections without Entries
 * yet (Télé, Balados, Art until 2b-2; Thèse always) have none.
 */
export async function publishedEntries(section: Section): Promise<Article[]> {
  if (section !== "articles") return [];
  return publishedInOrder(await articles());
}

/** A Section's Preview on the Main page (GLOSSARY: Preview). */
export async function preview(section: Section): Promise<Article[]> {
  return previewOf(await publishedEntries(section));
}
