import type { ScanPlugin } from "../scan.types";
import { makeIssues, mkIssue } from "./_helpers";
import * as cheerio from "cheerio";

export type ContentMetrics = {
  title?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  wordCount?: number;
};

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; NoxelSEO/1.0)",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching ${url}`);
  }

  return await res.text();
}

export const contentScan: ScanPlugin<ContentMetrics> = {
  id: "content",
  label: "Contenu & Sémantique",
  async run(ctx) {
    const t0 = Date.now();
    const issues = makeIssues();

    let metrics: ContentMetrics = {
      title: null,
      metaDescription: null,
      h1: null,
      wordCount: 0,
    };

    try {
      const html = await fetchHtml(ctx.url);
      const $ = cheerio.load(html);

      const title = $("title").first().text().trim() || null;
      const metaDescription =
        $('meta[name="description"]').attr("content")?.trim() || null;
      const h1 = $("h1").first().text().trim() || null;

      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      const wordCount = bodyText ? bodyText.split(" ").filter(Boolean).length : 0;

      metrics = {
        title,
        metaDescription,
        h1,
        wordCount,
      };

      if (!title) {
        issues.critical.push(
          mkIssue("critical", "[content] Ajouter un <title> unique.", "Ajouter un <title> descriptif (50–60 caractères).")
        );
      }

      if (!metaDescription) {
        issues.warning.push(
          mkIssue("warning", "[content] Ajouter une meta description.", "Ajouter une meta description (140–160 caractères).")
        );
      }

      if (!h1) {
        issues.warning.push(
          mkIssue("warning", "[content] Ajouter un H1 visible.", "Ajouter un H1 clair en haut de contenu.")
        );
      }

      if ((wordCount ?? 0) < 200) {
        issues.info.push(
          mkIssue("info", "[content] Contenu léger (thin).", "Ajouter du contenu utile aligné à l'intention.")
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      issues.critical.push(
        mkIssue("critical", "[content] Analyse impossible.", `Le contenu n'a pas pu être récupéré: ${msg}`)
      );
    }

    return {
      scanId: "content",
      ok: true,
      durationMs: Date.now() - t0,
      metrics,
      issues,
    };
  },
};