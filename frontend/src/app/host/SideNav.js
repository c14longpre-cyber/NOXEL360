import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
/**
 * NOXEL360 — SideNav (Module Host)
 * External modules (NOXEL SEO, NOXEL Forge) open their real domain in a new
 * tab. Internal modules (NOXEL Nexus) use React Router navigation.
 */
export function SideNav() {
    const items = useModulesIndex();
    return (_jsxs("nav", { style: { minHeight: 0, display: "flex", flexDirection: "column" }, children: [_jsx("div", { className: "nav-group", "aria-label": "Modules", children: items.map((m) => {
                    const badge = (m.status ?? "missing").toUpperCase();
                    const pillClass = badge === "READY"
                        ? "pill pill--live"
                        : badge === "CORE"
                            ? "pill pill--core"
                            : "pill pill--pro";
                    const pillLabel = badge === "READY" ? "LIVE" : badge === "CORE" ? "CORE" : "PRO";
                    const content = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "nav-row", children: [_jsx("div", { className: "nav-title", children: m.name }), _jsx("span", { className: pillClass, children: pillLabel })] }), _jsx("div", { className: "nav-sub", children: m.promise })] }));
                    if (m.external) {
                        return (_jsx("a", { href: m.route, target: "_blank", rel: "noopener noreferrer", className: "nav-item", style: { display: "block", textDecoration: "none" }, children: content }, m.key));
                    }
                    return (_jsx(NavLink, { to: m.route, className: ({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`, style: { display: "block", textDecoration: "none" }, children: content }, m.key));
                }) }), _jsx("button", { className: "nav-cta", style: { marginTop: 12 }, onClick: () => {
                    window.location.href = "/pricing/index.html";
                }, children: "Upgrade" })] }));
}
