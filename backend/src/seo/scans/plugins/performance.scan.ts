import type { ScanPlugin } from "../scan.types";
import { makeIssues, mkIssue } from "./_helpers";

export type PerformanceMetrics = {
  lcpMs?: number;
  cls?: number;
  inpMs?: number;
  totalWeightKb?: number;
};

export const performanceScan: ScanPlugin<PerformanceMetrics> = {
  id: "performance",
  label: "Performance (CWV Essentials)",
  async run(_ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    // ✅ Stub V1 (à remplacer par Lighthouse ensuite)
    const metrics: PerformanceMetrics = {
      lcpMs: 2500,
      cls: 0.05,
      inpMs: 200,
      totalWeightKb: 1200,
    };

    if ((metrics.lcpMs ?? 0) > 2500) {
      issues.warning.push(
        mkIssue("warning", "[perf] LCP élevé.", "Optimiser image LCP, critical CSS, réduire JS bloquant.")
      );
    }

    if ((metrics.cls ?? 0) > 0.1) {
      issues.warning.push(
        mkIssue("warning", "[perf] CLS élevé.", "Réserver l'espace (images/bannières), éviter injections tardives.")
      );
    }

    return {
      scanId: "performance",
      ok: true,
      durationMs: Date.now() - t0,
      metrics,
      issues,
    };
  },
};
