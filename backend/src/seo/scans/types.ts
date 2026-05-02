export type ScanKey =
  | "tech"
  | "perf"
  | "content"
  | "architecture"
  | "backlinks"
  | "structuredData"
  | "onpage"
  | "images"
  | "links"
  | "trust"
  | "ux"
  | "performance";

export type IssueSeverity = "critical" | "warning" | "info";

export type IssueCategory =
  | "tech"
  | "content"
  | "onpage"
  | "images"
  | "links"
  | "trust"
  | "ux"
  | "performance";

export type IssueConfidence = "measured" | "heuristic" | "inferred";

export type IssueItem = {
  id: string;
  title: string;
  why: string;
  impact: string;
  fix: string;
  area: ScanKey;
  severity: IssueSeverity;
  weight?: number;

  // New optional fields for richer scoring/UI
  category?: IssueCategory;
  confidence?: IssueConfidence;
  scoreImpact?: number;
};

export type ScanResult = {
  key: ScanKey;
  startedAt: string;
  finishedAt: string;
  summary: string;
  data?: unknown;
  issues: IssueItem[];
};