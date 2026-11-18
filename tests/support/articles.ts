// The real Article data, read raw so E2E tests can assert against whatever
// Elena's current Articles are, rather than hard-coding titles that change.
import { readFileSync } from "node:fs";

export interface RawArticle {
  id: string;
  status: "published" | "draft";
  order: number;
  workTitle: string;
  originalLanguage: "fr" | "en" | "it";
  outlet: string;
  url: string;
  date: string;
  description: Record<"fr" | "en" | "it", { value: string }>;
  image?: string;
}

export function articles(file = "src/data/entries/articles.json"): RawArticle[] {
  return JSON.parse(readFileSync(file, "utf8")) as RawArticle[];
}

/** Published Articles in Elena's Order, as every list shows them. */
export function publishedArticles(file?: string): RawArticle[] {
  return articles(file)
    .filter((a) => a.status === "published")
    .sort((a, b) => a.order - b.order);
}
