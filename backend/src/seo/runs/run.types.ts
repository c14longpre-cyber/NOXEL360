import type { IssuesPayload } from "../services/scanStore";
import type { ScanBundleResult } from "../scans/scan.bundle";

export type RunStatus = "queued" | "running" | "done" | "error";

export type RunRecord = {
  runId: string;
  url: string;
  status: RunStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;

  scans?: ScanBundleResult;
  issues?: IssuesPayload;

  errorMessage?: string;
};

