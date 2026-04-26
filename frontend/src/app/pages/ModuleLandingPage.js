import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useI18n } from "@/useI18n";
function getSectionKind(title) {
    const t = title.toLowerCase();
    if (t.includes("module capabilities"))
        return "capabilities";
    if (t.includes("connections"))
        return "connections";
    if (t.includes("module space") || t.includes("reserved"))
        return "reserved";
    return "standard";
}
function parseLandingMarkdown(md) {
    const raw = String(md || "").replace(/\r/g, "");
    const lines = raw.split("\n");
    let heroTitle = "";
    let heroText = "";
    const sections = [];
    let currentTitle = "";
    let currentBody = [];
    const flush = () => {
        if (!currentTitle && currentBody.length === 0)
            return;
        sections.push({
            title: currentTitle || "Overview",
            body: [...currentBody],
            kind: getSectionKind(currentTitle || "Overview"),
        });
        currentTitle = "";
        currentBody = [];
    };
    for (const originalLine of lines) {
        const line = originalLine.trim();
        if (!line)
            continue;
        if (line.startsWith("# ")) {
            heroTitle = line.replace(/^#\s+/, "").trim();
            continue;
        }
        if (line.startsWith("**Promise:**")) {
            heroText = line.replace(/^\*\*Promise:\*\*\s*/, "").trim();
            continue;
        }
        if (line.startsWith("## ")) {
            flush();
            currentTitle = line.replace(/^##\s+/, "").trim();
            continue;
        }
        if (line.startsWith("### ")) {
            currentBody.push(line.replace(/^###\s+/, "").trim());
            continue;
        }
        currentBody.push(line);
    }
    flush();
    if (!heroTitle)
        heroTitle = "NOXEL Module";
    if (!heroText)
        heroText = "Landing scaffold (details coming soon).";
    return { heroTitle, heroText, sections };
}
function normalizeBodyLine(line) {
    return line
        .replace(/^\-\s+/, "• ")
        .replace(/^\d+\.\s+/, "• ")
        .replace(/^>\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
}
function formatSectionTitle(title) {
    return title.replace(/^\d+\)\s*/, "").trim();
}
export function ModuleLandingPage() {
    const { moduleId } = useParams();
    const loc = useLocation();
    const modules = useModulesIndex();
    const { t } = useI18n();
    const moduleItem = useMemo(() => {
        const key = String(moduleId ?? "").toLowerCase().trim();
        const path = String(loc.pathname ?? "").toLowerCase().trim();
        return (modules.find((x) => {
            const k = String(x.key ?? "").toLowerCase().trim();
            const r = String(x.route ?? "").toLowerCase().trim();
            return (key && k === key) || (r && r === path);
        }) ?? null);
    }, [moduleId, loc.pathname, modules]);
    if (!moduleItem) {
        return (_jsx("div", { className: "nx-landing-page", children: _jsx("div", { className: "nx-landing-hero", children: _jsxs("div", { className: "nx-landing-hero__content", children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("h1", { className: "nx-landing-title", children: t("module.notFound") }), _jsx("p", { className: "nx-landing-lead", children: t("module.notFound.subtitle") })] }) }) }));
    }
    const moduleKey = String(moduleItem.key ?? moduleId ?? "").toLowerCase().trim();
    const md = landingRegistry[moduleKey] ?? "";
    const logoSrc = LOGO_BY_ID[moduleKey] || LOGO_BY_ID["360"] || "";
    const parsed = useMemo(() => parseLandingMarkdown(md), [md]);
    return (_jsxs("div", { className: "nx-landing-page", children: [_jsxs("header", { className: "nx-landing-hero", children: [_jsx("div", { className: "nx-landing-hero__media", children: _jsx("img", { src: logoSrc, alt: moduleItem.name, className: "module-landing-logo", loading: "lazy" }) }), _jsxs("div", { className: "nx-landing-hero__content", children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("h1", { className: "nx-landing-title", children: parsed.heroTitle || moduleItem.name }), _jsx("p", { className: "nx-landing-lead", children: moduleItem.promise ||
                                    parsed.heroText ||
                                    t("module.landing.scaffold") }), _jsxs("div", { className: "nx-landing-meta", children: [_jsx("span", { className: "nx-pill nx-pill--intel", children: moduleItem.key.toUpperCase() }), _jsx("span", { className: "nx-pill", children: moduleItem.status.toUpperCase() })] })] })] }), _jsx("section", { className: "nx-landing-grid", "aria-label": "Module overview", children: parsed.sections.map((section, index) => {
                    const cardClass = [
                        "nx-landing-card",
                        section.kind === "capabilities" ? "nx-landing-card--capabilities" : "",
                        section.kind === "reserved" ? "nx-landing-card--wide" : "",
                    ]
                        .filter(Boolean)
                        .join(" ");
                    return (_jsxs("article", { className: cardClass, children: [_jsx("h2", { className: "nx-landing-card__title", children: formatSectionTitle(section.title) }), _jsx("div", { className: "nx-landing-card__body", children: section.body.map((line, lineIndex) => {
                                    const clean = normalizeBodyLine(line);
                                    if (!clean)
                                        return null;
                                    const isBullet = clean.startsWith("• ");
                                    const isSubheading = !isBullet &&
                                        !clean.endsWith(".") &&
                                        clean.length < 60 &&
                                        !clean.includes(":");
                                    if (isSubheading) {
                                        return (_jsx("div", { className: "nx-landing-minihead", children: clean }, lineIndex));
                                    }
                                    if (isBullet) {
                                        return (_jsx("div", { className: "nx-landing-bullet", children: clean }, lineIndex));
                                    }
                                    return (_jsx("p", { className: "nx-landing-paragraph", children: clean }, lineIndex));
                                }) })] }, `${section.title}-${index}`));
                }) })] }));
}
