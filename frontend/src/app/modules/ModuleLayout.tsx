import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";

type ModuleKey =
  | "analytics"
  | "atlas"
  | "crm"
  | "flow"
  | "links"
  | "maestro"
  | "morph"
  | "nexus"
  | "optima"
  | "seo"
  | "social";

type Badge = "PRO" | "CORE" | "LIVE";

type ModuleNavItem = {
  key: ModuleKey;
  name: string;
  short: string;
  badge: Badge;
  href: string;
};

const modules: ModuleNavItem[] = [
  {
    key: "analytics",
    name: "NOXEL ANALYTICS",
    short: "Insights & reports",
    badge: "PRO",
    href: "/app/analytics",
  },
  {
    key: "atlas",
    name: "NOXEL ATLAS",
    short: "Map & audience intelligence",
    badge: "PRO",
    href: "/app/atlas",
  },
  {
    key: "crm",
    name: "NOXEL CRM",
    short: "Client + admin CRM",
    badge: "PRO",
    href: "/app/crm",
  },
  {
    key: "flow",
    name: "NOXEL FLOW",
    short: "Themes & components distribution",
    badge: "PRO",
    href: "/app/flow",
  },
  {
    key: "links",
    name: "NOXEL LINKS",
    short: "Link hygiene & structure",
    badge: "PRO",
    href: "/app/links",
  },
  {
    key: "maestro",
    name: "NOXEL MAESTRO",
    short: "The unifying core",
    badge: "CORE",
    href: "/app/maestro",
  },
  {
    key: "morph",
    name: "NOXEL MORPH",
    short: "Adaptive UX theming",
    badge: "PRO",
    href: "/app/morph",
  },
  {
    key: "nexus",
    name: "NOXEL NEXUS",
    short: "Language + region intelligence",
    badge: "CORE",
    href: "/app/nexus",
  },
  {
    key: "optima",
    name: "NOXEL OPTIMA",
    short: "Convert + optimize",
    badge: "PRO",
    href: "/app/optima",
  },
  {
    key: "seo",
    name: "NOXEL SEO",
    short: "Audit + fixes + scoring",
    badge: "LIVE",
    href: "/app/seo",
  },
  {
    key: "social",
    name: "NOXEL SOCIAL",
    short: "Content + planning",
    badge: "PRO",
    href: "/app/social",
  },
];

type ModuleLayoutProps = {
  activeKey: ModuleKey;
  children: ReactNode;
};

export default function ModuleLayout({
  activeKey,
  children,
}: ModuleLayoutProps) {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";
  const nav = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(60,222,106,0.10), transparent 22%), radial-gradient(circle at top right, rgba(112,42,165,0.16), transparent 26%), linear-gradient(180deg, #07111a 0%, #08131d 100%)",
        color: "#f5f7fb",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(18px)",
          background: "rgba(6, 14, 22, 0.72)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1680px",
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minWidth: 0,
            }}
          >
            <Link
              to="/dashboard"
              aria-label="Go to dashboard"
              style={{
                display: "inline-flex",
                width: 76,
                height: 76,
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
                flex: "0 0 auto",
              }}
            >
              <img
                src={LOGO_BY_ID["360"]}
                alt="Noxel360"
                loading="eager"
                style={{ width: "86%", height: "86%", objectFit: "contain" }}
              />
            </Link>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                NOXEL360
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: "rgba(255,255,255,0.64)",
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Unified Intelligence Dashboard
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <HeaderLanguage />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(112,42,165,0.30)",
                background: "rgba(112,42,165,0.14)",
                color: "#ead8f7",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              {tier.toUpperCase()}
            </span>
            <UserMenu />
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1680px",
          margin: "0 auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "320px minmax(0, 1fr)",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: 110,
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
            boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              marginBottom: 14,
              padding: "4px 4px 10px 4px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: 8,
              }}
            >
              Module navigation
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              NOXEL Modules
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {modules.map((m) => {
              const isActive = m.key === activeKey;

              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => nav(m.href)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 22,
                    padding: "14px 14px 13px",
                    border: isActive
                      ? "1px solid rgba(60,222,106,0.34)"
                      : "1px solid rgba(255,255,255,0.06)",
                    background: isActive
                      ? "linear-gradient(180deg, rgba(60,222,106,0.16), rgba(112,42,165,0.10))"
                      : "rgba(255,255,255,0.03)",
                    boxShadow: isActive
                      ? "0 14px 34px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.03)"
                      : "none",
                    cursor: "pointer",
                    transition: "all .18s ease",
                    color: "#f5f7fb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {m.name}
                    </div>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        border:
                          m.badge === "LIVE"
                            ? "1px solid rgba(60,222,106,0.34)"
                            : m.badge === "CORE"
                              ? "1px solid rgba(112,42,165,0.30)"
                              : "1px solid rgba(255,255,255,0.12)",
                        background:
                          m.badge === "LIVE"
                            ? "rgba(60,222,106,0.12)"
                            : m.badge === "CORE"
                              ? "rgba(112,42,165,0.14)"
                              : "rgba(255,255,255,0.06)",
                        color:
                          m.badge === "LIVE"
                            ? "#baf7cb"
                            : m.badge === "CORE"
                              ? "#ead8f7"
                              : "rgba(255,255,255,0.82)",
                        flex: "0 0 auto",
                      }}
                    >
                      {m.badge}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: isActive
                        ? "rgba(255,255,255,0.86)"
                        : "rgba(255,255,255,0.58)",
                      lineHeight: 1.45,
                    }}
                  >
                    {m.short}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: "10px",
            }}
          >
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                minHeight: 50,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "#f5f7fb",
                fontWeight: 700,
              }}
            >
              Back to Dashboard
            </Link>

            <Link
              to="/pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                minHeight: 50,
                borderRadius: 18,
                border: "1px solid rgba(60,222,106,0.22)",
                background:
                  "linear-gradient(90deg, rgba(60,222,106,0.16), rgba(112,42,165,0.14))",
                color: "#f5f7fb",
                fontWeight: 800,
              }}
            >
              Upgrade & Pricing
            </Link>
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}