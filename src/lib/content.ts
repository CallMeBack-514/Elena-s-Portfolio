// Reading Text blocks in pages. The only module that knows where Text blocks
// come from: build step 3 changes the collection's loader, not this API.
import { getEntry } from "astro:content";
import type { Language } from "./languages";
import type { Localized, TextBlock, TextBlockOf } from "./text-blocks";

export async function textBlock<B extends TextBlock["block"]>(id: B): Promise<TextBlockOf<B>> {
  const entry = await getEntry("textBlocks", id);
  if (!entry || entry.data.block !== id) {
    throw new Error(`Text block "${id}" is missing: add src/data/text-blocks/${id}.json`);
  }
  return entry.data as TextBlockOf<B>;
}

/** A localized value in one Language. */
export function inLang(field: Localized, lang: Language): string {
  return field[lang].value;
}
