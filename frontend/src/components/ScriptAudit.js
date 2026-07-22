import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function ScriptAudit() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const handleScan = async () => {
        if (!url.trim()) {
            setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch("http://localhost:4000/api/scripts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            }
            catch {
                console.error("Réponse Scripts non-JSON :", text);
                setError("Réponse non valide du backend (scripts).");
                return;
            }
            if (!response.ok || !data.ok) {
                setError(data.error || "Erreur lors de l'analyse des scripts.");
                return;
            }
            setResult(data);
        }
        catch (err) {
            console.error(err);
            setError("Impossible de joindre l'API scripts.");
        }
        finally {
            setLoading(false);
        }
    };
    // --- Helpers pour les stats avancées ----------------------
    const getBlockingCount = (scripts) => scripts.filter((s) => !s.async && !s.defer).length;
    const getDuplicateCount = (scripts) => {
        const counts = new Map();
        scripts.forEach((s) => {
            if (!s.src)
                return;
            const key = s.src;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        });
        let duplicates = 0;
        for (const [, count] of counts) {
            if (count > 1) {
                duplicates += count - 1;
            }
        }
        return duplicates;
    };
    // ----------------------------------------------------------
    return (_jsxs("div", { className: "card", children: [_jsx("h1", { children: "Audit Scripts & Apps (JS)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL \u00E0 analyser" }), _jsx("input", { placeholder: "ex: https://kuryz.ca", value: url, onChange: (e) => setUrl(e.target.value) })] }), _jsx("button", { className: "button-primary", onClick: handleScan, disabled: loading, children: loading ? "Analyse des scripts..." : "Analyser les scripts" }), error && _jsx("p", { className: "error", children: error }), result && (_jsxs("div", { className: "results", style: { marginTop: 16 }, children: [_jsxs("p", { children: [_jsx("strong", { children: "URL :" }), " ", result.url] }), _jsxs("p", { children: [_jsx("strong", { children: "Scripts totaux :" }), " ", result.totalScripts] }), _jsxs("p", { children: [_jsx("strong", { children: "Externes :" }), " ", result.externalScripts, " |", " ", _jsx("strong", { children: "Inline :" }), " ", result.inlineScripts] }), _jsxs("p", { children: [_jsx("strong", { children: "Scripts tiers :" }), " ", result.thirdPartyScripts] }), _jsxs("p", { children: [_jsx("strong", { children: "Scripts li\u00E9s \u00E0 des apps Shopify :" }), " ", result.shopifyLikeScripts] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsxs("p", { children: [_jsx("strong", { children: "Scripts bloquants (sans async / defer) :" }), " ", getBlockingCount(result.scripts)] }), _jsxs("p", { children: [_jsx("strong", { children: "Scripts doublons :" }), " ", getDuplicateCount(result.scripts)] })] }), _jsxs("div", { style: { marginTop: 16 }, children: [_jsx("h3", { style: { fontWeight: 600 }, children: "\uD83D\uDD25 Recommandations g\u00E9n\u00E9rales" }), _jsxs("ul", { children: [_jsx("li", { children: result.recommendation.reduceThirdParty }), _jsx("li", { children: result.recommendation.asyncDefer }), _jsx("li", { children: result.recommendation.shopifyApps })] })] }), _jsxs("div", { style: { marginTop: 16 }, children: [_jsx("h3", { style: { fontWeight: 600 }, children: "\uD83C\uDFAF Actions NOXEL360 sugg\u00E9r\u00E9es" }), _jsxs("ul", { children: [getBlockingCount(result.scripts) > 0 && (_jsxs("li", { children: ["\u27A1\uFE0F Convertir", " ", _jsx("strong", { children: getBlockingCount(result.scripts) }), " script(s) en ", _jsx("b", { children: "async" }), " ou ", _jsx("b", { children: "defer" }), " pour r\u00E9duire le temps de blocage."] })), result.externalScripts > 15 && (_jsxs("li", { children: ["\u26A0\uFE0F Beaucoup de scripts externes (", _jsx("strong", { children: result.externalScripts }), ") \u2014 fusionner ou supprimer ceux qui ne sont pas essentiels."] })), getDuplicateCount(result.scripts) > 0 && (_jsxs("li", { children: ["\uD83E\uDE93 ", _jsx("strong", { children: getDuplicateCount(result.scripts) }), " ", "script(s) doublon(s) d\u00E9tect\u00E9(s) \u2014 v\u00E9rifier les inclusions multiples."] })), result.shopifyLikeScripts > 5 && (_jsxs("li", { children: ["\uD83E\uDDE9 Plusieurs scripts d\u2019apps Shopify (", _jsx("strong", { children: result.shopifyLikeScripts }), ") \u2014 v\u00E9rifier quelles apps peuvent \u00EAtre d\u00E9sinstall\u00E9es ou d\u00E9sactiv\u00E9es."] })), getBlockingCount(result.scripts) === 0 &&
                                        getDuplicateCount(result.scripts) === 0 &&
                                        result.externalScripts <= 15 && (_jsx("li", { children: "\u2705 Structure des scripts globalement saine." }))] })] }), result.scripts && result.scripts.length > 0 && (_jsxs("div", { style: { marginTop: 18 }, children: [_jsx("h3", { style: { fontWeight: 600 }, children: "\uD83D\uDCCA Scripts d\u00E9tect\u00E9s" }), _jsx("div", { style: { overflowX: "auto", marginTop: 8 }, children: _jsxs("table", { style: {
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: 12,
                                    }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: {
                                                            borderBottom: "1px solid #e5e7eb",
                                                            textAlign: "left",
                                                            padding: "4px 6px",
                                                        }, children: "Source" }), _jsx("th", { style: {
                                                            borderBottom: "1px solid #e5e7eb",
                                                            textAlign: "center",
                                                            padding: "4px 6px",
                                                        }, children: "Async" }), _jsx("th", { style: {
                                                            borderBottom: "1px solid #e5e7eb",
                                                            textAlign: "center",
                                                            padding: "4px 6px",
                                                        }, children: "Defer" }), _jsx("th", { style: {
                                                            borderBottom: "1px solid #e5e7eb",
                                                            textAlign: "center",
                                                            padding: "4px 6px",
                                                        }, children: "Type" }), _jsx("th", { style: {
                                                            borderBottom: "1px solid #e5e7eb",
                                                            textAlign: "center",
                                                            padding: "4px 6px",
                                                        }, children: "Impact" })] }) }), _jsx("tbody", { children: result.scripts.map((s, i) => {
                                                const impact = s.async || s.defer ? "🟢 OK" : "🔴 Bloquant";
                                                const typeLabel = s.inline
                                                    ? "Inline"
                                                    : s.src && s.src.includes("shopify")
                                                        ? "Shopify / App"
                                                        : s.thirdParty
                                                            ? "Tiers"
                                                            : "Interne";
                                                return (_jsxs("tr", { children: [_jsx("td", { style: {
                                                                borderBottom: "1px solid #f3f4f6",
                                                                padding: "4px 6px",
                                                                maxWidth: 280,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }, title: s.src ?? "Inline script", children: s.inline ? "Inline script" : s.src }), _jsx("td", { style: {
                                                                borderBottom: "1px solid #f3f4f6",
                                                                textAlign: "center",
                                                                padding: "4px 6px",
                                                            }, children: s.async ? "✔️" : "—" }), _jsx("td", { style: {
                                                                borderBottom: "1px solid #f3f4f6",
                                                                textAlign: "center",
                                                                padding: "4px 6px",
                                                            }, children: s.defer ? "✔️" : "—" }), _jsx("td", { style: {
                                                                borderBottom: "1px solid #f3f4f6",
                                                                textAlign: "center",
                                                                padding: "4px 6px",
                                                            }, children: typeLabel }), _jsx("td", { style: {
                                                                borderBottom: "1px solid #f3f4f6",
                                                                textAlign: "center",
                                                                padding: "4px 6px",
                                                            }, children: impact })] }, i));
                                            }) })] }) })] }))] }))] }));
}
