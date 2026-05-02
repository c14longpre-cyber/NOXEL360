// backend/src/handlers/seo-scan.get.ts
import type { Request, Response } from "express";
import { normalizeUrlKey } from "../utils/normalizeUrlKey";
import { saveIssues, saveSummary, type IssueItem, type IssuesPayload, type SummaryPayload } from "../services/scanStore";

function mkIssue(
  id: string,
  title: string,
  why: string,
  fix: string,
  impact: string,
  severity: "critical" | "warning" | "info"
): IssueItem {
  return { id, title, why, fix, impact, severity };
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeScoresFromCounts(counts: { critical: number; warning: number; info: number }) {
  // Simple V1 scoring: start 100, subtract per issue
  const base = 100 - counts.critical * 20 - counts.warning * 10 - counts.info * 5;
  const seo = clampScore(base);
  const performance = clampScore(80 - counts.warning * 5);      // placeholder V1
  const accessibility = clampScore(85 - counts.info * 3);       // placeholder V1
  const bestPractices = clampScore(90 - counts.warning * 4);    // placeholder V1
  const globalScore = clampScore((seo + performance + accessibility + bestPractices) / 4);
  return { globalScore, performance, accessibility, bestPractices, seo };
}

function pickFirst(match: RegExpMatchArray | null) {
  return match?.[1]?.trim() ?? "";
}

export async function getSeoScan(req: Request, res: Response) {
  const raw = String(req.query.url || "").trim();
  if (!raw) return res.status(400).json({ ok: false, error: "Missing ?url=" });

  const urlKey = normalizeUrlKey(raw);
  if (!urlKey) return res.status(400).json({ ok: false, error: "Invalid url" });

  try {
    // Fetch HTML (Node 18+ has global fetch)
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);

    const r = await fetch(urlKey, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; NoxelSEO/1.0; +https://noxel360.local) AppleWebKit/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(t);

    const html = await r.text();

    // Basic content signals (regex V1)
    const title = pickFirst(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i));
    const metaDesc = pickFirst(
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    );
    const h1 = pickFirst(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i));
    const canonical = pickFirst(
      html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    );

    const issues: IssuesPayload = { critical: [], warning: [], info: [], lastScan: new Date().toISOString() };

    // HTTPS check
    if (!/^https:\/\//i.test(urlKey)) {
      issues.critical.push(
        mkIssue(
          "tech:https",
          "[tech] HTTPS non détecté",
          "Le site ne semble pas servi en HTTPS.",
          "Activer HTTPS et rediriger HTTP → HTTPS (301).",
          "Peut impacter sécurité, SEO et confiance.",
          "critical"
        )
      );
    }

    // Title
    if (!title) {
      issues.critical.push(
        mkIssue(
          "content:title",
          "[content] Ajouter un <title> unique et descriptif.",
          "Aucun <title> détecté.",
          "Ajouter un <title> pertinent (50–60 caractères).",
          "Le <title> est un signal SEO majeur.",
          "critical"
        )
      );
    } else if (title.length < 10) {
      issues.warning.push(
        mkIssue(
          "content:title_short",
          "[content] <title> trop court.",
          `Le <title> semble très court (“${title.slice(0, 40)}”).`,
          "Rallonger et inclure le mot-clé principal.",
          "Peut réduire la pertinence SEO.",
          "warning"
        )
      );
    }

    // Meta description
    if (!metaDesc) {
      issues.critical.push(
        mkIssue(
          "content:meta_desc",
          "[content] Ajouter une meta description (140–160 caractères).",
          "Aucune meta description détectée.",
          "Ajouter une meta description unique par page.",
          "Améliore CTR et compréhension par Google.",
          "critical"
        )
      );
    } else if (metaDesc.length < 70) {
      issues.info.push(
        mkIssue(
          "content:meta_desc_short",
          "[content] Meta description courte.",
          `La meta description est courte (“${metaDesc.slice(0, 60)}”).`,
          "Ajuster vers 140–160 caractères.",
          "CTR potentiellement plus faible.",
          "info"
        )
      );
    }

    // H1
    if (!h1) {
      issues.warning.push(
        mkIssue(
          "content:h1_missing",
          "[content] Ajouter un H1 principal.",
          "Aucun <h1> détecté.",
          "Ajouter un H1 unique et cohérent avec la page.",
          "Structure et accessibilité peuvent en souffrir.",
          "warning"
        )
      );
    }

    // Canonical
    if (!canonical) {
      issues.info.push(
        mkIssue(
          "tech:canonical_missing",
          "[tech] Ajouter un lien canonical.",
          "Aucun canonical détecté.",
          "Ajouter <link rel='canonical' href='URL canonique' />",
          "Aide à éviter contenu dupliqué / indexation incohérente.",
          "info"
        )
      );
    }

    const counts = {
      critical: issues.critical.length,
      warning: issues.warning.length,
      info: issues.info.length,
    };

    const scores = computeScoresFromCounts(counts);

    const summary: SummaryPayload = {
      ok: true,
      url: urlKey,
      globalScore: scores.globalScore,
      performance: scores.performance,
      accessibility: scores.accessibility,
      bestPractices: scores.bestPractices,
      seo: scores.seo,
      issues: counts,
      lastScan: issues.lastScan!,
    };

    // ✅ save for /summary and /issues
    saveIssues(urlKey, issues);
    saveSummary(urlKey, summary);

    return res.status(200).json(summary);
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: "Scan failed",
      details: err?.message || String(err),
    });
  }
}
