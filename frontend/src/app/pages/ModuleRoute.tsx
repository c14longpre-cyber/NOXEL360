import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import modulePricing from "../../../../module-pricing.json";

type PricingModule = {
  Id: string;
  Name: string;
  Subtitle: string;
  AppRoute: string;
};

/**
 * Destination de chaque AppRoute de module-pricing.json.
 * NOXEL SEO vit sur son propre domaine ; Core et MAESTRO ont un équivalent
 * interne. Les modules sans destination affichent « bientôt disponible ».
 */
const EXTERNAL_BY_ID: Record<string, string> = {
  seo: "https://noxelseo.com",
  serp: "https://noxelseo.com",
  vitals: "https://noxelseo.com",
};

const INTERNAL_BY_ID: Record<string, string> = {
  core: "/dashboard",
  MAESTRO: "/app/account",
};

const normalize = (p: string) => p.replace(/\/+$/, "").toLowerCase();

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

export default function ModuleRoute() {
  const { pathname } = useLocation();
  const module = (modulePricing as PricingModule[]).find(
    (m) => normalize(m.AppRoute) === normalize(pathname)
  );

  if (!module) {
    return <div style={{ padding: 24 }}>404</div>;
  }

  const external = EXTERNAL_BY_ID[module.Id];
  if (external) return <ExternalRedirect to={external} />;

  const internal = INTERNAL_BY_ID[module.Id];
  if (internal) return <Navigate to={internal} replace />;

  return (
    <section style={{ padding: 24, maxWidth: 640 }}>
      <p style={{ color: "#A855F7", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
        Coming soon
      </p>
      <h1 style={{ margin: "8px 0 12px" }}>{module.Name}</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{module.Subtitle}</p>
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <a href="/pricing/index.html#plans" style={{ color: "#3ddc84" }}>
          See pricing
        </a>
        <Link to="/dashboard" style={{ color: "rgba(255,255,255,0.7)" }}>
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
