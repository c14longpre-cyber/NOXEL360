import { seoKeywords } from "./seoKeywords";

/**
 * Audit a page's content against SEO keyword categories.
 * @param content - The text content of the page (HTML stripped or raw text).
 * @returns Report object with found and missing keywords per category.
 */
export function auditKeywords(content: string) {
  const lowerContent = content.toLowerCase();
  const report: Record<string, { found: string[]; missing: string[] }> = {};

  for (const [category, keywords] of Object.entries(seoKeywords)) {
    const found: string[] = [];
    const missing: string[] = [];

    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    report[category] = { found, missing };
  }

  return report;
}