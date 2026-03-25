import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "./app/host/AppShell";
import { ModuleLandingPage } from "./app/pages/ModuleLandingPage";
import DashboardHome from "./app/pages/DashboardHome";
import AccountPage from "./app/pages/AccountPage";
import LinkAccountPage from "./auth/LinkAccountPage";
import OAuthCallbackPage from "./auth/OAuthCallbackPage";
function PricingRedirect() {
    useEffect(() => {
        window.location.assign("/pricing/index.html");
    }, []);
    return null;
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardHome, {}) }), _jsx(Route, { path: "/auth/link-account", element: _jsx(LinkAccountPage, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(OAuthCallbackPage, {}) }), _jsxs(Route, { path: "/app", element: _jsx(AppShell, {}), children: [_jsx(Route, { path: "account", element: _jsx(AccountPage, {}) }), _jsx(Route, { path: ":moduleId", element: _jsx(ModuleLandingPage, {}) })] }), _jsx(Route, { path: "/pricing", element: _jsx(PricingRedirect, {}) }), _jsx(Route, { path: "/pricing/*", element: _jsx(PricingRedirect, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { style: { padding: 24 }, children: "404" }) })] }));
}
