"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePerformance = analyzePerformance;
// backend/src/services/pagespeedService.ts
const axios_1 = __importDefault(require("axios"));
/**
 * Appelle l’API PageSpeed Insights de Google et renvoie
 * un résumé des principaux indicateurs de performance.
 * En cas d’erreur ou de config manquante, renvoie null.
 */
async function analyzePerformance(url, strategy = "mobile") {
    const key = process.env.PAGESPEED_API_KEY;
    if (!key) {
        console.warn("⚠️ PAGESPEED_API_KEY manquant, performance ignorée.");
        return null;
    }
    try {
        const response = await axios_1.default.get("https://www.googleapis.com/pagespeedonline/v5/runPagespeed", {
            params: {
                url,
                strategy,
                key,
            },
        });
        const lh = response.data.lighthouseResult;
        if (!lh || !lh.categories?.performance) {
            console.warn("⚠️ Résultat PageSpeed incomplet.");
            return null;
        }
        const performanceScore = lh.categories.performance.score ?? 0;
        const audits = lh.audits ?? {};
        return {
            performanceScore,
            lcp: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
            cls: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
            tbt: audits["total-blocking-time"]?.displayValue ?? "N/A",
            strategy,
        };
    }
    catch (err) {
        console.error("Erreur PageSpeed:", err);
        return null;
    }
}
