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
  "contact.email": "Courriel\u00a0:",
  "root.choose": "Choisir une langue",
  seeAll: "Tout voir",
  readMore: "Lire la suite",
  "filter.label": "Filtrer par média",
  "filter.all": "Tous",
  "menu.open": "Ouvrir le menu",
  "menu.close": "Fermer le menu",
  "card.externalSite": "(site {outlet})",
  "section.articles.description":
    "Les articles d'Elena Meyer, publiés dans Le Devoir, à Radio-Canada et ailleurs.",
  "section.tele.description": "Les reportages télé d'Elena Meyer.",
  "section.balados.description": "Les balados d'Elena Meyer, animatrice et productrice.",
  "section.these.description": "La recherche de maîtrise en journalisme d'Elena Meyer à Concordia.",
  "section.art.description": "Les portraits, poèmes et textes Substack d'Elena Meyer.",
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
    "contact.email": "Email:",
    "root.choose": "Choose a language",
    seeAll: "See all",
    readMore: "Read more",
    "filter.label": "Filter by outlet",
    "filter.all": "All",
    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "card.externalSite": "({outlet} website)",
    "section.articles.description":
      "Elena Meyer's articles, published in Le Devoir, on Radio-Canada and elsewhere.",
    "section.tele.description": "Elena Meyer's TV reports.",
    "section.balados.description": "Podcasts hosted and produced by Elena Meyer.",
    "section.these.description": "Elena Meyer's M.A. journalism research at Concordia.",
    "section.art.description": "Elena Meyer's portraits, poems and Substack writing.",
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
    "contact.email": "Email:",
    "root.choose": "Scegli una lingua",
    seeAll: "Vedi tutto",
    readMore: "Continua a leggere",
    "filter.label": "Filtra per testata",
    "filter.all": "Tutti",
    "menu.open": "Apri il menu",
    "menu.close": "Chiudi il menu",
    "card.externalSite": "(sito {outlet})",
    "section.articles.description":
      "Gli articoli di Elena Meyer, pubblicati su Le Devoir, Radio-Canada e altrove.",
    "section.tele.description": "I servizi televisivi di Elena Meyer.",
    "section.balados.description": "I podcast condotti e prodotti da Elena Meyer.",
    "section.these.description":
      "La ricerca magistrale in giornalismo di Elena Meyer alla Concordia.",
    "section.art.description": "I ritratti, le poesie e i testi Substack di Elena Meyer.",
  },
} as const satisfies Record<Language, Record<UiKey, string>>;

export function t(lang: Language, key: UiKey): string {
  return ui[lang][key];
}

export function sectionDescription(lang: Language, section: Section): string {
  return ui[lang][`section.${section}.description`];
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
