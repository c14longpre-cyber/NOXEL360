import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from "react-router-dom";
import { getModule, } from "../modules/modules.registry";
/* ======================================================
   NOXEL360 — Module Host
   - Layout corrigé
   - Logo à gauche
   - Contenu à droite
   - Gros titre retiré
   ====================================================== */
// TODO: brancher le vrai tier utilisateur (auth / store)
const CURRENT_TIER = "bronze";
/* Ordre réel des tiers (FR) */
const TIER_ORDER = ["bronze", "argent", "or", "platine", "diamant"];
function tierRank(tier) {
    return TIER_ORDER.indexOf(tier);
}
function hasAccess(current, required) {
    return tierRank(current) >= tierRank(required);
}
export default function ModuleHost() {
    const { moduleId } = useParams();
    const mod = getModule(moduleId);
    // Ajuste ce chemin si nécessaire selon ton arborescence réelle
    const logoSrc = mod ? `/logos/${mod.id}.webp` : "";
    /* =========================
       Module introuvable
       ========================= */
    if (!mod) {
        return (_jsx("div", { className: "noxel-landing", children: _jsx("div", { className: "nx-wrap", children: _jsxs("div", { className: "nx-content", children: [_jsx("h2", { children: "Module introuvable" }), _jsx("p", { children: _jsx(Link, { to: "/dashboard", className: "nx-card__link", children: "\u2190 Retour dashboard" }) })] }) }) }));
    }
    /* =========================
       Tier gating
       ========================= */
    const allowed = hasAccess(CURRENT_TIER, mod.minTier);
    if (!allowed) {
        return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "180px minmax(0, 1fr)",
                                gap: 28,
                                alignItems: "start",
                            }, children: [_jsx("div", { children: _jsx("img", { src: logoSrc, alt: mod.name, className: "module-landing-logo", loading: "lazy", style: {
                                            width: 180,
                                            height: "auto",
                                            display: "block",
                                            objectFit: "contain",
                                        } }) }), _jsxs("div", { style: { minWidth: 0 }, children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsxs("p", { className: "nx-subtitle", style: { marginTop: 8 }, children: ["Ce module n\u00E9cessite le tier ", _jsx("strong", { children: mod.minTier }), "."] })] })] }) }), _jsxs("div", { className: "nx-card nx-card--highlight", children: [_jsx("div", { className: "nx-card__title", children: "Acc\u00E8s verrouill\u00E9" }), _jsxs("p", { className: "nx-card__text", children: ["Ton tier actuel : ", _jsx("strong", { children: CURRENT_TIER })] }), _jsxs("ul", { className: "nx-card__list", children: [_jsxs("li", { children: [_jsx("strong", { children: "Tier minimum :" }), " ", mod.minTier] }), _jsxs("li", { children: [_jsx("strong", { children: "Route :" }), " ", mod.route] }), _jsxs("li", { children: [_jsx("strong", { children: "ID :" }), " ", mod.id] })] }), _jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }, children: [_jsx(Link, { to: "/pricing", className: "nav-cta", style: { marginTop: 0 }, children: "Upgrade & Pricing" }), _jsx(Link, { to: "/dashboard", className: "nav-cta", style: { marginTop: 0, opacity: 0.9 }, children: "Retour dashboard" })] })] })] }) }));
    }
    /* =========================
       Module externe
       ========================= */
    if (mod.kind === "external" && mod.externalUrl) {
        return (_jsx("div", { className: "noxel-landing", style: { padding: 0 }, children: _jsx("iframe", { title: mod.name, src: mod.externalUrl, className: "w-full h-full border-0", style: { display: "block", height: "100vh" } }) }));
    }
    /* =========================
       Module désactivé
       ========================= */
    const effectiveStatus = mod.status ?? "placeholder";
    if (effectiveStatus === "disabled") {
        return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "180px minmax(0, 1fr)",
                                gap: 28,
                                alignItems: "start",
                            }, children: [_jsx("div", { children: _jsx("img", { src: logoSrc, alt: mod.name, className: "module-landing-logo", loading: "lazy", style: {
                                            width: 180,
                                            height: "auto",
                                            display: "block",
                                            objectFit: "contain",
                                        } }) }), _jsxs("div", { style: { minWidth: 0 }, children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("p", { className: "nx-subtitle", style: { marginTop: 8 }, children: "Module d\u00E9sactiv\u00E9 pour le moment." })] })] }) }), _jsx("div", { className: "nx-content", children: _jsx("p", { children: _jsx(Link, { to: "/dashboard", className: "nx-card__link", children: "\u2190 Retour dashboard" }) }) })] }) }));
    }
    /* =========================
       Placeholder / Active
       ========================= */
    return (_jsx("div", { className: "noxel-landing", children: _jsx("div", { className: "nx-wrap", children: _jsx("header", { className: "nx-hero", children: _jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "220px minmax(0, 1fr)",
                        gap: 36,
                        alignItems: "start",
                    }, children: [_jsx("div", { children: _jsx("img", { src: logoSrc, alt: mod.name, className: "module-landing-logo", loading: "lazy", style: {
                                    width: 220,
                                    height: "auto",
                                    display: "block",
                                    objectFit: "contain",
                                } }) }), _jsxs("div", { style: { minWidth: 0, width: "100%" }, children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("p", { className: "nx-subtitle", style: { marginTop: 8 }, children: "Module interne \u2014 pr\u00EAt \u00E0 \u00EAtre branch\u00E9." }), _jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }, children: [_jsx(Link, { to: "/dashboard", className: "nav-cta", style: { marginTop: 0 }, children: "\u2190 Retour dashboard" }), _jsx("span", { className: "pill", children: effectiveStatus === "active" ? "ACTIF" : "BIENTÔT" })] }), _jsx("div", { style: { marginTop: 24, width: "100%" }, children: _jsxs("div", { className: "nx-card", style: { margin: 0 }, children: [_jsx("div", { className: "nx-card__title", style: { marginTop: 0 }, children: "Placeholder" }), _jsxs("div", { style: { width: "100%", maxWidth: "none" }, children: [_jsx("p", { className: "nx-card__text", children: "Cette page sert de point d\u2019entr\u00E9e stable. Quand le module sera pr\u00EAt, on remplacera ce contenu par la vraie interface, sans toucher aux routes existantes." }), _jsxs("ul", { className: "nx-card__list", children: [_jsxs("li", { children: [_jsx("strong", { children: "Route :" }), " ", mod.route] }), _jsxs("li", { children: [_jsx("strong", { children: "Tier minimum :" }), " ", mod.minTier] }), _jsxs("li", { children: [_jsx("strong", { children: "ID :" }), " ", mod.id] })] })] })] }) })] })] }) }) }) }));
}
