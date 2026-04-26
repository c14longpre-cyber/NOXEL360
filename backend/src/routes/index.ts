// backend/src/routes/index.ts

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

  // Vérif de base
  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ ok: false, error: "Missing or invalid 'url' field in body." });
  }

  // 🧼 Nettoyage & normalisation
  url = url.trim();

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  // Validation de l’URL
  let pageUrl: URL;
  try {
    pageUrl = new URL(url);
  } catch {
    return res
      .status(400)
      .json({ ok: false, error: "Invalid URL format after normalization." });
  }

  try {
    // 🔎 Récupération HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Noxel360-SEO-Bot/1.0",
      },
    });

    if (!response.ok) {
      return res.status(400).json({
        ok: false,
        error: `Unable to fetch URL. HTTP ${response.status}`,
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // ---- META DE BASE ----
    const title = $("title").first().text().trim() || null;
    const description =
      $('meta[name="description"]').attr("content")?.trim() || null;

    const h1: string[] = [];
    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1.push(text);
    });

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(" ").length : 0;

    // ---- STRUCTURE DE TITRES ----
    const h2Count = $("h2").length;
    const h3Count = $("h3").length;

    // ---- IMAGES ----
    const images = $("img").length;
    const missingAlt = $('img:not([alt]), img[alt=""]').length;

    // ---- LIENS ----
    const allLinks = $("a[href]").toArray();
    const totalLinks = allLinks.length;

    let internalLinks = 0;
    let externalLinks = 0;
    let nofollowLinks = 0;
    let brokenLinks = 0;
    let redirectLinks = 0;

    type SampleLink = {
      href: string;
      text: string;
      rel: string | null;
      internal: boolean;
      status: number | null;
      isBroken: boolean;
      isRedirect: boolean;
    };

    const sampleLinks: SampleLink[] = [];

    // On limite les liens vérifiés pour les statuts HTTP
    const maxChecked = 40;
    const linksToCheck = allLinks.slice(0, maxChecked);

    for (const el of linksToCheck) {
      const elem = $(el);
      const href = elem.attr("href") || "";
      const rel = elem.attr("rel") || null;

      if (rel && /nofollow/i.test(rel)) {
        nofollowLinks++;
      }

      let internal = false;
      let absoluteUrl: string | null = null;

      try {
        const linkUrl = new URL(href, pageUrl.origin);
        absoluteUrl = linkUrl.toString();
        internal = linkUrl.hostname === pageUrl.hostname;
      } catch {
        // URL invalide => on ne check pas plus loin
      }

      if (internal) {
        internalLinks++;
      } else {
        externalLinks++;
      }

      let status: number | null = null;
      let isBroken = false;
      let isRedirect = false;

      if (absoluteUrl) {
        try {
          // HEAD d’abord (plus léger)
          let resp = await fetch(absoluteUrl, {
            method: "HEAD",
            redirect: "manual",
          });

          // Certains serveurs refusent HEAD
          if (!resp.ok && resp.status === 405) {
            resp = await fetch(absoluteUrl, {
              method: "GET",
              redirect: "manual",
            });
          }

          status = resp.status;

          if (status >= 400) {
            isBroken = true;
            brokenLinks++;
          } else if (status >= 300 && status < 400) {
            isRedirect = true;
            redirectLinks++;
          }
        } catch {
          // Erreur réseau => probablement cassé
          isBroken = true;
          brokenLinks++;
        }
      }

      // On enregistre un échantillon pour l’UI
      if (sampleLinks.length < 12) {
        const text = elem.text().trim().slice(0, 80);
        sampleLinks.push({
          href,
          text,
          rel,
          internal,
          status,
          isBroken,
          isRedirect,
        });
      }
    }

    // ---- BALISES AVANCÉES ----
    const canonical = $('link[rel="canonical"]').attr("href") || null;
    const ogTitle = $('meta[property="og:title"]').attr("content") || null;
    const ogImage = $('meta[property="og:image"]').attr("content") || null;

    // ---- SCORE SEO SIMPLE ----
    let score = 100;
    const suggestions: string[] = [];

    if (!title) {
      score -= 20;
      suggestions.push("Add a <title> tag with a clear page title.");
    } else if (title.length < 30 || title.length > 65) {
      score -= 10;
      suggestions.push("Adjust the <title> length (ideally 30–65 characters).");
    }

    if (!description) {
      score -= 15;
      suggestions.push("Add a meta description between 120–160 characters.");
    }

    if (h1.length === 0) {
      score -= 10;
      suggestions.push("Add at least one <h1> describing the main topic.");
    } else if (h1.length > 2) {
      score -= 5;
      suggestions.push(
        "Avoid too many <h1> tags; use <h2>/<h3> for subsections."
      );
    }

    if (wordCount < 200) {
      score -= 10;
      suggestions.push("Add more textual content (aim for at least 200+ words).");
    }

    if (totalLinks === 0) {
      suggestions.push("Add internal links to connect this page to your site.");
    } else {
      if (internalLinks < 3) {
        suggestions.push(
          "Increase the number of internal links to related pages (SEO & UX)."
        );
      }
      if (externalLinks > 20) {
        suggestions.push(
          "Too many external links can dilute SEO; keep only the most relevant."
        );
      }
      if (nofollowLinks === 0 && externalLinks > 5) {
        suggestions.push(
          'Add rel="nofollow" on non-trusted or promotional external links.'
        );
      }
      if (brokenLinks > 0) {
        suggestions.push(
          `Fix ${brokenLinks} broken link(s) (4xx/5xx) to avoid bad UX and SEO issues.`
        );
      }
      if (redirectLinks > 5) {
        suggestions.push(
          `You have many redirecting links; update URLs to their final destination to improve speed.`
        );
      }
    }

    if (score < 0) score = 0;

    const keywordAudit = auditKeywords(bodyText);

    return res.json({
      ok: true,
      url, // URL normalisée
      title,
      description,
      h1,
      wordCount,
      score,
      suggestions,
      keywords: keywordAudit,
      performance: null, // PageSpeed dans un autre endpoint
      strategy,
      // Structure
      h2Count,
      h3Count,
      images,
      missingAlt,
      // Liens
      links: totalLinks,
      internalLinks,
      externalLinks,
      nofollowLinks,
      brokenLinks,
      redirectLinks,
      sampleLinks,
      // Balises avancées
      canonical,
      ogTitle,
      ogImage,
    });
  } catch (err: any) {
    console.error("SEO analyze error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Error while analyzing the URL." });
  }
});
