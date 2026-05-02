// backend/src/services/scanOrchestrator.ts
import { computeScoresFromIssues } from "../utils/scoreCalc";
import type { ScanKey, ScanResult, IssueItem } from "../scans/types";

import { techScan } from "../scans/plugins/tech.scan";
import { contentScan } from "../scans/plugins/content.scan";
import { runPerfScan } from "../scans/perf.scan";
import { runArchitectureScan } from "../scans/architecture.scan";
import { runBacklinksScan } from "../scans/backlinks.scan";
import { runStructuredDataScan } from "../scans/structured-data.scan";

type PluginIssuesPayload = {
  critical: Array<{
    id: string;
    title: string;
    why: string;
    impact: string;
    fix: string;
    severity: "critical" | "warning" | "info";
  }>;
  warning: Array<{
    id: string;
    title: string;
    why: string;
    impact: string;
    fix: string;
    severity: "critical" | "warning" | "info";
  }>;
  info: Array<{
    id: string;
    title: string;
    why: string;
    impact: string;
    fix: string;
    severity: "critical" | "warning" | "info";
  }>;
};

function flattenPluginIssues(area: ScanKey, payload: PluginIssuesPayload): IssueItem[] {
  const all = [...payload.critical, ...payload.warning, ...payload.info];

  return all.map((it) => ({
    id: it.id,
    title: it.title,
    why: it.why,
    impact: it.impact,
    fix: it.fix,
    severity: it.severity,
    area,
    weight: 1,
    category: area === "perf" ? "performance" : (area as any),
    confidence: "measured",
    scoreImpact: 0,
  }));
}

async function runTechScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();

  const result = await techScan.run({
    url,
    mode: "quick",
    nowIso: startedAt,
  });

  return {
    key: "tech",
    startedAt,
    finishedAt: new Date().toISOString(),
    summary: "Technical SEO scan completed.",
    data: result.metrics,
    issues: flattenPluginIssues("tech", result.issues),
  };
}

async function runContentScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();

  const result = await contentScan.run({
    url,
    mode: "quick",
    nowIso: startedAt,
  });

  return {
    key: "content",
    startedAt,
    finishedAt: new Date().toISOString(),
    summary: "Content scan completed.",
    data: result.metrics,
    issues: flattenPluginIssues("content", result.issues),
  };
}

function makeUnavailableScan(key: ScanKey, reason: string): ScanResult {
  const now = new Date().toISOString();

  return {
    key,
    startedAt: now,
    finishedAt: now,
    summary: reason,
    data: { unavailable: true },
    issues: [],
  };
}

const registry: Partial<Record<ScanKey, (url: string) => Promise<ScanResult>>> = {
  tech: runTechScan,
  perf: runPerfScan,
  content: runContentScan,
  architecture: runArchitectureScan,
  backlinks: runBacklinksScan,
  structuredData: runStructuredDataScan,
};

export type GlobalScanPayload = {
  url: string;
  createdAt: string;
  scans: Partial<Record<ScanKey, ScanResult>>;
  issues: IssueItem[];
  scores: ReturnType<typeof computeScoresFromIssues>;
  globalScore: number;
};

let lastScan: GlobalScanPayload | null = null;

export async function runGlobalScan(
  url: string,
  keys: ScanKey[] = ["tech", "perf", "content", "architecture", "backlinks", "structuredData"]
): Promise<GlobalScanPayload> {
  const createdAt = new Date().toISOString();

  const scans: Partial<Record<ScanKey, ScanResult>> = {};

  for (const key of keys) {
    const runner = registry[key];

    if (!runner) {
      scans[key] = makeUnavailableScan(key, `${key} scan is not enabled in this build.`);
      continue;
    }

    scans[key] = await runner(url);
  }

  const issues: IssueItem[] = keys.flatMap((k) => scans[k]?.issues ?? []);
  const scores = computeScoresFromIssues(issues);

  const payload: GlobalScanPayload = {
    url,
    createdAt,
    scans,
    issues,
    scores,
    globalScore: scores.global,
  };

  lastScan = payload;
  return payload;
}

export function getLastScan(): GlobalScanPayload | null {
  return lastScan;
}