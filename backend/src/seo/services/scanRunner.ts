// backend/src/services/scanRunner.ts
import { runFullScan } from "../core/scanOrchestrator";
import { saveIssues, saveSummary } from "./scanStore";
import type { IssuesPayload, IssueItem, IssueSeverity, SummaryPayload } from "./scanStore";

function sevFromScore(score: number): IssueSeverity {
  if (score < 50) return "critical";
  if (score < 70) return "warning";
  return "info";
}

function makeIssue(moduleId: string, text: string, severity: IssueSeverity): IssueItem {
  const normalized = String(text || "").trim();

  return {
    id: `${moduleId}:${Math.random().toString(16).slice(2)}`,
    title: `[${moduleId}] ${normalized}`,
    why: "Signal detected during the scan.",
    impact: "May negatively impact SEO quality, performance, and user experience.",
    fix: normalized,
    severity,
  };
}



export async function runScan(url: string): Promise<{ summary: SummaryPayload; issues: IssuesPayload; meta: any }> {
  const scan = await runFullScan(url);

  const breakdown = scan.scores.breakdown;

  // V1: SEO = average of the two wired modules (tech + content)
  const seo = Math.round((Number(breakdown.technical ?? 0) + Number(breakdown.content ?? 0)) / 2);

  // V1 placeholders until full wiring is complete
  const performance = Number(breakdown.performance ?? 0);
  const accessibility = 75;
  const bestPractices = 75;

  const issues: IssuesPayload = { critical: [], warning: [], info: [] };

  // Convert module recommendations into issues
  const mods = scan.modules as Record<string, { score: number; recommendations: string[] }>;
  for (const [moduleId, mod] of Object.entries(mods)) {
    const severity = sevFromScore(Number(mod.score ?? 0));
    for (const rec of mod.recommendations || []) {
      issues[severity].push(makeIssue(moduleId, rec, severity));
    }
  }

  const finalUrl = (scan as any).finalUrl ?? url;

  const summary: SummaryPayload = {
    ok: true,
    url: finalUrl,
    globalScore: Number(scan.scores.global ?? 0),
    performance,
    accessibility,
    bestPractices,
    seo,
    issues: {
      critical: issues.critical.length,
      warning: issues.warning.length,
      info: issues.info.length,
    },
    lastScan: scan.scannedAt,
  };

  saveSummary(url, summary);
  saveIssues(url, issues);

  return { summary, issues, meta: { finalUrl, scannedAt: scan.scannedAt } };
}