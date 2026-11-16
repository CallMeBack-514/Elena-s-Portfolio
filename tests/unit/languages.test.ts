import { describe, expect, it } from "vitest";
import { pickLanguage } from "../../src/lib/languages";

describe("pickLanguage", () => {
  it("matches on the primary subtag", () => {
    expect(pickLanguage(["en-CA"])).toBe("en");
    expect(pickLanguage(["it-IT"])).toBe("it");
    expect(pickLanguage(["fr-CA"])).toBe("fr");
  });

  it("takes the first supported language in preference order", () => {
    expect(pickLanguage(["de-DE", "it", "en"])).toBe("it");
    expect(pickLanguage(["en-CA", "fr"])).toBe("en");
  });

  it("is case-insensitive", () => {
    expect(pickLanguage(["EN-gb"])).toBe("en");
  });

  it("falls back to French when nothing matches", () => {
    expect(pickLanguage(["de-DE", "es"])).toBe("fr");
  });

  it("falls back to French for an empty list", () => {
    expect(pickLanguage([])).toBe("fr");
  });
});
