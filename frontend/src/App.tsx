import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "./app/host/AppShell";
import { ModuleLandingPage } from "./app/pages/ModuleLandingPage";
import DashboardHome from "./app/pages/DashboardHome";
import AccountPage from "./app/pages/AccountPage";
import LinkAccountPage from "./auth/LinkAccountPage";
import OAuthCallbackPage from "./auth/OAuthCallbackPage";
import PrivacyPage from "./legal/PrivacyPage";
import TermsPage from "./legal/TermsPage";
import NexusPage from "./pages/NexusPage";

function PricingRedirect() {
  useEffect(() => {
    window.location.assign("/pricing/index.html");
  }, []);

  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardHome />} />

      <Route path="/nexus" element={<NexusPage />} />

      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      <Route path="/auth/link-account" element={<LinkAccountPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />

      <Route path="/app" element={<AppShell />}>
        <Route path="account" element={<AccountPage />} />
        <Route path=":moduleId" element={<ModuleLandingPage />} />
      </Route>

      <Route path="/pricing" element={<PricingRedirect />} />
      <Route path="/pricing/*" element={<PricingRedirect />} />

      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
  );
}
