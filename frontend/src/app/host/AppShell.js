import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { SideNav } from "./SideNav";
import NoxelTopbar from "@/components/NoxelTopbar";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
/**
 * NOXEL360 — Module Host (AppShell)
 * Keeps all /app/* pages visually aligned with dashboard tokens.
 */
export function AppShell() {
    const tier = "diamond";
    return (_jsxs("div", { className: "noxel-app", "data-tier": tier, children: [_jsx(NoxelTopbar, {}), _jsx(TranslationStatusBanner, {}), _jsxs("div", { className: "noxel-body", children: [_jsx("aside", { className: "noxel-sidenav", children: _jsx("div", { style: {
                                minHeight: 0,
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                            }, children: _jsx(SideNav, {}) }) }), _jsx("main", { className: "noxel-main", children: _jsx("section", { className: "noxel-landing", "aria-label": "Module content", style: { minHeight: "100%", width: "100%" }, children: _jsx(Outlet, {}) }) })] })] }));
}
