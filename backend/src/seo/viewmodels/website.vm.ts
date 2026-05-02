import type { RunRecord } from "../runs/run.types";
import { computeScoresFromIssues } from "../issues/issue.scoring";

export type WebsiteStatus = "scanning" | "healthy" | "warning" | "critical";

export type WebsiteVM = {
  url: string;
  status: WebsiteStatus;
  healthScore: number;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  seoModules: {
    scn: number;
    orbit: number;
    schema: number;
    crawl: number;
  };
  issuesCount: { critical: number; warning: number; info: number };
  lastScan: string | null;
  runId: string | null;
};

type ScoreBundle = {
  globalScore: number;
  seo: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seoModules: {
    scn: number;
    orbit: number;
    schema: number;
    crawl: number;
  };
};

const EMPTY_SCORES: ScoreBundle = {
  globalScore: 0,
  seo: 0,
  performance: 0,
  accessibility: 0,
  bestPractices: 0,
  seoModules: {
    scn: 0,
    orbit: 0,
    schema: 0,
    crawl: 0,
  },
};

export function toWebsiteVM(run: RunRecord | null): WebsiteVM {
  if (!run) {
    return {
      url: "",
      status: "critical",
      healthScore: 0,
      scores: {
        seo: 0,
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
      },
      seoModules: {
        scn: 0,
        orbit: 0,
        schema: 0,
        crawl: 0,
      },
      issuesCount: { critical: 0, warning: 0, info: 0 },
      lastScan: null,
      runId: null,
    };
  }

  const issues = run.issues;
  const scores: ScoreBundle = issues
    ? computeScoresFromIssues(issues)
    : EMPTY_SCORES;

  const critical = issues?.critical.length ?? 0;
  const warning = issues?.warning.length ?? 0;
  const info = issues?.info.length ?? 0;

  const status: WebsiteStatus =
    run.status === "running" || run.status === "queued"
      ? "scanning"
      : critical > 0 || scores.globalScore < 55
        ? "critical"
        : scores.globalScore < 80
          ? "warning"
          : "healthy";

  return {
    url: run.url,
    status,
    healthScore: scores.globalScore,
    scores: {
      seo: scores.seo,
      performance: scores.performance,
      accessibility: scores.accessibility,
      bestPractices: scores.bestPractices,
    },
    seoModules: {
      scn: scores.seoModules.scn,
      orbit: scores.seoModules.orbit,
      schema: scores.seoModules.schema,
      crawl: scores.seoModules.crawl,
    },
    issuesCount: { critical, warning, info },
    lastScan: run.finishedAt ?? run.createdAt ?? null,
    runId: run.runId ?? null,
  };
}