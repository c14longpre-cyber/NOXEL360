import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function GlobalScore() {
    const [url, setUrl] = useState("");
    const [strategy, setStrategy] = useState("mobile");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const handleScan = async () => {
        if (!url.trim()) {
            setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
            return;
        }
        setLoading(true);
        setError(null);
        setSummary(null);
        try {
            // 1) Appel SEO
            const seoRes = await fetch("http://localhost:4000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, strategy }),
            });
            const seoText = await seoRes.text();
            let seoData;
            try {
                seoData = JSON.parse(seoText);
            }
            catch {
                console.error("Réponse SEO non-JSON:", seoText);
                setError("Réponse SEO non valide.");
                return;
            }
            if (!seoRes.ok || !seoData.ok) {
                setError(seoData.error || "Erreur lors de l'analyse SEO.");
                return;
            }
            const seoScore = typeof seoData.score === "number"
                ? seoData.score
                : 0;
            // 2) Appel Performance
            const perfRes = await fetch("http://localhost:4000/api/performance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, strategy }),
            });
            const perfText = await perfRes.text();
            let perfData;
            try {
                perfData = JSON.parse(perfText);
            }
            catch {
                console.error("Réponse Performance non-JSON:", perfText);
                setError("Réponse Performance non valide.");
                return;
            }
            if (!perfRes.ok || !perfData.ok) {
                setError(perfData.error || "Erreur lors de l'analyse performance.");
                return;
            }
            // Score PageSpeed (0–1) → 0–100
            let perfScore = null;
            if (perfData.pageSpeed &&
                typeof perfData.pageSpeed.performanceScore === "number") {
                perfScore = Math.round(perfData.pageSpeed.performanceScore * 100);
            }
            // Score images (WebP + ALT)
            let imageScore = null;
            const totalImages = perfData.imagesFound || 0;
            const nonWebP = perfData.imagesNonWebP || 0;
            const missingAlt = perfData.imagesMissingAlt || 0;
            if (totalImages > 0) {
                const webpOK = (totalImages - nonWebP) / totalImages; // 0–1
                const altOK = (totalImages - missingAlt) / totalImages; // 0–1
                const raw = 0.5 * webpOK + 0.5 * altOK;
                imageScore = Math.round(raw * 100);
            }
            else {
                // pas d’images = pas de pénalité
                imageScore = 100;
            }
            // Score global pondéré
            let globalScore = null;
            let sum = 0;
            let weight = 0;
            if (!isNaN(seoScore)) {
                sum += seoScore * 0.4;
                weight += 0.4;
            }
            if (perfScore !== null) {
                sum += perfScore * 0.4;
                weight += 0.4;
            }
            if (imageScore !== null) {
                sum += imageScore * 0.2;
                weight += 0.2;
            }
            if (weight > 0) {
                globalScore = Math.round(sum / weight);
            }
            const seoSuggestions = Array.isArray(seoData.suggestions)
                ? seoData.suggestions
                : [];
            const perfAdvice = [];
            if (perfData.recommendation) {
                if (perfData.recommendation.improveLCP)
                    perfAdvice.push(perfData.recommendation.improveLCP);
                if (perfData.recommendation.lazyAdvice)
                    perfAdvice.push(perfData.recommendation.lazyAdvice);
            }
            const imageAdvice = [];
            if (nonWebP > 0) {
                imageAdvice.push(`${nonWebP} image(s) devraient être converties en WebP.`);
            }
            if (missingAlt > 0) {
                imageAdvice.push(`${missingAlt} image(s) n'ont pas de texte ALT descriptif.`);
            }
            setSummary({
                url: seoData.url || url,
                seoScore,
                perfScore,
                imageScore,
                globalScore,
                seoSuggestions,
                perfAdvice,
                imageAdvice,
            });
        }
        catch (err) {
            console.error(err);
            setError("Erreur inattendue lors du scan global.");
        }
        finally {
            setLoading(false);
        }
    };
    const renderScorePill = (label, score, color) => {
        if (score === null || isNaN(score)) {
            return (_jsxs("div", { className: "score-pill score-pill--neutral", children: [_jsx("span", { children: label }), _jsx("strong", { children: "N/A" })] }));
        }
        return (_jsxs("div", { className: `score-pill ${color}`, children: [_jsx("span", { children: label }), _jsxs("strong", { children: [score, "/100"] })] }));
    };
    const renderBar = (score) => {
        if (score === null || isNaN(score)) {
            return (_jsx("div", { className: "score-bar", children: _jsx("div", { className: "score-bar__fill score-bar__fill--na" }) }));
        }
        const width = Math.min(100, Math.max(0, score));
        return (_jsx("div", { className: "score-bar", children: _jsx("div", { className: "score-bar__fill " +
                    (score >= 80
                        ? "score-bar__fill--good"
                        : score >= 50
                            ? "score-bar__fill--medium"
                            : "score-bar__fill--bad"), style: { width: `${width}%` } }) }));
    };
    return (_jsxs("div", { className: "card", children: [_jsx("h1", { children: "Score global NOXEL360" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL \u00E0 analyser" }), _jsx("input", { placeholder: "ex: https://kuryz.ca", value: url, onChange: (e) => setUrl(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Strat\u00E9gie :" }), _jsxs("select", { value: strategy, onChange: (e) => setStrategy(e.target.value), children: [_jsx("option", { value: "mobile", children: "\uD83D\uDCF1 Mobile" }), _jsx("option", { value: "desktop", children: "\uD83D\uDDA5 Desktop" })] })] }), _jsx("button", { className: "button-primary", onClick: handleScan, disabled: loading, children: loading ? "Analyse globale..." : "Calculer le score global" }), error && _jsx("p", { className: "error", children: error }), summary && (_jsxs("div", { className: "results", style: { marginTop: 14 }, children: [_jsxs("p", { children: [_jsx("strong", { children: "URL :" }), " ", summary.url] }), _jsxs("div", { className: "global-score-grid", children: [_jsxs("div", { className: "global-score-main", children: [_jsx("p", { className: "global-score-label", children: "Score global NOXEL360" }), _jsx("p", { className: "global-score-value", children: summary.globalScore !== null
                                            ? `${summary.globalScore}/100`
                                            : "N/A" }), renderBar(summary.globalScore), _jsx("p", { className: "global-score-hint", children: "Pond\u00E9ration : SEO 40% \u2022 Performance 40% \u2022 Images 20%" })] }), _jsxs("div", { className: "global-score-side", children: [renderScorePill("SEO", summary.seoScore, "score-pill--seo"), renderScorePill("Performance", summary.perfScore, "score-pill--perf"), renderScorePill("Images", summary.imageScore, "score-pill--img")] })] }), _jsxs("div", { className: "global-score-advice", children: [summary.seoSuggestions.length > 0 && (_jsxs("div", { className: "advice-block", children: [_jsx("h3", { children: "SEO \u2013 Priorit\u00E9s" }), _jsx("ul", { children: summary.seoSuggestions.slice(0, 3).map((s, i) => (_jsx("li", { children: s }, i))) })] })), (summary.perfAdvice.length > 0 ||
                                summary.imageAdvice.length > 0) && (_jsxs("div", { className: "advice-block", children: [_jsx("h3", { children: "Performance & Images \u2013 Priorit\u00E9s" }), _jsxs("ul", { children: [summary.perfAdvice.slice(0, 2).map((s, i) => (_jsx("li", { children: s }, i))), summary.imageAdvice.slice(0, 2).map((s, i) => (_jsx("li", { children: s }, i + 100)))] })] }))] })] }))] }));
}
