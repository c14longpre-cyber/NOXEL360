import type { IssuesPayload } from "../services/scanStore";

export type ScanMode = "quick" | "full";

export type ScanId =
  | "tech"
  | "render_delta"
  | "performance"
  | "content"
  | "ux"
  | "images"
  | "links";

export type ScanContext = {
  url: string;
  mode: ScanMode;
  nowIso: string;
};

export type ScanArtifacts = Record<string, unknown>;

export type ScanResult<TMetrics = Record<string, unknown>> = {
  scanId: ScanId;
  ok: boolean;
  durationMs: number;
  metrics: TMetrics;
  issues: IssuesPayload;
  artifacts?: ScanArtifacts;
  fingerprints?: Record<string, string>;
};

export type ScanPlugin<TMetrics = Record<string, unknown>> = {
  id: ScanId;
  label: string;
  run: (ctx: ScanContext) => Promise<ScanResult<TMetrics>>;
};

