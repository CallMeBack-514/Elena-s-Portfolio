// Content collections. Text blocks and Entries are local JSON files for now;
// build step 3 swaps these loaders for ones reading Supabase, and the pages
// stay unchanged.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { textBlockSchema } from "./lib/text-blocks";
import { articleSchema } from "./lib/entries";

// Tests point this at tests/fixtures/entries/<case>/ to build with known
// Drafts (tests/invariants/drafts.test.ts). Never set in a real build.
const ENTRIES_DIR = process.env.ENTRIES_DIR ?? "src/data/entries";

const textBlocks = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/text-blocks" }),
  schema: textBlockSchema,
});

const articles = defineCollection({
  loader: file(`${ENTRIES_DIR}/articles.json`),
  schema: ({ image }) => articleSchema(image()),
});

export const collections = { textBlocks, articles };
