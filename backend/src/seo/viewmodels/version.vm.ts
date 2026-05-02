import type { RunRecord } from "../runs/run.types";
import { computeScoresFromIssues } from "../issues/issue.scoring";

export type VersionChange = {
  kind: "score_change" | "issues_change" | "scan_change";
  label: string;
  before?: number;
  after?: number;
  delta?: number;
};

export type VersionVM = {
  runId: string;
  url: string;
  at: string;
  versionNumber: number;
  healthScore: number;
  scoreChange: number | null;   // vs previous version
  changes: VersionChange[];
};

function n(x: number | undefined | null): number { return typeof x === "number" ? x : 0; }

export function toVersionVM(current: RunRecord, prev: RunRecord | null, versionNumber: number): VersionVM {
  const curIssues = current.issues;
  const prevIssues = prev?.issues;

  const curScore = curIssues ? computeScoresFromIssues(curIssues).globalScore : 0;
  const prevScore = prevIssues ? computeScoresFromIssues(prevIssues).globalScore : 0;

  const scoreChange = prev ? (curScore - prevScore) : null;

  const curC = curIssues?.critical.length ?? 0;
  const curW = curIssues?.warning.length ?? 0;
  const curI = curIssues?.info.length ?? 0;

  const prevC = prevIssues?.critical.length ?? 0;
  const prevW = prevIssues?.warning.length ?? 0;
  const prevI = prevIssues?.info.length ?? 0;

  const changes: VersionChange[] = [];
  if (prev) {
    changes.push({
      kind: "score_change",
      label: "Health score",
      before: prevScore,
      after: curScore,
      delta: curScore - prevScore,
    });

    changes.push({
      kind: "issues_change",
      label: "Critical issues",
      before: prevC,
      after: curC,
      delta: curC - prevC,
    });

    changes.push({
      kind: "issues_change",
      label: "Warnings",
      before: prevW,
      after: curW,
      delta: curW - prevW,
    });

    changes.push({
      kind: "issues_change",
      label: "Info",
      before: prevI,
      after: curI,
      delta: curI - prevI,
    });

    const prevScanCount = prev.scans?.results?.length ?? 0;
    const curScanCount = current.scans?.results?.length ?? 0;
    if (prevScanCount !== curScanCount) {
      changes.push({
        kind: "scan_change",
        label: "Scan modules count",
        before: prevScanCount,
        after: curScanCount,
        delta: curScanCount - prevScanCount,
      });
    }
  }

  return {
    runId: current.runId,
    url: current.url,
    at: current.finishedAt ?? current.createdAt,
    versionNumber,
    healthScore: curScore,
    scoreChange,
    changes,
  };
}
