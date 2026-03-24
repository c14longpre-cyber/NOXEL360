import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
type ModuleKey =
  | "overview"
  | "seo"
  | "atlas"
  | "links"
  | "maestro"
  | "morph"
  | "flow"
  | "images"
  | "analytics"
  | "social"
  | "crm";

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
  // ✅ Ajuste ici ton niveau (plus tard tu le mettras depuis ton user/profile)
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";

  const nav = useNavigate();

  const modules = useMemo<Module[]>(
    () => [
      {
        key: "overview",
        name: "Noxel360 Overview",
        short: "Choose only what you need. Plug modules when you're ready.",
        badge: "CORE",
        description:
          "Noxel360 is a modular intelligence suite to build, audit, and evolve products and websites. Each module is standalone, but they connect cleanly when you want deeper insights.",
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
        key: "seo",
        name: "NOXEL SEO",
        short: "Audit + fixes + scoring",
        badge: "LIVE",
        description:
          "Full audits (scores, issues, recommendations) with a cockpit experience. Diagnose, prioritize fixes, and measure impact over time.",
        bullets: ["Fast scans + actionable insights", "Category scoring", "Export-ready reports"],
        href: "/app/seo",
        ico: "SEO",
      },
      {
        key: "atlas",
        name: "NOXEL ATLAS",
        short: "Map & audience intelligence",
        badge: "PRO",
        description:
          "Smart geography (country → region → city) with overlays. Read markets, compare zones, and detect opportunities visually.",
        bullets: ["Multi-level zoom", "Overlay comparisons", "Local SEO + audience reading"],
        href: "/app/atlas",
        ico: "AT",
      },
      {
        key: "links",
        name: "NOXEL LINKS",
        short: "Link hygiene & structure",
        badge: "PRO",
        description:
          "Analyze internal/external links, redirects, and errors. A clean-up module that protects SEO and clarifies your structure.",
        bullets: ["Broken links & redirects", "Internal structure", "Simple, actionable reports"],
        href: "/app/links",
        ico: "LK",
      },
      {
        key: "maestro",
        name: "NOXEL MAESTRO",
        short: "The unifying core",
        badge: "CORE",
        description:
          "The foundation that unifies data, preferences, translations, and integrations — making modules plug-and-play without friction.",
        bullets: ["Identity & preferences", "Connectors & normalization", "Base for Morph & Atlas"],
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
          "Controlled visual adaptation: colors, text, language, typography, and preferences. Users choose — Morph applies without breaking design.",
        bullets: ["Consent + simple reset", "Flow-ready adaptive themes", "Tailored experience"],
        href: "/app/morph",
        ico: "MX",
      },
      {
        key: "flow",
        name: "NOXEL FLOW",
        short: "Themes & components distribution",
        badge: "PRO",
        description:
          "A catalog of ready-to-sell themes and components. Simplexity is the master theme — Morph connects later.",
        bullets: ["Modular themes", "Consistent parameters", "Ecosystem-ready"],
        href: "/app/flow",
        ico: "FL",
      },
      {
        key: "images",
        name: "NOXEL OPTIMA",
        short: "Convert + optimize",
        badge: "PRO",
        description:
          "Convert and optimize images (WebP, PNG, JPG) plus 'Tiny-like' cleanup. Simple, profitable, useful for every client.",
        bullets: ["Smart compression", "Quality control", "Bronze → Diamond plans"],
        href: "/app/images",
        ico: "IMG",
      },
      {
        key: "analytics",
        name: "NOXEL ANALYTICS",
        short: "Insights & reports",
        badge: "PRO",
        description:
          "Unified performance, behavior, and trend reading. Data that's understandable, actionable, and visual — like a cockpit.",
        bullets: ["KPIs & reports", "Segments & insights", "Foundation for Audience Intelligence"],
        href: "/app/analytics",
        ico: "AN",
      },
      {
        key: "social",
        name: "NOXEL SOCIAL",
        short: "Content + planning",
        badge: "PRO",
        description:
          "Plan, stay on-brand, and amplify content. A production-oriented module that keeps momentum without chaos.",
        bullets: ["Calendar & templates", "Impact analysis", "Brand guidelines"],
        href: "/app/social",
        ico: "SO",
      },
      {
        key: "crm",
        name: "NOXEL CRM",
        short: "Client + admin CRM",
        badge: "PRO",
        description:
          "Dual CRM: internal admin + client portal. Built for follow-up, automation, and a premium experience.",
        bullets: ["Pipeline & tickets", "Automations", "Client portal"],
        href: "/app/crm",
        ico: "CRM",
      },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState<ModuleKey>("overview");

  const onCardKeyDown = (e: React.KeyboardEvent, key: ModuleKey) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const m = modules.find((x) => x.key === key);
      if (m) nav(m.href);
    }
  };

  return (
    <div className="noxel-app" data-tier={tier}>
      {/* HEADER */}
      <header className="noxel-header">
        <div className="hdr-left">
          <div className="logo-slot" />
          <div>
            <div className="brand">NOXEL360</div>
            <div className="tag">Unified Intelligence Dashboard</div>
          </div>
        </div>

        <div className="hdr-right">
          <span className="tier">{tier.toUpperCase()}</span>
          <UserMenu />
        </div>
      </header>

      {/* BODY */}
      <div className="noxel-body">
        {/* SIDE NAV */}
        <aside className="noxel-sidenav">
          <div className="nav-group">
            {modules
              .filter((m) => m.key !== "overview")
              .map((m) => (
                <button
                  key={m.key}
                  className={`nav-item ${m.key === activeKey ? "is-active" : ""}`}
                  onClick={() => nav(m.href)}
                >
                  <div className="nav-row">
                    <div className="nav-title">{m.name}</div>
                    <span className={`pill pill--${m.badge.toLowerCase()}`}>{m.badge}</span>
                  </div>
                  <div className="nav-sub">{m.short}</div>
                </button>
              ))}
          </div>

          {/* CTA */}
          <Link className="nav-cta" to="/pricing">
            Upgrade & Pricing
          </Link>
        </aside>

        {/* MAIN */}
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
                    <span className="nx-logo__ring"></span>
                    <span className="nx-logo__dot"></span>
                  </div>

                  <div className="nx-hero__text">
                    <div className="nx-kicker">NOXEL360</div>
                    <h2 className="nx-title">
                      The modular suite to build, audit, and evolve your products.
                    </h2>
                    <p className="nx-subtitle">
                      Each module stands alone, but they share one identity, one cockpit, and one growth logic.
                      Enable only what you need — then plug the rest when you're ready.
                    </p>
                  </div>
                </div>
              </header>

              <div className="nx-section-head" id="modules">
                <h2 className="nx-h2">NOXEL Modules</h2>
                <p className="nx-lead">
                  Specialized tools designed to ship one-by-one — then plug into Noxel360 without refactors.
                </p>
              </div>

              <div className="nx-grid nx-grid--5">
                {modules
                  .filter((m) => m.key !== "overview")
                  .map((m) => (
                    <article
                      key={m.key}
                      className={[
                        "nx-card",
                        m.highlight ? "nx-card--highlight" : "",
                        m.key === activeKey ? "nx-card--active" : "",
                      ].join(" ")}
                      onClick={() => nav(m.href)}
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
