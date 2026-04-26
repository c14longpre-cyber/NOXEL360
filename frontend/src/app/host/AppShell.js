import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { SideNav } from "./SideNav";
import noxel360Logo from "@/assets/logos/webp/noxel-360.webp";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
import { useI18n } from "@/useI18n";
/**
 * NOXEL360 — Module Host (AppShell)
 * Keeps all /app/* pages visually aligned with dashboard tokens.
 */
export function AppShell() {
    const tier = "diamond";
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useI18n();
    const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";
    return (_jsxs("div", { className: "noxel-app", "data-tier": tier, children: [_jsxs("header", { className: "noxel-header", style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                }, children: [_jsxs("div", { className: "hdr-left", style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            minWidth: 0,
                            flex: 1,
                        }, children: [_jsx(Link, { to: "/dashboard", "aria-label": "Return to dashboard", style: {
                                    display: "inline-flex",
                                    width: 120,
                                    height: 120,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textDecoration: "none",
                                    flex: "0 0 auto",
                                }, children: _jsx("img", { src: noxel360Logo, alt: "Noxel360", loading: "eager", style: {
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    } }) }), _jsxs("div", { style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    minWidth: 0,
                                }, children: [_jsx("div", { className: "brand", children: "NOXEL360" }), _jsx("div", { className: "tag", children: t("module.host.title") }), !isDashboard && (_jsx("button", { className: "nav-cta", style: {
                                            marginTop: 8,
                                            width: "fit-content",
                                            padding: "8px 16px",
                                        }, onClick: () => navigate(-1), type: "button", children: t("module.host.previous") }))] })] }), _jsxs("div", { className: "hdr-right", style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            flex: "0 0 auto",
                            position: "relative",
                            zIndex: 20,
                        }, children: [_jsx(HeaderLanguage, {}), _jsx("span", { className: "tier", children: tier.toUpperCase() }), _jsx(UserMenu, {})] })] }), _jsx(TranslationStatusBanner, {}), _jsxs("div", { className: "noxel-body", children: [_jsx("aside", { className: "noxel-sidenav", children: _jsx("div", { style: {
                                minHeight: 0,
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                            }, children: _jsx(SideNav, {}) }) }), _jsx("main", { className: "noxel-main", children: _jsx("section", { className: "noxel-landing", "aria-label": "Module content", style: { minHeight: "100%", width: "100%" }, children: _jsx(Outlet, {}) }) })] })] }));
}
