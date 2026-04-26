import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useModulesIndex } from "../modules/useModulesIndex";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
import { useI18n } from "@/useI18n";
function toBadge(status) {
    const value = (status || "").toLowerCase();
    if (value === "ready")
        return "LIVE";
    if (value === "core")
        return "CORE";
    return "PRO";
}
export default function DashboardHome() {
    const tier = "diamond";
    const nav = useNavigate();
    const indexItems = useModulesIndex();
    const { t } = useI18n();
    const modules = useMemo(() => {
        const bulletKeysByModule = {
            analytics: [
                "dashboard.module.analytics.bullet1",
                "dashboard.module.analytics.bullet2",
                "dashboard.module.analytics.bullet3",
            ],
            atlas: [
                "dashboard.module.atlas.bullet1",
                "dashboard.module.atlas.bullet2",
                "dashboard.module.atlas.bullet3",
            ],
            crm: [
                "dashboard.module.crm.bullet1",
                "dashboard.module.crm.bullet2",
                "dashboard.module.crm.bullet3",
            ],
            flow: [
                "dashboard.module.flow.bullet1",
                "dashboard.module.flow.bullet2",
                "dashboard.module.flow.bullet3",
            ],
            links: [
                "dashboard.module.links.bullet1",
                "dashboard.module.links.bullet2",
                "dashboard.module.links.bullet3",
            ],
            maestro: [
                "dashboard.module.maestro.bullet1",
                "dashboard.module.maestro.bullet2",
                "dashboard.module.maestro.bullet3",
            ],
            morph: [
                "dashboard.module.morph.bullet1",
                "dashboard.module.morph.bullet2",
                "dashboard.module.morph.bullet3",
            ],
            nexus: [
                "dashboard.module.nexus.bullet1",
                "dashboard.module.nexus.bullet2",
                "dashboard.module.nexus.bullet3",
            ],
            optima: [
                "dashboard.module.optima.bullet1",
                "dashboard.module.optima.bullet2",
                "dashboard.module.optima.bullet3",
            ],
            seo: [
                "dashboard.module.seo.bullet1",
                "dashboard.module.seo.bullet2",
                "dashboard.module.seo.bullet3",
            ],
            social: [
                "dashboard.module.social.bullet1",
                "dashboard.module.social.bullet2",
                "dashboard.module.social.bullet3",
            ],
        };
        const descriptionKeyByModule = {
            analytics: "dashboard.module.analytics.description",
            atlas: "dashboard.module.atlas.description",
            crm: "dashboard.module.crm.description",
            flow: "dashboard.module.flow.description",
            links: "dashboard.module.links.description",
            maestro: "dashboard.module.maestro.description",
            morph: "dashboard.module.morph.description",
            nexus: "dashboard.module.nexus.description",
            optima: "dashboard.module.optima.description",
            seo: "dashboard.module.seo.description",
            social: "dashboard.module.social.description",
        };
        const iconByKey = {
            analytics: "AN",
            atlas: "AT",
            crm: "CRM",
            flow: "FL",
            links: "LK",
            maestro: "MA",
            morph: "MX",
            nexus: "NX",
            optima: "IMG",
            seo: "SEO",
            social: "SO",
        };
        return indexItems.map((item) => {
            const badge = toBadge(item.status);
            const bulletKeys = bulletKeysByModule[item.key] ?? [
                "dashboard.module.common.bullet1",
                "dashboard.module.common.bullet2",
                "dashboard.module.common.bullet3",
            ];
            return {
                key: item.key,
                name: t(item.nameKey),
                short: t(item.promiseKey),
                badge,
                description: t(descriptionKeyByModule[item.key] ?? "modules.common.comingSoon"),
                bullets: bulletKeys.map((key) => t(key)),
                href: item.route,
                ico: iconByKey[item.key] || item.key.slice(0, 2).toUpperCase(),
                highlight: item.key === "maestro" || item.key === "nexus",
            };
        });
    }, [indexItems, t]);
    const [activeKey, setActiveKey] = useState("nexus");
    const onCardKeyDown = (e, key) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const m = modules.find((x) => x.key === key);
            if (!m)
                return;
            setActiveKey(key);
            nav(m.href);
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
                                }, children: _jsx("img", { src: LOGO_BY_ID["360"], alt: "Noxel360", loading: "eager", style: { width: "100%", height: "100%", objectFit: "contain" } }) }), _jsxs("div", { children: [_jsx("div", { className: "brand", children: "NOXEL360" }), _jsx("div", { className: "tag", children: t("dashboard.tagline") })] })] }), _jsxs("div", { className: "hdr-right", children: [_jsx(HeaderLanguage, {}), _jsx("span", { className: "tier", children: tier.toUpperCase() }), _jsx(UserMenu, {})] })] }), _jsx(TranslationStatusBanner, {}), _jsxs("div", { className: "noxel-body", children: [_jsxs("aside", { className: "noxel-sidenav", children: [_jsx("div", { className: "nav-group", "aria-label": t("dashboard.modules"), children: modules.map((m) => (_jsxs("button", { type: "button", className: `nav-item ${m.key === activeKey ? "is-active" : ""}`, onClick: () => {
                                        setActiveKey(m.key);
                                        nav(m.href);
                                    }, children: [_jsxs("div", { className: "nav-row", children: [_jsx("div", { className: "nav-title", children: m.name }), _jsx("span", { className: `pill pill--${m.badge.toLowerCase()}`, children: m.badge })] }), _jsx("div", { className: "nav-sub", children: m.short })] }, m.key))) }), _jsx(Link, { className: "nav-cta", to: "/pricing", children: t("dashboard.sidenav.upgrade") })] }), _jsx("main", { className: "noxel-main", children: _jsxs("section", { className: "noxel-landing", "aria-label": t("dashboard.hero.modulesHeading"), children: [_jsxs("div", { className: "nx-bg-glow", "aria-hidden": "true", children: [_jsx("span", { className: "nx-glow nx-glow--green" }), _jsx("span", { className: "nx-glow nx-glow--purple" }), _jsx("span", { className: "nx-glow nx-glow--blue" })] }), _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "nx-hero__brand", children: [_jsxs("div", { className: "nx-logo", "aria-hidden": "true", children: [_jsx("img", { src: LOGO_BY_ID["360"], alt: "", loading: "lazy", className: "nx-logo__img" }), _jsx("span", { className: "nx-logo__color", "aria-hidden": "true" })] }), _jsxs("div", { className: "nx-hero__text", children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("h1", { className: "nx-title", children: t("dashboard.hero.title") }), _jsx("p", { className: "nx-subtitle", children: t("dashboard.hero.subtitle") }), _jsxs("div", { className: "nx-section-head", id: "modules", style: { marginTop: 18 }, children: [_jsx("h2", { className: "nx-h2", children: t("dashboard.hero.modulesHeading") }), _jsx("p", { className: "nx-lead", children: t("dashboard.hero.modulesLead") })] })] })] }) }), _jsx("div", { className: "nx-grid nx-grid--5", children: modules.map((m) => (_jsxs("article", { className: [
                                                    "nx-card",
                                                    m.highlight ? "nx-card--highlight" : "",
                                                    m.key === activeKey ? "nx-card--active" : "",
                                                ].join(" "), onClick: () => {
                                                    setActiveKey(m.key);
                                                    nav(m.href);
                                                }, onKeyDown: (e) => onCardKeyDown(e, m.key), role: "button", tabIndex: 0, "aria-label": `${t("common.open")} ${m.name}`, children: [_jsxs("div", { className: "nx-card__top", children: [_jsx("div", { className: "nx-ico", children: m.ico }), _jsx("span", { className: [
                                                                    "nx-badge",
                                                                    m.badge === "LIVE" ? "nx-badge--live" : "",
                                                                    m.badge === "CORE" ? "nx-badge--core" : "",
                                                                ].join(" "), children: m.badge })] }), _jsx("h3", { className: "nx-card__title", children: m.name }), _jsx("p", { className: "nx-card__text", children: m.description }), _jsx("ul", { className: "nx-card__list", children: m.bullets.slice(0, 3).map((b) => (_jsx("li", { children: b }, b))) }), _jsx(Link, { className: "nx-card__link", to: m.href, onClick: (e) => e.stopPropagation(), children: t("dashboard.card.open") })] }, m.key))) })] })] }) })] })] }));
}
