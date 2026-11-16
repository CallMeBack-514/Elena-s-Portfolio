// Invariant (spec: site-languages): every Visitor-facing page exists under
// /fr/, /en/ and /it/ with the same path after the prefix, and says so in
// <html lang>. The bare-address chooser is the one page outside Languages.
import { expect, test } from "@playwright/test";
import { LANGUAGES } from "../../src/lib/languages";
import { builtHtml, builtPages, ROOT } from "../support/pages";

test("every page exists in all three Languages, with a matching <html lang>", () => {
  const pages = builtPages().filter((path) => path !== ROOT);
  const rest = (path: string) => path.split("/").slice(2).join("/");

  for (const path of pages) {
    const lang = path.split("/")[1];
    expect(LANGUAGES, `${path} is outside a Language prefix`).toContain(lang);
    expect(builtHtml(path), `${path} <html lang>`).toMatch(new RegExp(`<html lang="${lang}"`));
    for (const other of LANGUAGES) {
      expect(pages, `${path} has no ${other} version`).toContain(`/${other}/${rest(path)}`);
    }
  }
  expect(pages).toEqual(expect.arrayContaining(["/fr/", "/en/", "/it/"]));
});
