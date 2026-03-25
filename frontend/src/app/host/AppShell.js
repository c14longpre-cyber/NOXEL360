import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { SideNav } from "./SideNav";
import noxel360Logo from "@/assets/logos/webp/noxel-360.webp";
import UserMenu from "@/components/UserMenu";
/**
 * NOXEL360 — Module Host (AppShell)
 * Goal: keep ALL /app/* pages visually consistent with Dashboard tokens (index.css).
 * - Uses global classes: noxel-app / noxel-header / noxel-body / noxel-sidenav / noxel-main
 */
export function AppShell() {
    const tier = "diamond";
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";
    return (_jsxs("div", { className: "noxel-app", "data-tier": tier, children: [_jsxs("header", { className: "noxel-header", children: [_jsxs("div", { className: "hdr-left", children: [_jsx(Link, { to: "/dashboard", "aria-label": "Return to dashboard", style: {
                                    display: "inline-flex",
                                    width: 200,
                                    height: 200,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textDecoration: "none",
                                    marginRight: 10,
                                }, children: _jsx("img", { src: noxel360Logo, alt: "Noxel360", loading: "eager", style: { width: "100%", height: "100%", objectFit: "contain" } }) }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [_jsx("div", { className: "brand", children: "NOXEL360" }), _jsx("div", { className: "tag", children: "Module Host" }), !isDashboard && (_jsx("button", { className: "nav-cta", style: { marginTop: 8, width: "fit-content", padding: "8px 16px" }, onClick: () => navigate(-1), type: "button", children: "\u2190 Previous page" }))] })] }), _jsxs("div", { className: "hdr-right", children: [_jsx("span", { className: "tier", children: tier.toUpperCase() }), _jsx(UserMenu, {})] })] }), _jsxs("div", { className: "noxel-body", children: [_jsx("aside", { className: "noxel-sidenav", children: _jsx("div", { style: { minHeight: 0 }, children: _jsx(SideNav, {}) }) }), _jsx("main", { className: "noxel-main", children: _jsx("section", { className: "noxel-landing", "aria-label": "Module content", children: _jsx(Outlet, {}) }) })] })] }));
}
