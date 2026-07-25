import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuthStore } from "./auth/AuthStore";

// Route-level code splitting: each page's JS is only downloaded and executed
// when that route is actually visited, instead of all bundled into the main
// chunk that has to run before the page becomes interactive. This directly
// reduces Total Blocking Time on first load.
const AppShell = lazy(() =>
  import("./app/host/AppShell").then((m) => ({ default: m.AppShell }))
);
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
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

// Minimal, dependency-free loading fallback — intentionally simple so it
// doesn't itself add to the JS that has to run before something is visible.
function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07090a",
        color: "rgba(255,255,255,0.4)",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<RootRoute />} />

        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/nexus" element={<NexusPage />} />

        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth/link-account" element={<LinkAccountPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* NOXEL SEO and NOXEL Forge are external products (noxelseo.com,
            noxelforge.com) — see DashboardHome / SideNav for outbound links.
            No internal /app/* routes needed for them anymore. */}

        <Route path="/pricing" element={<PricingRedirect />} />
        <Route path="/pricing/*" element={<PricingRedirect />} />
        <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      </Routes>
    </Suspense>
  );
}
