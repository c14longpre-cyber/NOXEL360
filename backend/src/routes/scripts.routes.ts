// backend/src/routes/scripts.routes.ts
import { Router } from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export const scriptsRouter = Router();

scriptsRouter.post("/scripts", async (req, res) => {
  let { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ ok: false, error: "Missing or invalid 'url' field in body." });
  }

  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  let pageUrl: URL;
  try {
    pageUrl = new URL(url);
  } catch {
    return res
      .status(400)
      .json({ ok: false, error: "Invalid URL format after normalization." });
  }

  try {
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

    const totalScripts = $("script").length;

    let externalScripts = 0;
    let inlineScripts = 0;
    let thirdPartyScripts = 0;
    let shopifyLikeScripts = 0;

    const scripts: {
      src: string | null;
      inline: boolean;
      async: boolean;
      defer: boolean;
      thirdParty: boolean;
    }[] = [];

    $("script").each((_, el) => {
      const src = $(el).attr("src") || null;
      const isInline = !src;
      const asyncAttr = $(el).attr("async") !== undefined;
      const deferAttr = $(el).attr("defer") !== undefined;

      if (src) {
        externalScripts++;
      } else {
        inlineScripts++;
      }

      let thirdParty = false;
      if (src) {
        try {
          const sUrl = new URL(src, pageUrl.origin);
          if (sUrl.hostname !== pageUrl.hostname) {
            thirdParty = true;
          }
        } catch {
          // ignore invalid URL
        }
      }

      if (thirdParty) {
        thirdPartyScripts++;
      }

      if (
        src &&
        (src.includes("cdn.shopify.com") ||
          src.includes("apps.shopify.com") ||
          src.includes("shopifycdn.com"))
      ) {
        shopifyLikeScripts++;
      }

      if (scripts.length < 20) {
        scripts.push({
          src,
          inline: isInline,
          async: asyncAttr,
          defer: deferAttr,
          thirdParty,
        });
      }
    });

    const recommendation = {
      reduceThirdParty:
        thirdPartyScripts > 5
          ? `Beaucoup de scripts tiers détectés (${thirdPartyScripts}). Supprime ou reporte le chargement de ceux qui ne sont pas essentiels.`
          : "Le volume de scripts tiers semble raisonnable.",
      asyncDefer:
        externalScripts > 0
          ? "Assure-toi que tes scripts externes critiques utilisent async/defer pour ne pas bloquer le rendu."
          : "Peu ou pas de scripts externes critiques détectés.",
      shopifyApps:
        shopifyLikeScripts > 0
          ? `${shopifyLikeScripts} script(s) semblent liés à des apps Shopify. Pense à désinstaller les apps que tu n’utilises plus.`
          : "Aucune app Shopify lourde clairement détectée dans les scripts.",
    };

    return res.json({
      ok: true,
      url,
      totalScripts,
      externalScripts,
      inlineScripts,
      thirdPartyScripts,
      shopifyLikeScripts,
      scripts,
      recommendation,
    });
  } catch (err) {
    console.error("Scripts analyze error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Error while analyzing scripts." });
  }
});
