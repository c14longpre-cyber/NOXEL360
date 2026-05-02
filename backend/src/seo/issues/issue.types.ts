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
  severity: IssueSeverity;
  category?: IssueCategory;
  confidence?: IssueConfidence;
  scoreImpact?: number;
};

export type IssuesPayload = {
  critical: IssueItem[];
  warning: IssueItem[];
  info: IssueItem[];
};

export function emptyIssues(): IssuesPayload {
  return { critical: [], warning: [], info: [] };
}