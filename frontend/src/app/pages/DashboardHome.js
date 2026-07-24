import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useModulesIndex } from "../modules/useModulesIndex";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
import { useI18n } from "@/useI18n";
export default function DashboardHome() {
    const tier = "diamond";
    const nav = useNavigate();
    const modules = useModulesIndex();
    const { t } = useI18n();
    const [activeKey, setActiveKey] = useState("nexus");
    function openModule(key, route, external) {
        setActiveKey(key);
        if (external) {
            window.open(route, "_blank", "noopener,noreferrer");
        }
        else {
            nav(route);
        }
    }
    const onCardKeyDown = (e, key, route, external) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModule(key, route, external);
        }
    };
    return (_jsxs("div", { className: "noxel-app", "data-tier": tier, children: [_jsxs("header", { className: "noxel-header", children: [_jsxs("div", { className: "hdr-left", children: [_jsx(Link, { to: "/dashboard", "aria-label": t("dashboard.title"), style: {
                                    display: "inline-flex",
                                    width: 200,
                                    height: 200,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textDecoration: "none",
                                    marginRight: 10,
                                    flex: "0 0 auto",
                                }, children: _jsx("img", { src: LOGO_BY_ID["360"], alt: "Noxel360", loading: "eager", style: { width: "100%", height: "100%", objectFit: "contain" } }) }), _jsxs("div", { children: [_jsx("div", { className: "brand", children: "NOXEL360" }), _jsx("div", { className: "tag", children: t("dashboard.tagline") })] })] }), _jsxs("div", { className: "hdr-right", children: [_jsx(HeaderLanguage, {}), _jsx("span", { className: "tier", children: tier.toUpperCase() }), _jsx(UserMenu, {})] })] }), _jsx(TranslationStatusBanner, {}), _jsxs("div", { className: "noxel-body", children: [_jsxs("aside", { className: "noxel-sidenav", children: [_jsx("div", { className: "nav-group", "aria-label": "Modules", children: modules.map((m) => (_jsxs("button", { type: "button", className: `nav-item ${m.key === activeKey ? "is-active" : ""}`, onClick: () => openModule(m.key, m.route, m.external), children: [_jsxs("div", { className: "nav-row", children: [_jsx("div", { className: "nav-title", children: m.name }), _jsx("span", { className: `pill pill--${m.status === "ready" ? "live" : m.status}`, children: m.status === "ready" ? "LIVE" : m.status.toUpperCase() })] }), _jsx("div", { className: "nav-sub", children: m.promise })] }, m.key))) }), _jsx(Link, { className: "nav-cta", to: "/pricing", children: t("dashboard.sidenav.upgrade") })] }), _jsx("main", { className: "noxel-main", children: _jsxs("section", { className: "noxel-landing", "aria-label": t("dashboard.hero.modulesHeading"), children: [_jsxs("div", { className: "nx-bg-glow", "aria-hidden": "true", children: [_jsx("span", { className: "nx-glow nx-glow--green" }), _jsx("span", { className: "nx-glow nx-glow--purple" }), _jsx("span", { className: "nx-glow nx-glow--blue" })] }), _jsxs("div", { className: "nx-wrap", children: [_jsxs("header", { className: "nx-hero", children: [_jsxs("div", { className: "nx-hero__brand", children: [_jsxs("div", { className: "nx-logo", "aria-hidden": "true", children: [_jsx("img", { src: LOGO_BY_ID["360"], alt: "", loading: "lazy", className: "nx-logo__img" }), _jsx("span", { className: "nx-logo__color", "aria-hidden": "true" })] }), _jsxs("div", { className: "nx-hero__text", children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("h1", { className: "nx-title", children: t("dashboard.hero.title") }), _jsx("p", { className: "nx-subtitle", children: t("dashboard.hero.subtitle") }), _jsxs("div", { className: "nx-section-head", id: "modules", style: { marginTop: 18 }, children: [_jsx("h2", { className: "nx-h2", children: t("dashboard.hero.modulesHeading") }), _jsx("p", { className: "nx-lead", children: t("dashboard.hero.modulesLead") })] })] })] }), _jsxs("section", { "aria-label": "About NOXEL360", style: { maxWidth: 760, margin: "0 auto 32px", color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7 }, children: [_jsx("p", { children: "NOXEL360 is a modular platform built around three functional products." }), _jsxs("p", { children: [_jsx("strong", { style: { color: "#fff" }, children: "NOXEL SEO" }), " provides automated site audits, technical and content scoring, AI-powered fix suggestions, and search visibility tracking \u2014 including integration with Google Search Console for real impressions, clicks, and query data. It's built for solopreneurs and small teams who need enterprise-grade SEO tooling without the enterprise price tag."] }), _jsxs("p", { children: [_jsx("strong", { style: { color: "#fff" }, children: "NOXEL Forge" }), " is a verified backlink exchange network. Members submit real sites in exchange for reviewed, quality backlinks \u2014 every submission is screened by an AI reviewer against spam, thin content, and off-niche criteria before approval, keeping the network free of low-quality link farms."] }), _jsxs("p", { children: [_jsx("strong", { style: { color: "#fff" }, children: "NOXEL Nexus" }), " is the language and region intelligence engine underneath the ecosystem \u2014 detecting a visitor's language, region, and cultural context to adapt content and experience automatically across NOXEL360's products."] }), _jsx("p", { children: "Together, these three products form a connected toolkit: sign in once, and move between search optimization, link building, and localization without juggling separate accounts or tools." })] })] }), _jsx("div", { className: "nx-grid nx-grid--5", children: modules.map((m) => (_jsxs("article", { className: [
                                                    "nx-card",
                                                    m.key === "nexus" ? "nx-card--highlight" : "",
                                                    m.key === activeKey ? "nx-card--active" : "",
                                                ].join(" "), onClick: () => openModule(m.key, m.route, m.external), onKeyDown: (e) => onCardKeyDown(e, m.key, m.route, m.external), role: "button", tabIndex: 0, "aria-label": `${t("common.open")} ${m.name}`, children: [_jsxs("div", { className: "nx-card__top", children: [_jsx("img", { src: LOGO_BY_ID[m.key] || LOGO_BY_ID["360"], alt: "", style: { width: 40, height: 40, objectFit: "contain" }, loading: "lazy" }), _jsx("span", { className: [
                                                                    "nx-badge",
                                                                    m.status === "ready" ? "nx-badge--live" : "",
                                                                    m.status === "core" ? "nx-badge--core" : "",
                                                                ].join(" "), children: m.status === "ready" ? "LIVE" : m.status.toUpperCase() })] }), _jsx("h3", { className: "nx-card__title", children: m.name }), _jsx("p", { className: "nx-card__text", children: m.promise }), m.external ? (_jsxs("a", { className: "nx-card__link", href: m.route, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), children: [t("dashboard.card.open"), " \u2197"] })) : (_jsx(Link, { className: "nx-card__link", to: m.route, onClick: (e) => e.stopPropagation(), children: t("dashboard.card.open") }))] }, m.key))) })] })] }) })] })] }));
}
