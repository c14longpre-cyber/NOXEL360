export type Priority = "Low" | "Medium" | "High" | "Critical";
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

export interface IssueItem {
  id: string;
  title: string;
  why: string;
  impact: string;
  fix: string;

  /**
   * Severity UI (for IssuesPayload).
   * Modules may also use it, but it is not mandatory.
   */
  severity?: IssueSeverity;

  /**
   * Optional richer metadata for advanced scoring / UI.
   */
  category?: IssueCategory;
  confidence?: IssueConfidence;
  scoreImpact?: number;
}

export interface ModuleResult {
  moduleId: string;
  score: number; // 0-100
  issues: IssueItem[];
  metrics?: Record<string, any>;
  recommendations: string[];
  impacts?: string[];
}

export interface FullScanResult {
  url: string;

  // meta fetch
  finalUrl: string;
  fetched: {
    status: number;
    ttfbMs: number;
    totalMs: number;
    bytes: number;
  };

  scannedAt: string;

  modules: Record<string, ModuleResult>;

  scores: {
    global: number;
    breakdown: Record<string, number>;
    priority: Priority;
  };
}

export interface ReportModel {
  executiveSummary: {
    siteName: string;
    url: string;
    scannedAt: string;
    globalScore: number;
    priority: Priority;
    highlights: string[];
  };
  categoryScores: Array<{
    moduleId: string;
    label: string;
    score: number;
    priority: Priority;
  }>;
  detailedAnalysis: Record<string, ModuleResult>;
  roadmap30Days: Array<{
    action: string;
    priority: Priority;
    impact: string;
    effort: "Low" | "Medium" | "High";
    deadlineDays: number;
  }>;
  projections: {
    trafficOrganic: string;
    conversions: string;
    visibility: string;
    bounceRate: string;
  };
  conclusion: string;
}