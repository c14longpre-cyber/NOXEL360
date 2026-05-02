import type { ScanResult, IssueItem } from "./types";

export async function runArchitectureScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();

  // TODO: internal links depth, nav structure, orphan pages later
  const issues: IssueItem[] = [];

  const finishedAt = new Date().toISOString();
  return {
    key: "architecture",
    startedAt,
    finishedAt,
    summary: issues.length ? "Issues detected" : "No issues detected",
    data: { url },
    issues,
  };
}
