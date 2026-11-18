// What a Card shows (spec: entry-cards), built from an Entry for one page
// Language. EntryCard.astro renders this shape and never sees an Entry, so
// 2b-2 adds a builder per Entry type (Clip, Show…) without touching it.
import type { ImageMetadata } from "astro";
import type { Language, Section } from "./languages";
import type { Article } from "./content";
import { inLang } from "./content";
import { formatDate } from "./format";
import { sectionName, t } from "../i18n/ui";

export interface CardView {
  href: string;
  /** Set when the Card leaves the site: the Outlet it leads to. */
  externalOutlet?: string;
  kicker: string;
  title: string;
  titleLang: Language;
  description: string;
  outlet: string;
  date: { iso: string; text: string };
  /** The Original language's code, shown only when it differs from the page's. */
  badge?: string;
  image?: ImageMetadata;
  /** Shown in the 3:2 placeholder when there is no image. */
  placeholder: string;
}

const SECTION: Section = "articles";

export function articleCard(article: Article, lang: Language): CardView {
  return {
    href: article.url,
    externalOutlet: article.outlet,
    kicker: article.kicker ? inLang(article.kicker, lang) : sectionName(lang, SECTION),
    title: article.workTitle,
    titleLang: article.originalLanguage,
    description: inLang(article.description, lang),
    outlet: article.outlet,
    date: { iso: article.date, text: formatDate(article.date, lang) },
    badge: article.originalLanguage === lang ? undefined : article.originalLanguage.toUpperCase(),
    image: article.image,
    placeholder: sectionName(lang, SECTION),
  };
}

/** The visually hidden text after an external Card's title: "(Le Devoir website)". */
export function externalSiteText(lang: Language, outlet: string): string {
  return t(lang, "card.externalSite").replace("{outlet}", outlet);
}
