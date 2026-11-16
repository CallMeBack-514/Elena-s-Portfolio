// Shape of Elena's Text blocks (GLOSSARY: Text block). Kept outside
// src/content.config.ts so unit tests can import it without astro:content.
//
// Every piece of Elena's prose is `localized`: present and non-empty in all
// three Languages, with no fallback (ADR-0006). English and Italian values
// also record whether Elena has reviewed them. That flag only exists during
// the static-data phase, and the Portal (build step 3) drops it.
import { z } from "astro/zod";

const text = z.string().trim().min(1);

export const localized = z.object({
  fr: z.object({ value: text }),
  en: z.object({ value: text, reviewed: z.boolean() }),
  it: z.object({ value: text, reviewed: z.boolean() }),
});
export type Localized = z.infer<typeof localized>;

// A value that is not translated (an email address). `placeholder` marks a
// value we invented that Elena still has to confirm before launch.
export const plain = z.object({ value: text, placeholder: z.boolean().default(false) });
export type Plain = z.infer<typeof plain>;

const site = z.object({
  block: z.literal("site"),
  tagline: localized,
  description: localized,
  location: plain,
});

const portrait = z.object({
  block: z.literal("portrait"),
  heading: localized,
  bio: z.array(localized).min(1),
  byline: localized,
  photo: z.object({ src: text, alt: localized }).optional(),
});

const collaborations = z.object({
  block: z.literal("collaborations"),
  items: z.array(z.object({ outlet: text, role: localized, years: text.optional() })).min(1),
});

const these = z.object({
  block: z.literal("these"),
  programme: localized,
  question: localized,
  summary: localized,
  terrain: localized,
  cadre: localized,
  livrable: localized,
  soutenance: localized,
});

const contact = z.object({
  block: z.literal("contact"),
  email: plain,
  links: z.array(z.object({ label: localized, url: z.url() })),
});

export const textBlockSchema = z.discriminatedUnion("block", [
  site,
  portrait,
  collaborations,
  these,
  contact,
]);
export type TextBlock = z.infer<typeof textBlockSchema>;
export type TextBlockOf<B extends TextBlock["block"]> = Extract<TextBlock, { block: B }>;
