import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
export default function PerformanceScan() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleScan = async () => {
        if (!url.trim()) {
            setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch("http://localhost:4000/api/performance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, strategy: "mobile" }),
            });
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            }
            catch {
                console.error("Réponse non-JSON :", text);
                setError("Réponse non valide du backend (performance).");
                return;
            }
            if (!response.ok || !data.ok) {
                setError(data.error || "Erreur lors de l'analyse performance.");
                return;
            }
            setResult(data);
        }
        catch (e) {
            console.error(e);
            setError("Impossible de joindre l'API performance.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "card", style: { marginTop: 16 }, children: [_jsx("h1", { children: "Audit Performance B+ (images & WebP)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL \u00E0 analyser" }), _jsx("input", { placeholder: "ex: https://kuryz.ca", value: url, onChange: (e) => setUrl(e.target.value) })] }), _jsx("button", { className: "button-primary", onClick: handleScan, disabled: loading, children: loading ? "Analyse en cours..." : "Analyser la performance" }), error && _jsx("p", { className: "error", children: error }), result && (_jsxs("div", { className: "results", children: [_jsxs("p", { children: [_jsx("strong", { children: "URL :" }), " ", result.url] }), result.pageSpeed && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "Score PageSpeed :" }), " ", Math.round(result.pageSpeed.performanceScore * 100), " / 100"] }), _jsxs("p", { children: [_jsx("strong", { children: "LCP :" }), " ", result.pageSpeed.lcp] }), _jsxs("p", { children: [_jsx("strong", { children: "CLS :" }), " ", result.pageSpeed.cls] }), _jsxs("p", { children: [_jsx("strong", { children: "TBT :" }), " ", result.pageSpeed.tbt] })] })), _jsxs("p", { children: [_jsx("strong", { children: "Images d\u00E9tect\u00E9es :" }), " ", result.imagesFound] }), _jsxs("p", { children: [_jsx("strong", { children: "Images non WebP :" }), " ", result.imagesNonWebP] }), _jsxs("p", { children: [_jsx("strong", { children: "Images sans ALT :" }), " ", result.imagesMissingAlt] }), _jsx("h2", { style: { fontWeight: 600, marginTop: 12 }, children: "\uD83D\uDD25 Recommandations" }), _jsxs("ul", { children: [_jsx("li", { children: result.recommendation.convertImages }), _jsx("li", { children: result.recommendation.improveLCP }), _jsx("li", { children: result.recommendation.lazyAdvice })] }), result.imageList && result.imageList.length > 0 && (_jsxs("div", { style: { marginTop: 16 }, children: [_jsx("strong", { children: "Images principales \u00E0 optimiser :" }), _jsx("div", { className: "image-grid", children: result.imageList.map((img, i) => (_jsxs("div", { className: "image-card", children: [_jsx("div", { className: "image-card__preview", children: _jsx("img", { src: img.src, alt: img.alt || "" }) }), _jsxs("div", { children: [_jsx("div", { children: img.isWebP ? "✅ Format WebP" : "⚠️ Format non-WebP" }), _jsx("div", { children: img.hasAlt ? "✅ ALT présent" : "⚠️ ALT manquant" })] })] }, i))) })] }))] }))] }));
}
