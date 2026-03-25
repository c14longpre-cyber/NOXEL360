import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import UserMenu from "@/components/UserMenu";
export default function DashboardHome() {
    const tier = "diamond";
    const nav = useNavigate();
    const modules = useMemo(() => [
        {
            key: "overview",
            name: "NOXEL360 Overview",
            short: "Choose only what you need. Plug modules when you're ready.",
            badge: "CORE",
            description: "NOXEL360 is a modular intelligence suite to build, audit, and evolve products and websites. Each module is standalone, but they connect cleanly when you want deeper insights.",
            bullets: [
                "Modular by design (start small, scale fast)",
                "One identity system across tools",
                "Data flows between modules when enabled",
            ],
            href: "#modules",
            ico: "360",
            highlight: true,
        },
        {
            key: "seo",
            name: "NOXEL SEO",
            short: "Audit + fixes + scoring",
            badge: "LIVE",
            description: "Complete audits in one cockpit: score, issues, fixes, impact tracking.",
            bullets: ["Fast scans + actionable insights", "Category scoring", "Export-ready reports"],
            href: "/app/seo",
            ico: "SEO",
        },
        {
            key: "atlas",
            name: "NOXEL ATLAS",
            short: "Map & audience intelligence",
            badge: "PRO",
            description: "Smart geo layers to compare markets and spot opportunities visually.",
            bullets: ["Multi-level zoom", "Overlay comparisons", "Local SEO + audience reading"],
            href: "/app/atlas",
            ico: "AT",
        },
        {
            key: "links",
            name: "NOXEL LINKS",
            short: "Link hygiene & structure",
            badge: "PRO",
            description: "Smart link diagnostics to clean, protect, and strengthen SEO.",
            bullets: ["Broken links & redirects", "Internal structure", "Simple, actionable reports"],
            href: "/app/links",
            ico: "LK",
        },
        {
            key: "maestro",
            name: "NOXEL MAESTRO",
            short: "The unifying core",
            badge: "CORE",
            description: "A unified core that syncs everything and makes modules frictionless.",
            bullets: ["Identity & preferences", "Connectors & normalization", "Base for Morph & Atlas"],
            href: "/app/maestro",
            ico: "MA",
            highlight: true,
        },
        {
            key: "morph",
            name: "NOXEL MORPH™",
            short: "Adaptive UX theming",
            badge: "PRO",
            description: "User-driven visual changes applied cleanly, with zero design breakage.",
            bullets: ["Consent + simple reset", "Flow-ready adaptive themes", "Tailored experience"],
            href: "/app/morph",
            ico: "MX",
        },
        {
            key: "flow",
            name: "NOXEL FLOW",
            short: "Themes & components distribution",
            badge: "PRO",
            description: "Ready themes and components—Simplexity first, Morph plugs in later.",
            bullets: ["Modular themes", "Consistent parameters", "Ecosystem-ready"],
            href: "/app/flow",
            ico: "FL",
        },
        {
            key: "optima",
            name: "NOXEL OPTIMA",
            short: "Convert + optimize",
            badge: "PRO",
            description: "Smart image conversion and cleanup—simple, efficient, profitable for all clients.",
            bullets: ["Smart compression", "Quality control", "Bronze → Diamond plans"],
            href: "/app/optima",
            ico: "IMG",
        },
        {
            key: "analytics",
            name: "NOXEL ANALYTICS",
            short: "Insights & reports",
            badge: "PRO",
            description: "All performance signals unified—visual, actionable, cockpit-level clarity.",
            bullets: ["KPIs & reports", "Segments & insights", "Foundation for Audience Intelligence"],
            href: "/app/analytics",
            ico: "AN",
        },
        {
            key: "social",
            name: "NOXEL SOCIAL",
            short: "Content + planning",
            badge: "PRO",
            description: "Plan, align, and amplify content with steady, on-brand execution.",
            bullets: ["Calendar & templates", "Impact analysis", "Brand guidelines"],
            href: "/app/social",
            ico: "SO",
        },
        {
            key: "crm",
            name: "NOXEL CRM",
            short: "Client + admin CRM",
            badge: "PRO",
            description: "Two-sided CRM delivering follow-up, automation, and a premium experience.",
            bullets: ["Pipeline & tickets", "Automations", "Client portal"],
            href: "/app/crm",
            ico: "CRM",
        },
    ], []);
    const [activeKey, setActiveKey] = useState("overview");
    const onCardKeyDown = (e, key) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const m = modules.find((x) => x.key === key);
            if (m)
                nav(m.href);
        }
    };
    return (_jsxs("div", { className: "noxel-app", "data-tier": tier, children: [_jsxs("header", { className: "noxel-header", children: [_jsxs("div", { className: "hdr-left", children: [_jsx(Link, { to: "/dashboard", style: {
                                    display: "inline-flex",
                                    width: 200,
                                    height: 200,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textDecoration: "none",
                                    marginRight: 10,
                                }, "aria-label": "Go to dashboard", children: _jsx("img", { src: LOGO_BY_ID["360"], alt: "Noxel360", loading: "eager", style: { width: "100%", height: "100%", objectFit: "contain" } }) }), _jsxs("div", { children: [_jsx("div", { className: "brand", children: "NOXEL360" }), _jsx("div", { className: "tag", children: "Unified Intelligence Dashboard" })] })] }), _jsxs("div", { className: "hdr-right", children: [_jsx("span", { className: "tier", children: tier.toUpperCase() }), _jsx(UserMenu, {})] })] }), _jsxs("div", { className: "noxel-body", children: [_jsxs("aside", { className: "noxel-sidenav", children: [_jsx("div", { className: "nav-group", children: modules
                                    .filter((m) => m.key !== "overview")
                                    .map((m) => (_jsxs("button", { type: "button", className: `nav-item ${m.key === activeKey ? "is-active" : ""}`, onClick: () => {
                                        setActiveKey(m.key);
                                        nav(m.href);
                                    }, children: [_jsxs("div", { className: "nav-row", children: [_jsx("div", { className: "nav-title", children: m.name }), _jsx("span", { className: `pill pill--${m.badge.toLowerCase()}`, children: m.badge })] }), _jsx("div", { className: "nav-sub", children: m.short })] }, m.key))) }), _jsx(Link, { className: "nav-cta", to: "/pricing", children: "Upgrade & Pricing" })] }), _jsx("main", { className: "noxel-main", children: _jsxs("section", { className: "noxel-landing", "aria-label": "Noxel360 Modules", children: [_jsxs("div", { className: "nx-bg-glow", "aria-hidden": "true", children: [_jsx("span", { className: "nx-glow nx-glow--green" }), _jsx("span", { className: "nx-glow nx-glow--purple" }), _jsx("span", { className: "nx-glow nx-glow--blue" })] }), _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "nx-hero__brand", children: [_jsxs("div", { className: "nx-logo", "aria-hidden": "true", children: [_jsx("img", { src: LOGO_BY_ID["360"], alt: "", loading: "lazy", className: "nx-logo__img" }), _jsx("span", { className: "nx-logo__color", "aria-hidden": "true" })] }), _jsxs("div", { className: "nx-hero__text", children: [_jsx("div", { className: "nx-kicker", style: { paddingLeft: 60 } }), _jsx("h1", { className: "nx-title", style: { paddingLeft: 60 }, children: "The modular suite to build, audit, and evolve your products." }), "Each module stands alone, but they share one identity, one cockpit, and one growth logic. Enable only what you need \u2014 then plug the rest when you're ready.", _jsx("p", {}), _jsxs("div", { className: "nx-section-head", id: "modules", style: { paddingLeft: 60, marginTop: 18 }, children: [_jsx("h2", { className: "nx-h2", children: "NOXEL MODULES" }), _jsx("p", { className: "nx-lead", children: "Specialized tools designed to ship one-by-one \u2014 then plug into NOXEL360 without refactors." })] })] })] }) }), _jsx("div", { className: "nx-grid nx-grid--5", children: modules
                                                .filter((m) => m.key !== "overview")
                                                .map((m) => (_jsxs("article", { className: [
                                                    "nx-card",
                                                    m.highlight ? "nx-card--highlight" : "",
                                                    m.key === activeKey ? "nx-card--active" : "",
                                                ].join(" "), onClick: () => {
                                                    setActiveKey(m.key);
                                                    nav(m.href);
                                                }, onKeyDown: (e) => onCardKeyDown(e, m.key), role: "button", tabIndex: 0, "aria-label": `Open ${m.name}`, children: [_jsxs("div", { className: "nx-card__top", children: [_jsx("div", { className: "nx-ico", children: m.ico }), _jsx("span", { className: [
                                                                    "nx-badge",
                                                                    m.badge === "LIVE" ? "nx-badge--live" : "",
                                                                    m.badge === "CORE" ? "nx-badge--core" : "",
                                                                ].join(" "), children: m.badge })] }), _jsx("h3", { className: "nx-card__title", children: m.name }), _jsx("p", { className: "nx-card__text", children: m.description }), _jsx("ul", { className: "nx-card__list", children: m.bullets.slice(0, 3).map((b) => (_jsx("li", { children: b }, b))) }), _jsx(Link, { className: "nx-card__link", to: m.href, onClick: (e) => e.stopPropagation(), children: "Open module \u2192" })] }, m.key))) })] })] }) })] })] }));
}
