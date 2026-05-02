import type { ScanPlugin } from "../scan.types";
import { makeIssues, issue } from "./_helpers";
import { sha1 } from "../../shared/hash";

export type RenderDeltaMetrics = {
  initialHtmlHash: string;
  renderedDomHash: string;
  deltaScore: number; // 0..100 (higher = more different)
};

export const renderDeltaScan: ScanPlugin<RenderDeltaMetrics> = {
  id: "render_delta",
  label: "Reality Render (DOM Delta)",
  async run(ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    // V1 stub: later connect to playwright/puppeteer
    const initialHtml = `<html><body>stub ${ctx.url}</body></html>`;
    const renderedDom = `<html><body>stub rendered ${ctx.url}</body></html>`;

    const initialHtmlHash = sha1(initialHtml);
    const renderedDomHash = sha1(renderedDom);
    const deltaScore = initialHtmlHash === renderedDomHash ? 0 : 35;

    if (deltaScore >= 30) {
      issues.warning.push(issue("warning", "[render] DOM rendu différent du HTML initial.", "Vérifier contenu injecté JS, H1, liens et indexabilité."));
    }

    return {
      scanId: "render_delta",
      ok: true,
      durationMs: Date.now() - t0,
      metrics: { initialHtmlHash, renderedDomHash, deltaScore },
      issues,
      artifacts: {
        // keep tiny in V1
        note: "Stub: branch on Playwright later",
      },
      fingerprints: { initialHtmlHash, renderedDomHash },
    };
  },
};
