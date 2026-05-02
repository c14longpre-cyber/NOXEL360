import type { ScanPlugin } from "../scan.types";
import { makeIssues, issue } from "./_helpers";

export type ImagesMetrics = {
  missingAltCount?: number;
  oversizedCount?: number;
  unoptimizedFormatCount?: number;
};

export const imagesScan: ScanPlugin<ImagesMetrics> = {
  id: "images",
  label: "Images & Media",
  async run(_ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    // V1 stub
    const metrics: ImagesMetrics = { missingAltCount: 1, oversizedCount: 2, unoptimizedFormatCount: 1 };

    if ((metrics.missingAltCount ?? 0) > 0) issues.warning.push(issue("warning", "[img] Alt manquants.", "Ajouter des attributs alt descriptifs aux images importantes."));
    if ((metrics.oversizedCount ?? 0) > 0) issues.info.push(issue("info", "[img] Images trop lourdes.", "Compresser/redimensionner et servir en WebP/AVIF si possible."));

    return { scanId: "images", ok: true, durationMs: Date.now() - t0, metrics, issues };
  },
};
