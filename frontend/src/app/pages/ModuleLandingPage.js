import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import modulesIndex from "../../modules/index.json";
import { landingRegistry } from "./landingRegistry";
import { LOGO_BY_ID } from "@/app/modules/logos";
export function ModuleLandingPage() {
    const { moduleId } = useParams();
    const loc = useLocation();
    const moduleItem = useMemo(() => {
        const key = String(moduleId ?? "").toLowerCase().trim();
        const path = String(loc.pathname ?? "").toLowerCase().trim();
        const list = modulesIndex?.modules;
        if (!Array.isArray(list))
            return null;
        return (list.find((x) => {
            const k = String(x?.key ?? "").toLowerCase().trim();
            const r = String(x?.route ?? "").toLowerCase().trim();
            return (key && k === key) || (r && r === path);
        }) ?? null);
    }, [moduleId, loc.pathname]);
    if (!moduleItem)
        return _jsx("div", { style: { padding: 24 }, children: "Module not found." });
    const moduleKey = String(moduleItem.key ?? moduleId ?? "").toLowerCase().trim();
    const md = landingRegistry[moduleKey] ?? "";
    // ✅ Option B: logos live in src/assets and are imported via LOGO_BY_ID
    const logoSrc = LOGO_BY_ID[moduleKey] || LOGO_BY_ID["360"] || "";
    return (_jsxs("div", { style: { padding: 2, maxWidth: 980 }, children: [_jsxs("header", { style: { marginBottom: 14 }, children: [_jsx("div", { style: { marginBottom: 14 }, children: _jsx("img", { src: logoSrc, alt: moduleItem.name, className: "module-landing-logo", loading: "lazy" }) }), _jsx("h1", { children: moduleItem.name }), moduleItem.promise && (_jsx("p", { style: { marginTop: 12, opacity: 0.85 }, children: moduleItem.promise }))] }), _jsx("section", { style: { marginBottom: 24 }, children: _jsx("pre", { style: { whiteSpace: "pre-wrap", lineHeight: 1.5 }, children: md || "Landing content missing." }) }), _jsxs("section", { "aria-label": "Module Space", children: [_jsx("h2", { style: { marginTop: 0 }, children: "Module Space" }), _jsx("div", { style: {
                            padding: 16,
                            borderRadius: 12,
                            border: "1px dashed currentColor",
                        }, children: _jsxs("p", { style: { margin: 0 }, children: ["The ", _jsx("strong", { children: moduleItem.name }), " module will be activated here."] }) })] })] }));
}
