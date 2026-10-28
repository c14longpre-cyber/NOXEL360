import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuthStore } from "./auth/AuthStore";
// Route-level code splitting: each page's JS is only downloaded and executed
// when that route is actually visited, instead of all bundled into the main
// chunk that has to run before the page becomes interactive. This directly
// reduces Total Blocking Time on first load.
const AppShell = lazy(() => import("./app/host/AppShell").then((m) => ({ default: m.AppShell })));
const DashboardHome = lazy(() => import("./app/pages/DashboardHome"));
const AccountPage = lazy(() => import("./app/pages/AccountPage"));
const LinkAccountPage = lazy(() => import("./auth/LinkAccountPage"));
const OAuthCallbackPage = lazy(() => import("./auth/OAuthCallbackPage"));
const PrivacyPage = lazy(() => import("./legal/PrivacyPage"));
const TermsPage = lazy(() => import("./legal/TermsPage"));
const NexusPage = lazy(() => import("./pages/NexusPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
function PricingRedirect() {
    useEffect(() => {
        window.location.assign("/pricing/index.html");
    }, []);
    return null;
}
function RootRoute() {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? _jsx(Navigate, { to: "/dashboard", replace: true }) : _jsx(LandingPage, {});
}
// Minimal, dependency-free loading fallback — intentionally simple so it
// doesn't itself add to the JS that has to run before something is visible.
function RouteLoadingFallback() {
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#07090a",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
        }, children: "Loading\u2026" }));
}
export default function App() {
    return (_jsx(Suspense, { fallback: _jsx(RouteLoadingFallback, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(RootRoute, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardHome, {}) }), _jsx(Route, { path: "/nexus", element: _jsx(NexusPage, {}) }), _jsxs(Route, { path: "/app", element: _jsx(AppShell, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "account", element: _jsx(AccountPage, {}) })] }), _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPage, {}) }), _jsx(Route, { path: "/terms", element: _jsx(TermsPage, {}) }), _jsx(Route, { path: "/auth/link-account", element: _jsx(LinkAccountPage, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(OAuthCallbackPage, {}) }), _jsx(Route, { path: "/pricing", element: _jsx(PricingRedirect, {}) }), _jsx(Route, { path: "/pricing/*", element: _jsx(PricingRedirect, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { style: { padding: 24 }, children: "404" }) })] }) }));
}
