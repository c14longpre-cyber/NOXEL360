"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceRouter = void 0;
// backend/src/routes/performance.routes.ts
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const pagespeedService_1 = require("../services/pagespeedService");
exports.performanceRouter = (0, express_1.Router)();
exports.performanceRouter.post("/performance", async (req, res) => {
    let { url, strategy = "mobile" } = req.body;
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
    }
    catch {
        return res
            .status(400)
            .json({ ok: false, error: "Invalid URL format after normalization." });
    }
    try {
        // Récupération HTML de la page
        const response = await (0, node_fetch_1.default)(url, {
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
            }
            catch {
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
        const perf = await (0, pagespeedService_1.analyzePerformance)(url, strategy);
        let improveLCP = "LCP optimal ou données PageSpeed non disponibles (clé manquante ou erreur).";
        if (perf &&
            typeof perf.performanceScore === "number" &&
            perf.performanceScore < 0.85) {
            improveLCP =
                "Réduire le poids de l’image principale (hero), activer le preload et le lazy loading.";
        }
        const lazyAdvice = imagesFound > 6
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
                convertImages: imagesNonWebP > 0
                    ? `${imagesNonWebP} images devraient être converties en WebP.`
                    : "Toutes les images semblent déjà en WebP ou optimisées.",
                improveLCP,
                lazyAdvice,
            },
        });
    }
    catch (e) {
        console.error("Performance scan error:", e);
        return res
            .status(500)
            .json({ ok: false, error: "Error while scanning performance." });
    }
});
