import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { tierLogos } from "../tierLogos";
function LogoNiveau({ plan }) {
    const logo = tierLogos[plan];
    return (_jsxs("picture", { children: [_jsx("source", { srcSet: logo.webp, type: "image/webp" }), _jsx("img", { src: logo.webp, alt: `Niveau ${plan}`, width: 200, height: 200, style: { display: "block" } })] }));
}
export default function AnalyseurSEO() {
    const [url, setUrl] = useState("");
    const [strategy, setStrategy] = useState("mobile");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleAnalyse = async () => {
        if (!url.trim()) {
            setError("Merci d’entrer une URL (ex: kuryz.ca).");
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const response = await fetch("http://localhost:4000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, strategy }),
            });
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            }
            catch {
                console.error("Réponse non-JSON :", text);
                setError("Le backend ne renvoie pas du JSON. Vérifie l’URL de l’API (port 4000).");
                return;
            }
            if (!response.ok || !data.ok) {
                setError(data.error || "Erreur lors de l'analyse.");
                return;
            }
            setResult(data);
        }
        catch (err) {
            console.error(err);
            setError("Impossible de joindre l'API (backend).");
        }
        finally {
            setLoading(false);
        }
    };
    // pour l’instant, on affiche Platine en dur.
    const currentPlan = "platine";
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    marginBottom: 16,
                }, children: [_jsxs("div", { children: [_jsx("h1", { children: "Noxel360 \u2014 Analyse SEO d\u2019une page" }), _jsx("p", { style: { margin: 0, opacity: 0.8, fontSize: 14 }, children: "Module 1 \u2014 Audit structure & contenu \u00B7 Module 2 \u2014 Liens & erreurs" }), _jsxs("p", { style: { margin: 0, opacity: 0.7, fontSize: 13 }, children: ["Niveau actuel :", " ", _jsx("strong", { style: { textTransform: "uppercase" }, children: currentPlan })] })] }), _jsx(LogoNiveau, { plan: currentPlan })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL \u00E0 analyser" }), _jsx("input", { placeholder: "ex: kuryz.ca ou https://kuryz.ca", value: url, onChange: (e) => setUrl(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Strat\u00E9gie" }), _jsxs("select", { value: strategy, onChange: (e) => setStrategy(e.target.value), children: [_jsx("option", { value: "mobile", children: "\uD83D\uDCF1 Mobile" }), _jsx("option", { value: "desktop", children: "\uD83D\uDDA5 Desktop" })] })] }), _jsx("button", { className: "button-primary", onClick: handleAnalyse, disabled: loading, children: loading ? "Analyse en cours..." : "Analyser la page" }), error && _jsx("p", { className: "error", children: error }), result && (_jsxs("div", { className: "results", children: [_jsx("h3", { style: { marginTop: 10, marginBottom: 4 }, children: "R\u00E9sum\u00E9 de la page" }), _jsxs("p", { children: [_jsx("strong", { children: "URL :" }), " ", result.url] }), _jsxs("p", { children: [_jsx("strong", { children: "Title :" }), " ", result.title || "Non défini"] }), _jsxs("p", { children: [_jsx("strong", { children: "Meta description :" }), " ", result.description || "Non définie"] }), _jsxs("p", { children: [_jsx("strong", { children: "H1 :" }), " ", result.h1.length ? result.h1.join(", ") : "Aucun"] }), _jsxs("p", { children: [_jsx("strong", { children: "Nombre de mots :" }), " ", result.wordCount] }), _jsxs("p", { children: [_jsx("strong", { children: "Score SEO :" }), " ", result.score, "/100"] }), _jsxs("div", { style: { marginTop: 10 }, children: [_jsx("h3", { style: { marginBottom: 4 }, children: "Structure & contenu" }), _jsxs("p", { children: [_jsx("strong", { children: "H2 :" }), " ", result.h2Count, " \u2022", " ", _jsx("strong", { children: "H3 :" }), " ", result.h3Count] }), _jsxs("p", { children: [_jsx("strong", { children: "Images :" }), " ", result.images, " \u2022", " ", _jsx("strong", { children: "Images sans ALT :" }), " ", result.missingAlt] })] }), _jsxs("div", { style: { marginTop: 10 }, children: [_jsx("h3", { style: { marginBottom: 4 }, children: "Liens internes, externes & 404" }), _jsxs("p", { children: [_jsx("strong", { children: "Liens totaux :" }), " ", result.links] }), _jsxs("p", { children: [_jsx("strong", { children: "Liens internes :" }), " ", result.internalLinks, " \u2022", " ", _jsx("strong", { children: "Liens externes :" }), " ", result.externalLinks] }), _jsxs("p", { children: [_jsx("strong", { children: "Liens nofollow :" }), " ", result.nofollowLinks] }), _jsxs("p", { children: [_jsx("strong", { children: "Liens cass\u00E9s (4xx/5xx) :" }), " ", result.brokenLinks > 0 ? (_jsx("span", { style: { color: "#b91c1c", fontWeight: 600 }, children: result.brokenLinks })) : ("0")] }), _jsxs("p", { children: [_jsx("strong", { children: "Liens en redirection (3xx) :" }), " ", result.redirectLinks] }), result.sampleLinks && result.sampleLinks.length > 0 && (_jsxs("div", { style: { marginTop: 6 }, children: [_jsx("strong", { children: "Exemples de liens v\u00E9rifi\u00E9s :" }), _jsx("ul", { children: result.sampleLinks.map((link, i) => {
                                            let icon = link.internal ? "🏠" : "🌐";
                                            let statusLabel = "";
                                            let statusColor = "#059669"; // vert OK
                                            if (link.isBroken) {
                                                icon = "❌";
                                                statusLabel = link.status
                                                    ? ` (${link.status})`
                                                    : " (erreur)";
                                                statusColor = "#b91c1c";
                                            }
                                            else if (link.isRedirect) {
                                                icon = "↪";
                                                statusLabel = link.status ? ` (${link.status})` : "";
                                                statusColor = "#d97706";
                                            }
                                            else if (link.status) {
                                                statusLabel = ` (${link.status})`;
                                            }
                                            return (_jsx("li", { children: _jsxs("span", { style: {
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                    }, children: [_jsx("span", { children: icon }), _jsxs("span", { title: link.href, children: [link.text || "(sans texte)", " \u2014", " ", _jsx("code", { style: { fontSize: "0.75rem" }, children: link.href })] }), link.rel && (_jsxs("span", { style: { color: "#6b7280", fontSize: 11 }, children: ["(", link.rel.toLowerCase(), ")"] })), link.status !== null && (_jsx("span", { style: {
                                                                marginLeft: 6,
                                                                fontSize: 11,
                                                                color: statusColor,
                                                            }, children: statusLabel }))] }) }, i));
                                        }) })] }))] }), _jsxs("div", { style: { marginTop: 10 }, children: [_jsx("h3", { style: { marginBottom: 4 }, children: "Balises avanc\u00E9es" }), _jsxs("p", { children: [_jsx("strong", { children: "Canonical :" }), " ", result.canonical || "Non définie"] }), _jsxs("p", { children: [_jsx("strong", { children: "Open Graph title :" }), " ", result.ogTitle || "Non défini"] }), _jsxs("p", { children: [_jsx("strong", { children: "Open Graph image :" }), " ", result.ogImage || "Non définie"] })] }), result.suggestions.length > 0 && (_jsxs("div", { style: { marginTop: 10 }, children: [_jsx("h3", { style: { marginBottom: 4 }, children: "Suggestions Noxel360" }), _jsx("ul", { children: result.suggestions.map((s, i) => (_jsx("li", { children: s }, i))) })] }))] }))] }));
}
