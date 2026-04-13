import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useModulesIndex } from "../modules/useModulesIndex";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";

type Badge = "PRO" | "CORE" | "LIVE";

type DashboardModule = {
  key: string;
  name: string;
  short: string;
  badge: Badge;
  description: string;
  bullets: string[];
  href: string;
  highlight?: boolean;
  ico: string;
};

function toBadge(status?: string): Badge {
  const value = (status || "").toLowerCase();
  if (value === "ready") return "LIVE";
  if (value === "core") return "CORE";
  return "PRO";
}

function toDashboardModule(item: ReturnType<typeof useModulesIndex>[number]): DashboardModule {
  const badge = toBadge(item.status);

  const bulletsByKey: Record<string, string[]> = {
    analytics: ["KPIs & reports", "Segments & insights", "Audience intelligence foundation"],
    atlas: ["Multi-level zoom", "Overlay comparisons", "Local SEO + audience reading"],
    crm: ["Pipeline & tickets", "Automations", "Client portal"],
    flow: ["Modular themes", "Consistent parameters", "Ecosystem-ready"],
    links: ["Broken links & redirects", "Internal structure", "Simple, actionable reports"],
    maestro: ["Identity & preferences", "Connectors & normalization", "Base for Morph & Atlas"],
    morph: ["Consent + simple reset", "Flow-ready adaptive themes", "Tailored experience"],
    nexus: ["Country + locale intelligence", "Language resolution", "Global UX foundation"],
    optima: ["Smart compression", "Quality control", "Bronze -> Diamond plans"],
    seo: ["Fast scans + actionable insights", "Category scoring", "Export-ready reports"],
    social: ["Calendar & templates", "Impact analysis", "Brand guidelines"],
  };

  const descriptionByKey: Record<string, string> = {
    analytics: "Performance, behavior, and trend reading in a visual system designed to be useful, not noisy.",
    atlas: "Smart geography with layered reading: compare markets, spot opportunities, and read audience patterns visually.",
    crm: "A dual CRM approach with internal admin control and a premium client-facing experience.",
    flow: "A distribution layer for ready-to-sell themes and components. Simplexity leads, Morph plugs in later.",
    links: "Analyze internal and external links, redirects, and structural weaknesses to keep SEO clean and resilient.",
    maestro: "The orchestration layer that unifies preferences, connectors, translations, and shared intelligence across modules.",
    morph: "Controlled visual adaptation: color, language, typography, and preference logic without breaking layout integrity.",
    nexus: "A unified intelligence layer for language, region, locale, and cultural adaptation across the NOXEL360 ecosystem.",
    optima: "Image conversion and optimization with clean outputs, quality control, and profitable packaging.",
    seo: "Full audits, issues, fixes, and score tracking in a cockpit experience built to make action obvious.",
    social: "A structured content and planning environment that keeps execution steady, aligned, and scalable.",
  };

  const iconByKey: Record<string, string> = {
    analytics: "AN",
    atlas: "AT",
    crm: "CRM",
    flow: "FL",
    links: "LK",
    maestro: "MA",
    morph: "MX",
    nexus: "NX",
    optima: "IMG",
    seo: "SEO",
    social: "SO",
  };

  return {
    key: item.key,
    name: item.name,
    short: item.promise,
    badge,
    description: descriptionByKey[item.key] || item.promise || "Landing scaffold (details coming soon).",
    bullets: bulletsByKey[item.key] || [
      "Structured module space",
      "Shared NOXEL360 identity",
      "Ready for future expansion",
    ],
    href: item.route,
    ico: iconByKey[item.key] || item.key.slice(0, 2).toUpperCase(),
    highlight: item.key === "maestro" || item.key === "nexus",
  };
}

export default function DashboardHome() {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";
  const nav = useNavigate();
  const indexItems = useModulesIndex();

  const modules = useMemo<DashboardModule[]>(
    () => indexItems.map((item) => toDashboardModule(item)),
    [indexItems]
  );

  const [activeKey, setActiveKey] = useState<string>("nexus");

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLElement>, key: string) => {
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
            {modules.map((m) => (
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

                    <div className="nx-section-head" id="modules" style={{ marginTop: 18 }}>
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
                {modules.map((m) => (
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
