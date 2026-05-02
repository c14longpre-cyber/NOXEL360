import type { ModuleResult, IssueItem } from "../../types/global.types";
import type { FetchPageResult } from "../../services/fetchPage";

export async function runTechnicalScan(page: FetchPageResult): Promise<ModuleResult> {
  const issues: IssueItem[] = [];
  const recommendations: string[] = [];

  // Basic signals
  const isHttps = /^https:\/\//i.test(page.finalUrl);
  const isIndexable = page.status >= 200 && page.status < 400;

  let score = 100;

  if (!isHttps) {
    score -= 30;
    recommendations.push("Activer HTTPS et rediriger HTTP → HTTPS (301).");
  }

  if (!isIndexable) {
    score -= 35;
    recommendations.push("Vérifier le statut HTTP (200 attendu) et corriger les erreurs serveur/404.");
  }

  // Canonical presence (simple string check)
  const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(page.html || "");
  if (!hasCanonical) {
    score -= 10;
    recommendations.push("Ajouter une balise canonical cohérente sur les pages importantes.");
  }

  // Robots meta noindex check
  const hasNoindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(page.html || "");
  if (hasNoindex) {
    score -= 25;
    recommendations.push("Retirer noindex des pages qui doivent être indexées.");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    moduleId: "technical",
    score,
    issues,
    recommendations,
    metrics: {
      status: page.status,
      https: isHttps,
      canonicalPresent: hasCanonical,
      robotsNoindex: hasNoindex,
      ttfbMs: page.ttfbMs,
      totalMs: page.totalMs,
      bytes: page.bytes,
    },
  };
}
