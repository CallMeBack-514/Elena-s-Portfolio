// Content collections. Text blocks are local JSON files for now; build step
// 3 swaps this loader for one reading Supabase, and the pages stay unchanged.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { textBlockSchema } from "./lib/text-blocks";

const textBlocks = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/text-blocks" }),
  schema: textBlockSchema,
});

export const collections = { textBlocks };
