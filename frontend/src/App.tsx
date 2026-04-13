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

import AnalyticsPage from "@/app/modules/analytics/Page";
import AtlasPage from "@/app/modules/atlas/Page";
import CrmPage from "@/app/modules/crm/Page";
import FlowPage from "@/app/modules/flow/Page";
import LinksPage from "@/app/modules/links/Page";
import MaestroPage from "@/app/modules/maestro/Page";
import MorphPage from "@/app/modules/morph/Page";
import NexusPage from "@/app/modules/nexus/Page";
import OptimaPage from "@/app/modules/optima/Page";
import SeoPage from "@/app/modules/seo/Page";
import SocialPage from "@/app/modules/social/Page";

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

      <Route path="/app/analytics" element={<AnalyticsPage />} />
      <Route path="/app/atlas" element={<AtlasPage />} />
      <Route path="/app/crm" element={<CrmPage />} />
      <Route path="/app/flow" element={<FlowPage />} />
      <Route path="/app/links" element={<LinksPage />} />
      <Route path="/app/maestro" element={<MaestroPage />} />
      <Route path="/app/morph" element={<MorphPage />} />
      <Route path="/app/nexus" element={<NexusPage />} />
      <Route path="/app/optima" element={<OptimaPage />} />
      <Route path="/app/seo" element={<SeoPage />} />
      <Route path="/app/social" element={<SocialPage />} />

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