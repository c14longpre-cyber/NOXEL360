"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditKeywords = auditKeywords;
function auditKeywords(text, keywords) {
    const keywordList = Array.isArray(keywords)
        ? keywords
        : keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
    const lowerText = text.toLowerCase();
    const matches = [];
    keywordList.forEach((keyword) => {
        if (lowerText.includes(keyword.toLowerCase())) {
            matches.push(keyword);
        }
    });
    return {
        total: keywordList.length,
        matches,
    };
}
