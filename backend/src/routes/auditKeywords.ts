// src/routes/auditKeywords.ts

import { seoKeywords } from "./seoKeywords";

/**
 * Analyse très simple : compte combien de fois
 * chaque mot-clé apparaît dans le texte.
 */
export function auditKeywords(text: string) {
  const lower = text.toLowerCase();
  const results = seoKeywords.map((kw) => {
    const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, "g");
    const matches = lower.match(regex);
    return {
      keyword: kw,
      count: matches ? matches.length : 0,
    };
  });

  return results;
}
