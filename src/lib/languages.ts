// The site's three Languages (GLOSSARY: Language). French is the default:
// it is Elena's working language and the fallback for the bare address.
export const LANGUAGES = ["fr", "en", "it"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "fr";

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

/**
 * The Language to send a Visitor to from the bare address: the first of
 * their browser's preferred languages we support, matched on the primary
 * subtag ("en-CA" → "en"), otherwise French.
 */
export function pickLanguage(preferences: readonly string[]): Language {
  for (const tag of preferences) {
    const primary = tag.split("-")[0]?.toLowerCase() ?? "";
    if (isLanguage(primary)) return primary;
  }
  return DEFAULT_LANGUAGE;
}

// The Sections, in nav order. `id` is the anchor and the future URL path,
// identical in every Language; the visible names live in src/i18n/ui.ts.
export const SECTIONS = ["articles", "tele", "balados", "these", "art"] as const;
export type Section = (typeof SECTIONS)[number];
