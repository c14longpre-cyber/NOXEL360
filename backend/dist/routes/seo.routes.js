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
exports.router = void 0;
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const auditKeywords_1 = require("./auditKeywords");
exports.router = (0, express_1.Router)();
exports.router.post("/analyze", async (req, res) => {
    let { url, strategy = "mobile" } = req.body;
    if (!url)
        return res.status(400).json({ ok: false, error: "URL manquante." });
    url = url.trim();
    if (!/^https?:\/\//i.test(url))
        url = "https://" + url;
    try {
        new URL(url);
    }
    catch {
        return res.status(400).json({ ok: false, error: "URL invalide." });
    }
    try {
        const response = await (0, node_fetch_1.default)(url, {
            headers: {
                "User-Agent": "Noxel360-SEO-Analyzer/2.0",
                Accept: "text/html"
            },
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        // === TITLE + META ULTIMATE READ ========================================================
        const title = $("title").text().trim() ||
            $('meta[property="og:title"]').attr("content")?.trim() ||
            $('meta[name="twitter:title"]').attr("content")?.trim() ||
            null;
        const description = $('meta[name="description"]').attr("content")?.trim() ||
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
        const robotsOK = await (0, node_fetch_1.default)(url + "/robots.txt").then(r => r.ok).catch(() => false);
        const sitemapOK = await (0, node_fetch_1.default)(url + "/sitemap.xml").then(r => r.ok).catch(() => false);
        // === QUALITATIVE WORD COUNT ===========================================================
        const bodyText = $("body").text().replace(/\s+/g, " ").trim();
        const wordCount = bodyText ? bodyText.split(" ").length : 0;
        const keywordsFound = (0, auditKeywords_1.auditKeywords)(bodyText);
        // === SMART SEO SCORE ================================================================
        let score = 100;
        const suggestions = [];
        if (!title) {
            score -= 15;
            suggestions.push("Ajouter un <title> principal clair.");
        }
        if (!description) {
            score -= 15;
            suggestions.push("Ajouter une meta-description (120–160 caractères).");
        }
        if (headings.h1.length === 0) {
            score -= 10;
            suggestions.push("Ajouter un <h1> principal unique.");
        }
        if (headings.h1.length > 1) {
            score -= 5;
            suggestions.push("Limiter à un seul <h1> principal.");
        }
        if (wordCount < 300) {
            score -= 5;
            suggestions.push("Ajouter plus de contenu texte.");
        }
        if (missingAlt > 0) {
            score -= 10;
            suggestions.push(`${missingAlt} images sans attribut ALT.`);
        }
        if (!canonical) {
            score -= 5;
            suggestions.push("Ajouter un lien canonical.");
        }
        if (!robotsOK) {
            score -= 5;
            suggestions.push("robots.txt manquant.");
        }
        if (!sitemapOK) {
            score -= 5;
            suggestions.push("sitemap non détecté.");
        }
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: "Erreur SEO" });
    }
});
