import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import modulePricing from "../../../../module-pricing.json";
/**
 * Destination de chaque AppRoute de module-pricing.json.
 * NOXEL SEO vit sur son propre domaine ; Core et MAESTRO ont un équivalent
 * interne. Les modules sans destination affichent « bientôt disponible ».
 */
const EXTERNAL_BY_ID = {
    seo: "https://noxelseo.com",
    serp: "https://noxelseo.com",
    vitals: "https://noxelseo.com",
};
const INTERNAL_BY_ID = {
    core: "/dashboard",
    MAESTRO: "/app/account",
};
const normalize = (p) => p.replace(/\/+$/, "").toLowerCase();
function ExternalRedirect({ to }) {
    useEffect(() => {
        window.location.replace(to);
    }, [to]);
    return null;
}
export default function ModuleRoute() {
    const { pathname } = useLocation();
    const module = modulePricing.find((m) => normalize(m.AppRoute) === normalize(pathname));
    if (!module) {
        return _jsx("div", { style: { padding: 24 }, children: "404" });
    }
    const external = EXTERNAL_BY_ID[module.Id];
    if (external)
        return _jsx(ExternalRedirect, { to: external });
    const internal = INTERNAL_BY_ID[module.Id];
    if (internal)
        return _jsx(Navigate, { to: internal, replace: true });
    return (_jsxs("section", { style: { padding: 24, maxWidth: 640 }, children: [_jsx("p", { style: { color: "#A855F7", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", margin: 0 }, children: "Coming soon" }), _jsx("h1", { style: { margin: "8px 0 12px" }, children: module.Name }), _jsx("p", { style: { color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }, children: module.Subtitle }), _jsxs("div", { style: { display: "flex", gap: 16, marginTop: 24 }, children: [_jsx("a", { href: "/pricing/index.html#plans", style: { color: "#3ddc84" }, children: "See pricing" }), _jsx(Link, { to: "/dashboard", style: { color: "rgba(255,255,255,0.7)" }, children: "Back to dashboard" })] })] }));
}
