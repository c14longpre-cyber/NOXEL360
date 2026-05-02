import type { ScanPlugin, ScanContext } from "../scan.types";
import { makeIssues, issue } from "./_helpers";
import * as cheerio from "cheerio";
import { scanMessages } from "../messages-en";

export type TechMetrics = {
  status?: number;
  hasHttps?: boolean;
  hasRobotsTxt?: boolean;
  hasSitemap?: boolean;
  canonical?: string | null;
  robotsMeta?: string | null;
  hasViewport?: boolean;
  lang?: string | null;
};

async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const techScan: ScanPlugin<TechMetrics> = {
  id: "tech",
  label: "Technical SEO",
  async run(ctx: ScanContext) {
    const t0 = Date.now();
    const issues = makeIssues();

    let metrics: TechMetrics = {
      status: undefined,
      hasHttps: ctx.url.startsWith("https://"),
      hasRobotsTxt: false,
      hasSitemap: false,
      canonical: null,
      robotsMeta: null,
      hasViewport: false,
      lang: null,
    };

    try {
      const res = await fetch(ctx.url, {
        redirect: "follow",
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; NoxelSEO/1.0)",
        },
      });

      const html = await res.text();
      const $ = cheerio.load(html);

      const origin = new URL(ctx.url).origin;

      metrics = {
        status: res.status,
        hasHttps: ctx.url.startsWith("https://"),
        hasRobotsTxt: await urlExists(`${origin}/robots.txt`),
        hasSitemap: await urlExists(`${origin}/sitemap.xml`),
        canonical: $('link[rel="canonical"]').attr("href")?.trim() || null,
        robotsMeta: $('meta[name="robots"]').attr("content")?.trim() || null,
        hasViewport: !!$('meta[name="viewport"]').length,
        lang: $("html").attr("lang") || null,
      };

      if (!metrics.hasHttps) {
        issues.critical.push({
          ...issue(
            "critical",
            scanMessages.tech.httpsMissing.title,
            scanMessages.tech.httpsMissing.fix
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 12,
        });
      }

      if (!metrics.canonical) {
        issues.warning.push({
          ...issue(
            "warning",
            scanMessages.tech.canonicalMissing.title,
            scanMessages.tech.canonicalMissing.fix
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 5,
        });
      }

      if (!metrics.hasRobotsTxt) {
        issues.info.push({
          ...issue(
            "info",
            scanMessages.tech.robotsMissing.title,
            scanMessages.tech.robotsMissing.fix
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 2,
        });
      }

      if (!metrics.hasSitemap) {
        issues.info.push({
          ...issue(
            "info",
            scanMessages.tech.sitemapMissing.title,
            scanMessages.tech.sitemapMissing.fix
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 2,
        });
      }

      if (metrics.robotsMeta?.toLowerCase().includes("noindex")) {
        issues.critical.push({
          ...issue(
            "critical",
            scanMessages.tech.noindexDetected.title,
            scanMessages.tech.noindexDetected.fix
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 12,
        });
      }

      if (!metrics.hasViewport) {
        issues.warning.push({
          ...issue(
            "warning",
            "[tech] Missing viewport meta tag.",
            "Add <meta name='viewport'> for proper mobile rendering."
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 4,
        });
      }

      if (!metrics.lang) {
        issues.info.push({
          ...issue(
            "info",
            "[tech] Missing HTML lang attribute.",
            "Add a lang attribute to <html> for accessibility and SEO."
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 2,
        });
      }

      if (metrics.status && metrics.status >= 400) {
        issues.critical.push({
          ...issue(
            "critical",
            `[tech] Page returned HTTP ${metrics.status}.`,
            "Fix server errors or redirects to ensure proper access."
          ),
          category: "tech",
          confidence: "measured",
          scoreImpact: 15,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      issues.critical.push({
        ...issue(
          "critical",
          scanMessages.tech.fetchFailed(msg).title,
          scanMessages.tech.fetchFailed(msg).fix
        ),
        category: "tech",
        confidence: "measured",
        scoreImpact: 15,
      });
    }

    return {
      scanId: "tech",
      ok: true,
      durationMs: Date.now() - t0,
      metrics,
      issues,
      fingerprints: { url: ctx.url },
    };
  },
};