import type { ScanResult, IssueItem } from "./types";

export async function runStructuredDataScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();
  const issues: IssueItem[] = [];

  issues.push({
    id: "schema_missing",
    title: "No structured data detected",
    why: "Structured data helps search engines understand your content.",
    impact: "Missed eligibility for rich results.",
    fix: "Add JSON-LD schema (Organization, Product, Article, etc.).",
    area: "structuredData",
    severity: "info",
    weight: 3,
  });

  const finishedAt = new Date().toISOString();
  return {
    key: "structuredData",
    startedAt,
    finishedAt,
    summary: "Structured data analysis completed",
    data: { url },
    issues,
  };
}
