// Shape of Elena's Entries (GLOSSARY: Entry) and the rules every Section
// shares: Published versus Draft, Elena's Order, the Outlet filter's slugs.
// Kept outside src/content.config.ts so unit tests can import it without
// astro:content. Build step 3 maps each field to a Supabase column.
//
// Unlike Text blocks, an Entry's French Description is drafted by us too,
// so all three Languages carry a `reviewed` flag (spec: prelaunch-visibility).
import { z } from "astro/zod";
import { LANGUAGES } from "./languages";

const text = z.string().trim().min(1);
const reviewedText = z.object({ value: text, reviewed: z.boolean() });

export const entryLocalized = z.object({ fr: reviewedText, en: reviewedText, it: reviewedText });
export type EntryLocalized = z.infer<typeof entryLocalized>;

/**
 * An Article (GLOSSARY: Article). `image` is passed in so the content
 * config can use Astro's `image()` helper while tests use a plain string.
 */
export function articleSchema<I extends z.ZodType>(image: I) {
  return z.object({
    status: z.enum(["published", "draft"]),
    order: z.number().int().positive(),
    workTitle: text,
    originalLanguage: z.enum(LANGUAGES),
    outlet: text,
    // https only: rejects http:, javascript: and relative addresses.
    url: z.url({ protocol: /^https$/, hostname: z.regexes.domain }),
    date: z.iso.date(),
    description: entryLocalized,
    image: image.optional(),
    // Sub-categories later (Reportage, Analyse); absent, the Card shows the
    // Section name.
    kicker: entryLocalized.optional(),
  });
}

interface Ordered {
  id: string;
  order: number;
}

/** Fails when two Entries of a Section share an Order. */
export function assertUniqueOrder(entries: readonly Ordered[]): void {
  const seen = new Map<number, string>();
  for (const { id, order } of entries) {
    const other = seen.get(order);
    if (other !== undefined) {
      throw new Error(`Entries "${other}" and "${id}" share Order ${order}: each needs its own`);
    }
    seen.set(order, id);
  }
}

/** The Outlet's path segment: "Télé-Québec" → "tele-quebec". */
export function outletSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Fails when an Outlet name gives no path (no Latin letters or digits), or
 * when two differently written names share one.
 */
export function assertDistinctOutletSlugs(names: readonly string[]): void {
  const seen = new Map<string, string>();
  for (const name of names) {
    const slug = outletSlug(name);
    if (slug === "") {
      throw new Error(
        `Outlet "${name}" gives an empty path: spell it with Latin letters or digits`,
      );
    }
    const other = seen.get(slug);
    if (other !== undefined && other !== name) {
      throw new Error(
        `Outlets "${other}" and "${name}" share the path "${slug}": spell them alike`,
      );
    }
    seen.set(slug, name);
  }
}

/** Published Entries only, in Elena's Order. The one place Drafts are dropped. */
export function publishedInOrder<E extends { status: string; order: number }>(
  entries: readonly E[],
): E[] {
  return entries.filter((e) => e.status === "published").sort((a, b) => a.order - b.order);
}

/** A Section's Preview on the Main page (GLOSSARY: Preview). */
export function previewOf<E>(entries: readonly E[]): E[] {
  return entries.slice(0, 3);
}
