import type { ScanPlugin } from "../scan.types";
import { makeIssues, issue } from "./_helpers";

export type LinksMetrics = {
  internalCount?: number;
  externalCount?: number;
  brokenCount?: number;
};

export const linksScan: ScanPlugin<LinksMetrics> = {
  id: "links",
  label: "Liens (maillage lite)",
  async run(_ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    // V1 stub
    const metrics: LinksMetrics = { internalCount: 12, externalCount: 3, brokenCount: 1 };

    if ((metrics.brokenCount ?? 0) > 0) {
      issues.warning.push(issue("warning", "[links] Liens cassés détectés.", "Corriger ou rediriger les URLs cassées."));
    }

    return { scanId: "links", ok: true, durationMs: Date.now() - t0, metrics, issues };
  },
};
