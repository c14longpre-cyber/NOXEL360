import type { ScanPlugin } from "../scan.types";
import { makeIssues, issue } from "./_helpers";

export type UxMetrics = {
  hasPopupHeuristic?: boolean;
  aboveFoldHasH1?: boolean;
  stickyHeaderRatio?: number; // 0..1
};

export const uxScan: ScanPlugin<UxMetrics> = {
  id: "ux",
  label: "UX Anti-SEO (heuristiques)",
  async run(_ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    // V1 stub (heuristics later)
    const metrics: UxMetrics = { hasPopupHeuristic: false, aboveFoldHasH1: true, stickyHeaderRatio: 0.12 };

    if (metrics.stickyHeaderRatio !== undefined && metrics.stickyHeaderRatio > 0.25) {
      issues.warning.push(issue("warning", "[ux] Sticky trop envahissant.", "Réduire la hauteur de la barre sticky (impact UX + contenu visible)."));
    }

    return { scanId: "ux", ok: true, durationMs: Date.now() - t0, metrics, issues };
  },
};
