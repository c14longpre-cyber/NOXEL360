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
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <div className="noxel-app" data-tier={tier}>
      <header
        className="noxel-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div
          className="hdr-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Link
            to="/dashboard"
            aria-label="Return to dashboard"
            style={{
              display: "inline-flex",
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flex: "0 0 auto",
            }}
          >
            <img
              src={noxel360Logo}
              alt="Noxel360"
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Link>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 0,
            }}
          >
            <div className="brand">NOXEL360</div>
            <div className="tag">{t("module.host.title")}</div>

            {!isDashboard && (
              <button
                className="nav-cta"
                style={{
                  marginTop: 8,
                  width: "fit-content",
                  padding: "8px 16px",
                }}
                onClick={() => navigate(-1)}
                type="button"
              >
                {t("module.host.previous")}
              </button>
            )}
          </div>
        </div>

        <div
          className="hdr-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: "0 0 auto",
            position: "relative",
            zIndex: 20,
          }}
        >
          <HeaderLanguage />
          <span className="tier">{tier.toUpperCase()}</span>
          <UserMenu />
        </div>
      </header>

      <TranslationStatusBanner />

      <div className="noxel-body">
        <aside className="noxel-sidenav">
          <div
            style={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <SideNav />
          </div>
        </aside>

        <main className="noxel-main">
          <section
            className="noxel-landing"
            aria-label="Module content"
            style={{ minHeight: "100%", width: "100%" }}
          >
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}