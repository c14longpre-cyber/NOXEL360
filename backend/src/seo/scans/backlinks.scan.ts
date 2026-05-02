import type { ScanResult, IssueItem } from "./types";

export async function runBacklinksScan(url: string): Promise<ScanResult> {
  const startedAt = new Date().toISOString();

  // TODO: V1 -> placeholder (needs external provider later)
  const issues: IssueItem[] = [];

  const finishedAt = new Date().toISOString();
  return {
    key: "backlinks",
    startedAt,
    finishedAt,
    summary: "Backlinks scan is placeholder in V1 (provider needed).",
    data: { url },
    issues,
  };
}
