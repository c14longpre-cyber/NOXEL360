// backend/src/routes/performance.routes.ts
import { Router } from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { analyzePerformance } from "../services/pagespeedService";

export const performanceRouter = Router();

performanceRouter.post("/performance", async (req, res) => {
  let { url, strategy = "mobile" } = req.body as {
    url?: string;
    strategy?: "mobile" | "desktop";
  };

  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ ok: false, error: "Missing or invalid 'url'." });
  }

  // Normalisation URL
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    new URL(url);
  } catch {
    return res
      .status(400)
      .json({ ok: false, error: "Invalid URL format after normalization." });
  }

  try {
    // Récupération HTML de la page
    const response = await fetch(url, {
      headers: { "User-Agent": "Noxel360-Scanner/1.0" },
    });

    if (!response.ok) {
      return res.status(400).json({
        ok: false,
        error: `Unable to fetch URL. HTTP ${response.status}`,
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 🖼 Analyse des images (avec URL absolue)
    const imgList = $("img")
      .map((_, el) => {
        const rawSrc = $(el).attr("src") || "";
        let fullSrc = rawSrc;

        try {
          // reconstruit une URL absolue même si c’est relatif ou //cdn…
          fullSrc = new URL(rawSrc, url).href;
        } catch {
          // si ça échoue, on garde rawSrc
        }

        const alt = $(el).attr("alt") || null;
        const isWebP = fullSrc.toLowerCase().includes(".webp");
        const hasAlt = !!(alt && alt.trim().length > 0);

        return {
          src: fullSrc,
          alt,
          isWebP,
          hasAlt,
        };
      })
      .get();

    const imagesFound = imgList.length;
    const imagesNonWebP = imgList.filter((i) => !i.isWebP).length;
    const imagesMissingAlt = imgList.filter((i) => !i.hasAlt).length;

    // ⚡ PageSpeed
    const perf: any = await analyzePerformance(url, strategy);

    let improveLCP =
      "LCP optimal ou données PageSpeed non disponibles (clé manquante ou erreur).";

    if (
      perf &&
      typeof perf.performanceScore === "number" &&
      perf.performanceScore < 0.85
    ) {
      improveLCP =
        "Réduire le poids de l’image principale (hero), activer le preload et le lazy loading.";
    }

    const lazyAdvice =
      imagesFound > 6
        ? "Activez loading='lazy' sur les images non critiques."
        : "Lazy loading OK pour cette page.";

    return res.json({
      ok: true,
      url,
      strategy,
      pageSpeed: perf ?? null,
      imagesFound,
      imagesNonWebP,
      imagesMissingAlt,
      imageList: imgList.slice(0, 50), // on limite l’affichage
      recommendation: {
        convertImages:
          imagesNonWebP > 0
            ? `${imagesNonWebP} images devraient être converties en WebP.`
            : "Toutes les images semblent déjà en WebP ou optimisées.",
        improveLCP,
        lazyAdvice,
      },
    });
  } catch (e) {
    console.error("Performance scan error:", e);
    return res
      .status(500)
      .json({ ok: false, error: "Error while scanning performance." });
  }
});
