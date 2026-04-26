import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { useI18n } from "../../useI18n";
/**
 * NOXEL360 — SideNav (Module Host)
 * Goal: visually identical to Dashboard sidenav (uses index.css classes).
 * Note: sub-options are intentionally placeholders for now.
 */
export function SideNav() {
    const items = useModulesIndex();
    const { t } = useI18n();
    return (_jsxs("nav", { style: { minHeight: 0, display: "flex", flexDirection: "column" }, children: [_jsx("div", { className: "nav-group", "aria-label": t("dashboard.modules"), children: items.map((m) => {
                    const badge = (m.status ?? "missing").toUpperCase();
                    const pillClass = badge === "READY"
                        ? "pill pill--live"
                        : badge === "CORE"
                            ? "pill pill--core"
                            : "pill pill--pro";
                    const pillLabel = badge === "READY"
                        ? "LIVE"
                        : badge === "CORE"
                            ? "CORE"
                            : "PRO";
                    return (_jsxs(NavLink, { to: m.route, className: ({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`, style: {
                            display: "block",
                            textDecoration: "none",
                        }, children: [_jsxs("div", { className: "nav-row", children: [_jsx("div", { className: "nav-title", children: t(m.nameKey) }), _jsx("span", { className: pillClass, children: pillLabel })] }), _jsx("div", { className: "nav-sub", children: m.promiseKey
                                    ? t(m.promiseKey)
                                    : t("modules.common.comingSoon") })] }, m.key));
                }) }), _jsx("button", { className: "nav-cta", style: { marginTop: 12 }, onClick: () => {
                    window.location.href = "/pricing/index.html";
                }, children: t("dashboard.sidenav.upgrade") })] }));
}
