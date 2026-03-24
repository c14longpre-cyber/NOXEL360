"use strict";
// src/routes/auditKeywords.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditKeywords = auditKeywords;
const seoKeywords_1 = require("./seoKeywords");
/**
 * Analyse très simple : compte combien de fois
 * chaque mot-clé apparaît dans le texte.
 */
function auditKeywords(text) {
    const lower = text.toLowerCase();
    const results = seoKeywords_1.seoKeywords.map((kw) => {
        const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, "g");
        const matches = lower.match(regex);
        return {
            keyword: kw,
            count: matches ? matches.length : 0,
        };
    });
    return results;
}
