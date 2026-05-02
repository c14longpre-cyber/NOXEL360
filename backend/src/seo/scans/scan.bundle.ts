import type { ScanContext, ScanResult } from "./scan.types";
import type { IssuesPayload } from "../services/scanStore";
import { emptyIssues } from "../services/scanStore";

export type ScanBundleResult = {
  url: string;
  mode: "quick" | "full";
  nowIso: string;
  results: ScanResult[];
};

export function mergeIssues(all: ScanResult[]): IssuesPayload {
  const merged = emptyIssues();
  for (const r of all) {
    merged.critical.push(...r.issues.critical);
    merged.warning.push(...r.issues.warning);
    merged.info.push(...r.issues.info);
  }
  return merged;
}

export async function runBundle(ctx: ScanContext, scans: Array<(c: ScanContext) => Promise<ScanResult>>): Promise<ScanBundleResult> {
  const results: ScanResult[] = [];
  for (const run of scans) {
    results.push(await run(ctx));
  }
  return { url: ctx.url, mode: ctx.mode, nowIso: ctx.nowIso, results };
}

