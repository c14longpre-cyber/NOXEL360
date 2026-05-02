import { fetchPage } from "../services/fetchPage";

import { runTechnicalScan } from "../modules/technical/technical.scan";
import { runPerformanceScan } from "../modules/performance/performance.scan";
import { runContentScan } from "../modules/content/content.scan";
import { runArchitectureScan } from "../modules/architecture/architecture.scan";
import { runBacklinksScan } from "../modules/backlinks/backlinks.scan";
import { runStructuredDataScan } from "../modules/structured-data/structuredData.scan";

import { computeGlobalScores } from "./scoreEngine";
import type { FullScanResult, Priority } from "../types/global.types";

function computePriority(globalScore: number): Priority {
  if (globalScore >= 85) return "Low";
  if (globalScore >= 70) return "Medium";
  if (globalScore >= 50) return "High";
  return "Critical";
}

export async function runFullScan(url: string): Promise<FullScanResult> {
  const page = await fetchPage(url);

  const [technical, performance, content, architecture, backlinks, structuredData] =
    await Promise.all([
      runTechnicalScan(page),
      runPerformanceScan(page),
      runContentScan(page),
      runArchitectureScan(page),
      runBacklinksScan(page),
      runStructuredDataScan(page),
    ]);

  const globalScore = computeGlobalScores({
    technical,
    performance,
    content,
    architecture,
    backlinks,
    structuredData,
  });

  const breakdown: Record<string, number> = {
    technical: Number(technical.score ?? 0),
    performance: Number(performance.score ?? 0),
    content: Number(content.score ?? 0),
    architecture: Number(architecture.score ?? 0),
    backlinks: Number(backlinks.score ?? 0),
    structuredData: Number(structuredData.score ?? 0),
  };

  return {
    url,
    finalUrl: page.finalUrl,
    fetched: {
      status: page.status,
      ttfbMs: page.ttfbMs,
      totalMs: page.totalMs,
      bytes: page.bytes,
    },
    modules: { technical, performance, content, architecture, backlinks, structuredData },
    scores: {
      global: Number(globalScore ?? 0),
      breakdown,
      priority: computePriority(Number(globalScore ?? 0)),
    },
    scannedAt: new Date().toISOString(),
  };
}
