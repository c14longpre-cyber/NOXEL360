import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";

type ModuleKey =
  | "overview"
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

type Module = {
  key: ModuleKey;
  name: string;
  short: string;
  badge: Badge;
  description: string;
  bullets: string[];
  href: string;
  highlight?: boolean;
  ico: string;
};

export default function DashboardHome() {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";
  const nav = useNavigate();

  const modules = useMemo<Module[]>(
    () => [
      {
        key: "overview",
        name: "NOXEL360 Overview",
        short: "Choose only what you need. Plug modules when you're ready.",
        badge: "CORE",
        description:
          "NOXEL360 is a modular intelligence suite to build, audit, and evolve products and websites. Each module is standalone, but they connect cleanly when you want deeper insights.",
        bullets: [
          "Modular by design (start small, scale fast)",
          "One identity system across tools",
          "Data flows between modules when enabled",
        ],
        href: "#modules",
        ico: "360",
        highlight: true,
      },
      {
        key: "analytics",
        name: "NOXEL ANALYTICS",
        short: "Insights & reports",
        badge: "PRO",
        description:
          "Unified performance, behavior, and trend reading in a visual system designed to stay useful, readable, and actionable.",
        bullets: [
          "KPIs & reports",
          "Segments & insights",
          "Audience intelligence foundation",
        ],
        href: "/app/analytics",
        ico: "AN",
      },
      {
        key: "atlas",
        name: "NOXEL ATLAS",
        short: "Map & audience intelligence",
        badge: "PRO",
        description:
          "Smart geography with layered reading: compare markets, spot opportunities, and read audience patterns visually.",
        bullets: [
          "Multi-level zoom",
          "Overlay comparisons",
          "Local SEO + audience reading",
        ],
        href: "/app/atlas",
        ico: "AT",
      },
      {
        key: "crm",
        name: "NOXEL CRM",
        short: "Client + admin CRM",
        badge: "PRO",
        description:
          "A dual CRM approach with internal admin control and a premium client-facing experience.",
        bullets: [
          "Pipeline & tickets",
          "Automations",
          "Client portal",
        ],
        href: "/app/crm",
        ico: "CRM",
      },
      {
        key: "flow",
        name: "NOXEL FLOW",
        short: "Themes & components distribution",
        badge: "PRO",
        description:
          "A distribution layer for ready-to-sell themes and components. Simplexity leads, Morph plugs in later.",
        bullets: [
          "Modular themes",
          "Consistent parameters",
          "Ecosystem-ready",
        ],
        href: "/app/flow",
        ico: "FL",
      },
      {
        key: "links",
        name: "NOXEL LINKS",
        short: "Link hygiene & structure",
        badge: "PRO",
        description:
          "Analyze internal and external links, redirects, and structural weaknesses to keep SEO clean and resilient.",
        bullets: [
          "Broken links & redirects",
          "Internal structure",
          "Simple, actionable reports",
        ],
        href: "/app/links",
        ico: "LK",
      },
      {
        key: "maestro",
        name: "NOXEL MAESTRO",
        short: "The unifying core",
        badge: "CORE",
        description:
          "The orchestration layer that unifies preferences, connectors, translations, and shared intelligence across modules.",
        bullets: [
          "Identity & preferences",
          "Connectors & normalization",
          "Base for Morph & Atlas",
        ],
        href: "/app/maestro",
        ico: "MA",
        highlight: true,
      },
      {
        key: "morph",
        name: "NOXEL MORPH™",
        short: "Adaptive UX theming",
        badge: "PRO",
        description:
          "Controlled visual adaptation: color, language, typography, and preference logic without breaking layout integrity.",
        bullets: [
          "Consent + simple reset",
          "Flow-ready adaptive themes",
          "Tailored experience",
        ],
        href: "/app/morph",
        ico: "MX",
      },
      {
        key: "nexus",
        name: "NOXEL NEXUS",
        short: "Language + region intelligence",
        badge: "CORE",
        description:
          "A unified intelligence layer for language, region, locale, and cultural adaptation across the NOXEL360 ecosystem.",
        bullets: [
          "Country + locale intelligence",
          "Language resolution",
          "Global UX foundation",
        ],
        href: "/app/nexus",
        ico: "NX",
        highlight: true,
      },
      {
        key: "optima",
        name: "NOXEL OPTIMA",
        short: "Convert + optimize",
        badge: "PRO",
        description:
          "Image conversion and optimization with clean outputs, quality control, and profitable packaging.",
        bullets: [
          "Smart compression",
          "Quality control",
          "Bronze → Diamond plans",
        ],
        href: "/app/optima",
        ico: "IMG",
      },
      {
        key: "seo",
        name: "NOXEL SEO",
        short: "Audit + fixes + scoring",
        badge: "LIVE",
        description:
          "Full audits, issues, fixes, and score tracking in a cockpit experience built to make action obvious.",
        bullets: [
          "Fast scans + actionable insights",
          "Category scoring",
          "Export-ready reports",
        ],
        href: "/app/seo",
        ico: "SEO",
      },
      {
        key: "social",
        name: "NOXEL SOCIAL",
        short: "Content + planning",
        badge: "PRO",
        description:
          "A structured content and planning environment that keeps execution steady, aligned, and scalable.",
        bullets: [
          "Calendar & templates",
          "Impact analysis",
          "Brand guidelines",
        ],
        href: "/app/social",
        ico: "SO",
      },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState<ModuleKey>("nexus");

  const visibleModules = modules.filter((m) => m.key !== "overview");

  const onCardKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    key: ModuleKey
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const m = modules.find((x) => x.key === key);
      if (!m) return;
      setActiveKey(key);
      nav(m.href);
    }
  };

  return (
    <div className="noxel-app" data-tier={tier}>
      <header className="noxel-header">
        <div className="hdr-left">
          <Link
            to="/dashboard"
            aria-label="Go to dashboard"
            style={{
              display: "inline-flex",
              width: 200,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              marginRight: 10,
              flex: "0 0 auto",
            }}
          >
            <img
              src={LOGO_BY_ID["360"]}
              alt="Noxel360"
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Link>

          <div>
            <div className="brand">NOXEL360</div>
            <div className="tag">Unified Intelligence Dashboard</div>
          </div>
        </div>

        <div className="hdr-right">
          <HeaderLanguage />
          <span className="tier">{tier.toUpperCase()}</span>
          <UserMenu />
        </div>
      </header>

      <div className="noxel-body">
        <aside className="noxel-sidenav">
          <div className="nav-group">
            {visibleModules.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`nav-item ${m.key === activeKey ? "is-active" : ""}`}
                onClick={() => {
                  setActiveKey(m.key);
                  nav(m.href);
                }}
              >
                <div className="nav-row">
                  <div className="nav-title">{m.name}</div>
                  <span className={`pill pill--${m.badge.toLowerCase()}`}>
                    {m.badge}
                  </span>
                </div>
                <div className="nav-sub">{m.short}</div>
              </button>
            ))}
          </div>

          <Link className="nav-cta" to="/pricing">
            Upgrade &amp; Pricing
          </Link>
        </aside>

        <main className="noxel-main">
          <section className="noxel-landing" aria-label="Noxel360 Modules">
            <div className="nx-bg-glow" aria-hidden="true">
              <span className="nx-glow nx-glow--green"></span>
              <span className="nx-glow nx-glow--purple"></span>
              <span className="nx-glow nx-glow--blue"></span>
            </div>

            <div className="nx-wrap">
              <header className="nx-hero">
                <div className="nx-hero__brand">
                  <div className="nx-logo" aria-hidden="true">
                    <img
                      src={LOGO_BY_ID["360"]}
                      alt=""
                      loading="lazy"
                      className="nx-logo__img"
                    />
                    <span className="nx-logo__color" aria-hidden="true" />
                  </div>

                  <div className="nx-hero__text">
                    <div className="nx-kicker">NOXEL360</div>

                    <h1 className="nx-title">
                      The modular suite to build, audit, and evolve your products.
                    </h1>

                    <p className="nx-subtitle">
                      Each module stands alone, but they share one identity, one
                      cockpit, and one growth logic. Enable only what you need —
                      then plug the rest when you're ready.
                    </p>

                    <div
                      className="nx-section-head"
                      id="modules"
                      style={{ marginTop: 18 }}
                    >
                      <h2 className="nx-h2">NOXEL Modules</h2>
                      <p className="nx-lead">
                        Specialized tools designed to ship one-by-one — then plug
                        into NOXEL360 without refactors.
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className="nx-grid nx-grid--5">
                {visibleModules.map((m) => (
                  <article
                    key={m.key}
                    className={[
                      "nx-card",
                      m.highlight ? "nx-card--highlight" : "",
                      m.key === activeKey ? "nx-card--active" : "",
                    ].join(" ")}
                    onClick={() => {
                      setActiveKey(m.key);
                      nav(m.href);
                    }}
                    onKeyDown={(e) => onCardKeyDown(e, m.key)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${m.name}`}
                  >
                    <div className="nx-card__top">
                      <div className="nx-ico">{m.ico}</div>
                      <span
                        className={[
                          "nx-badge",
                          m.badge === "LIVE" ? "nx-badge--live" : "",
                          m.badge === "CORE" ? "nx-badge--core" : "",
                        ].join(" ")}
                      >
                        {m.badge}
                      </span>
                    </div>

                    <h3 className="nx-card__title">{m.name}</h3>
                    <p className="nx-card__text">{m.description}</p>

                    <ul className="nx-card__list">
                      {m.bullets.slice(0, 3).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <Link
                      className="nx-card__link"
                      to={m.href}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open module →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

