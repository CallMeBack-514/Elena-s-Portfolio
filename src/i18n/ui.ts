// Interface text (not Elena's prose; that lives in src/data/text-blocks/).
// `satisfies` makes a key missing from any Language a typecheck error.
import type { Language, Section } from "../lib/languages";

const fr = {
  "nav.label": "Sections",
  "lang.label": "Langue",
  "theme.toDark": "Passer au thème sombre",
  "theme.toLight": "Passer au thème clair",
  "section.articles": "Articles",
  "section.tele": "Télé",
  "section.balados": "Balados",
  "section.these": "Thèse",
  "section.art": "Art",
  comingSoon: "En cours d'ajout.",
  "portrait.heading": "Portrait",
  "collaborations.heading": "Collaborations",
  "these.terrain": "Terrain",
  "these.cadre": "Cadre",
  "these.livrable": "Livrable",
  "these.soutenance": "Soutenance",
  "contact.heading": "Contact",
  "contact.email": "Courriel",
  "root.choose": "Choisir une langue",
} as const;

type UiKey = keyof typeof fr;

export const ui = {
  fr,
  en: {
    "nav.label": "Sections",
    "lang.label": "Language",
    "theme.toDark": "Switch to dark theme",
    "theme.toLight": "Switch to light theme",
    "section.articles": "Articles",
    "section.tele": "TV",
    "section.balados": "Podcasts",
    "section.these": "Thesis",
    "section.art": "Art",
    comingSoon: "Coming soon.",
    "portrait.heading": "Portrait",
    "collaborations.heading": "Collaborations",
    "these.terrain": "Field",
    "these.cadre": "Framework",
    "these.livrable": "Deliverable",
    "these.soutenance": "Defence",
    "contact.heading": "Contact",
    "contact.email": "Email",
    "root.choose": "Choose a language",
  },
  it: {
    "nav.label": "Sezioni",
    "lang.label": "Lingua",
    "theme.toDark": "Passa al tema scuro",
    "theme.toLight": "Passa al tema chiaro",
    "section.articles": "Articoli",
    "section.tele": "TV",
    "section.balados": "Podcast",
    "section.these": "Tesi",
    "section.art": "Arte",
    comingSoon: "In arrivo.",
    "portrait.heading": "Ritratto",
    "collaborations.heading": "Collaborazioni",
    "these.terrain": "Campo",
    "these.cadre": "Quadro teorico",
    "these.livrable": "Prodotto finale",
    "these.soutenance": "Discussione",
    "contact.heading": "Contatti",
    "contact.email": "Email",
    "root.choose": "Scegli una lingua",
  },
} as const satisfies Record<Language, Record<UiKey, string>>;

export function t(lang: Language, key: UiKey): string {
  return ui[lang][key];
}

export function sectionName(lang: Language, section: Section): string {
  return ui[lang][`section.${section}`];
}

// Each Language's name in that Language, for the switcher.
export const LANGUAGE_NAMES: Record<Language, string> = {
  fr: "Français",
  en: "English",
  it: "Italiano",
};
