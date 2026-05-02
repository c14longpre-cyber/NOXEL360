import type { ModuleResult, IssueItem } from "../../types/global.types";
import type { FetchPageResult } from "../../services/fetchPage";

export async function runBacklinksScan(page: FetchPageResult): Promise<ModuleResult> {
  const issues: IssueItem[] = [];
  const recommendations: string[] = [
    "Module V1: placeholder — logique complète à brancher (V2).",
  ];

  const bytesMb = page.bytes / (1024 * 1024);
  let score = 65;
  if (page.totalMs > 4000) score -= 15;
  if (bytesMb > 2) score -= 10;
  score = Math.max(0, Math.min(100, score));

  return {
    moduleId: "backlinks",
    score,
    issues,
    recommendations,
    metrics: {
      totalMs: page.totalMs,
      bytes: page.bytes,
    },
  };
}
