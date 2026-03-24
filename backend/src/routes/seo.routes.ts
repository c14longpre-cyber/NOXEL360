import { Router } from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { auditKeywords } from "./auditKeywords";

export const router = Router();

router.post("/analyze", async (req, res) => {
  let { url, strategy = "mobile" } = req.body as {
    url?: string;
    strategy?: "mobile" | "desktop";
  };

  if (!url) return res.status(400).json({ ok: false, error: "URL manquante." });

  url = url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  try { new URL(url); }
  catch { return res.status(400).json({ ok: false, error: "URL invalide." }); }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Noxel360-SEO-Analyzer/2.0",
        Accept: "text/html"
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // === TITLE + META ULTIMATE READ ========================================================

    const title =
      $("title").text().trim() ||
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $('meta[name="twitter:title"]').attr("content")?.trim() ||
      null;

    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="twitter:description"]').attr("content")?.trim() ||
      null;

    // === HEADINGS (H1 → H6) ================================================================

    const headings = {
      h1: $("h1").map((_, e) => $(e).text().trim()).get(),
      h2: $("h2").map((_, e) => $(e).text().trim()).get(),
      h3: $("h3").map((_, e) => $(e).text().trim()).get(),
      h4: $("h4").map((_, e) => $(e).text().trim()).get(),
      h5: $("h5").map((_, e) => $(e).text().trim()).get(),
      h6: $("h6").map((_, e) => $(e).text().trim()).get(),
    };

    // === IMAGES / ALT ======================================================================

    const images = $("img").length;
    const missingAlt = $('img:not([alt]), img[alt=""]').length;

    // === LINKS / INTERNAL / EXTERNAL ======================================================

    const allLinks = $("a").length;
    const internalLinks = $(`a[href*="${new URL(url).hostname}"]`).length;
    const externalLinks = allLinks - internalLinks;

    // === CANONICAL / ROBOTS / SITEMAP =====================================================

    const canonical = $('link[rel="canonical"]').attr("href") || null;

    const robotsOK = await fetch(url + "/robots.txt").then(r => r.ok).catch(() => false);
    const sitemapOK = await fetch(url + "/sitemap.xml").then(r => r.ok).catch(() => false);

    // === QUALITATIVE WORD COUNT ===========================================================

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(" ").length : 0;
    const keywordsFound = auditKeywords(bodyText);

    // === SMART SEO SCORE ================================================================

    let score = 100;
    const suggestions: string[] = [];

    if (!title) { score -= 15; suggestions.push("Ajouter un <title> principal clair."); }
    if (!description) { score -= 15; suggestions.push("Ajouter une meta-description (120–160 caractères)."); }
    if (headings.h1.length === 0) { score -= 10; suggestions.push("Ajouter un <h1> principal unique."); }
    if (headings.h1.length > 1) { score -= 5; suggestions.push("Limiter à un seul <h1> principal."); }
    if (wordCount < 300) { score -= 5; suggestions.push("Ajouter plus de contenu texte."); }
    if (missingAlt > 0) { score -= 10; suggestions.push(`${missingAlt} images sans attribut ALT.`); }
    if (!canonical) { score -= 5; suggestions.push("Ajouter un lien canonical."); }
    if (!robotsOK) { score -= 5; suggestions.push("robots.txt manquant."); }
    if (!sitemapOK) { score -= 5; suggestions.push("sitemap non détecté."); }

    score = Math.max(0, score);

    // === RESPONSE ========================================================================

    return res.json({
      ok: true,
      url,
      title,
      description,
      headings,
      wordCount,
      score,
      suggestions,
      images,
      missingAlt,
      internalLinks,
      externalLinks,
      canonical,
      robotsOK,
      sitemapOK,
      keywordsFound,
      strategy
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Erreur SEO" });
  }
});
