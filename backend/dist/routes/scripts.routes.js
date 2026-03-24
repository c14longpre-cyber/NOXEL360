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
exports.scriptsRouter = void 0;
// backend/src/routes/scripts.routes.ts
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
exports.scriptsRouter = (0, express_1.Router)();
exports.scriptsRouter.post("/scripts", async (req, res) => {
    let { url } = req.body;
    if (!url || typeof url !== "string") {
        return res
            .status(400)
            .json({ ok: false, error: "Missing or invalid 'url' field in body." });
    }
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    let pageUrl;
    try {
        pageUrl = new URL(url);
    }
    catch {
        return res
            .status(400)
            .json({ ok: false, error: "Invalid URL format after normalization." });
    }
    try {
        const response = await (0, node_fetch_1.default)(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Noxel360-SEO-Bot/1.0",
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
        const scripts = [];
        $("script").each((_, el) => {
            const src = $(el).attr("src") || null;
            const isInline = !src;
            const asyncAttr = $(el).attr("async") !== undefined;
            const deferAttr = $(el).attr("defer") !== undefined;
            if (src) {
                externalScripts++;
            }
            else {
                inlineScripts++;
            }
            let thirdParty = false;
            if (src) {
                try {
                    const sUrl = new URL(src, pageUrl.origin);
                    if (sUrl.hostname !== pageUrl.hostname) {
                        thirdParty = true;
                    }
                }
                catch {
                    // ignore invalid URL
                }
            }
            if (thirdParty) {
                thirdPartyScripts++;
            }
            if (src &&
                (src.includes("cdn.shopify.com") ||
                    src.includes("apps.shopify.com") ||
                    src.includes("shopifycdn.com"))) {
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
            reduceThirdParty: thirdPartyScripts > 5
                ? `Beaucoup de scripts tiers détectés (${thirdPartyScripts}). Supprime ou reporte le chargement de ceux qui ne sont pas essentiels.`
                : "Le volume de scripts tiers semble raisonnable.",
            asyncDefer: externalScripts > 0
                ? "Assure-toi que tes scripts externes critiques utilisent async/defer pour ne pas bloquer le rendu."
                : "Peu ou pas de scripts externes critiques détectés.",
            shopifyApps: shopifyLikeScripts > 0
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
    }
    catch (err) {
        console.error("Scripts analyze error:", err);
        return res
            .status(500)
            .json({ ok: false, error: "Error while analyzing scripts." });
    }
});
