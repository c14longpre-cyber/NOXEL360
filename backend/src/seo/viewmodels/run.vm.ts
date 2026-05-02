import type { RunRecord } from "../runs/run.types";
import type { IssuesPayload } from "../services/scanStore";
import { computeScoresFromIssues } from "../issues/issue.scoring";

export type RunVM = {
  runId: string;
  url: string;
  status: string;
  createdAt: string;
  finishedAt?: string;
  scores: {
    globalScore: number;
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  issues: IssuesPayload | null;
  scanCount: number;
};

export function toRunVM(run: RunRecord): RunVM {
  const issues = run.issues ?? null;
  const scores = issues
    ? computeScoresFromIssues(issues)
    : { globalScore: 0, seo: 0, performance: 0, accessibility: 0, bestPractices: 0 };

  const scanCount = run.scans?.results?.length ?? 0;

  return {
    runId: run.runId,
    url: run.url,
    status: run.status,
    createdAt: run.createdAt,
    finishedAt: run.finishedAt,
    scores: {
      globalScore: scores.globalScore,
      seo: scores.seo,
      performance: scores.performance,
      accessibility: scores.accessibility,
      bestPractices: scores.bestPractices,
    },
    issues,
    scanCount,
  };
}

