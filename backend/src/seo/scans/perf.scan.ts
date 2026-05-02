import type { ScanResult, IssueItem } from "./types";

export async function runPerfScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();

  // TODO: lighthouse async later
  const issues: IssueItem[] = [];

  const finishedAt = new Date().toISOString();
  return {
    key: "perf",
    startedAt,
    finishedAt,
    summary: issues.length ? "Issues detected" : "No issues detected",
    data: { url },
    issues,
  };
}
