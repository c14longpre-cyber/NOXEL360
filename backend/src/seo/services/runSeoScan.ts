import type { IssuesPayload, SummaryPayload } from "./scanStore";

export async function runSeoScan(url: string): Promise<{
  summary: SummaryPayload;
  issuesDetailed: IssuesPayload;
}> {
  // Stub minimal pour stabiliser la structure
  const performance = 75;
  const accessibility = 75;
  const bestPractices = 75;
  const seo = 73;

  const globalScore = Math.round((performance + accessibility + bestPractices + seo) / 4);
  const lastScan = new Date().toISOString();

  return {
    summary: {
      ok: true,
      url,
      globalScore,
      performance,
      accessibility,
      bestPractices,
      seo,
      issues: { critical: 0, warning: 0, info: 0 },
      lastScan,
    },
    issuesDetailed: {
      critical: [],
      warning: [],
      info: [],
      lastScan,
    },
  };
}
