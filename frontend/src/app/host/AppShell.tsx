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
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";

  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <div className="noxel-app" data-tier={tier}>
      <header className="noxel-header">
        <div className="hdr-left">
          <Link
            to="/dashboard"
            aria-label="Return to dashboard"
            style={{
              display: "inline-flex",
              width: 200,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              marginRight: 10,
            }}
          >
            <img
              src={noxel360Logo}
              alt="Noxel360"
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Link>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
  <div className="brand">NOXEL360</div>
  <div className="tag">Module Host</div>

  {!isDashboard && (
    <button
      className="nav-cta"
      style={{ marginTop: 8, width: "fit-content", padding: "8px 16px" }}
      onClick={() => navigate(-1)}
      type="button"
    >
      ← Previous page
    </button>
  )}
</div>
        </div>

      <div className="hdr-right">
  <span className="tier">{tier.toUpperCase()}</span>
  <UserMenu />
</div>
      </header>

      <div className="noxel-body">
        <aside className="noxel-sidenav">
          <div style={{ minHeight: 0 }}>
            <SideNav />
          </div>
        </aside>

        <main className="noxel-main">
          <section className="noxel-landing" aria-label="Module content">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}