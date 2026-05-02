import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useModulesIndex } from "../modules/useModulesIndex";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
import { useI18n } from "@/useI18n";

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

export default function DashboardHome() {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";
  const nav = useNavigate();
  const indexItems = useModulesIndex();
  const { t } = useI18n();

  const modules = useMemo<DashboardModule[]>(() => {
    const bulletKeysByModule: Record<string, string[]> = {
      analytics: [
        "dashboard.module.analytics.bullet1",
        "dashboard.module.analytics.bullet2",
        "dashboard.module.analytics.bullet3",
      ],
      atlas: [
        "dashboard.module.atlas.bullet1",
        "dashboard.module.atlas.bullet2",
        "dashboard.module.atlas.bullet3",
      ],
      crm: [
        "dashboard.module.crm.bullet1",
        "dashboard.module.crm.bullet2",
        "dashboard.module.crm.bullet3",
      ],
      flow: [
        "dashboard.module.flow.bullet1",
        "dashboard.module.flow.bullet2",
        "dashboard.module.flow.bullet3",
      ],
      links: [
        "dashboard.module.links.bullet1",
        "dashboard.module.links.bullet2",
        "dashboard.module.links.bullet3",
      ],
      maestro: [
        "dashboard.module.maestro.bullet1",
        "dashboard.module.maestro.bullet2",
        "dashboard.module.maestro.bullet3",
      ],
      morph: [
        "dashboard.module.morph.bullet1",
        "dashboard.module.morph.bullet2",
        "dashboard.module.morph.bullet3",
      ],
      nexus: [
        "dashboard.module.nexus.bullet1",
        "dashboard.module.nexus.bullet2",
        "dashboard.module.nexus.bullet3",
      ],
      optima: [
        "dashboard.module.optima.bullet1",
        "dashboard.module.optima.bullet2",
        "dashboard.module.optima.bullet3",
      ],
      seo: [
        "dashboard.module.seo.bullet1",
        "dashboard.module.seo.bullet2",
        "dashboard.module.seo.bullet3",
      ],
      social: [
        "dashboard.module.social.bullet1",
        "dashboard.module.social.bullet2",
        "dashboard.module.social.bullet3",
      ],
    };

    const descriptionKeyByModule: Record<string, string> = {
      analytics: "dashboard.module.analytics.description",
      atlas: "dashboard.module.atlas.description",
      crm: "dashboard.module.crm.description",
      flow: "dashboard.module.flow.description",
      links: "dashboard.module.links.description",
      maestro: "dashboard.module.maestro.description",
      morph: "dashboard.module.morph.description",
      nexus: "dashboard.module.nexus.description",
      optima: "dashboard.module.optima.description",
      seo: "dashboard.module.seo.description",
      social: "dashboard.module.social.description",
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

    return indexItems.map((item) => {
      const badge = toBadge(item.status);

      const bulletKeys = bulletKeysByModule[item.key] ?? [
        "dashboard.module.common.bullet1",
        "dashboard.module.common.bullet2",
        "dashboard.module.common.bullet3",
      ];

      return {
        key: item.key,
        name: t(item.nameKey),
        short: t(item.promiseKey),
        badge,
        description: t(
          descriptionKeyByModule[item.key] ?? "modules.common.comingSoon"
        ),
        bullets: bulletKeys.map((key) => t(key)),
        href: item.route,
        ico: iconByKey[item.key] || item.key.slice(0, 2).toUpperCase(),
        highlight: item.key === "maestro" || item.key === "nexus",
      };
    });
  }, [indexItems, t]);

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
            aria-label={t("dashboard.title")}
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
            <div className="tag">{t("dashboard.tagline")}</div>
          </div>
        </div>

        <div className="hdr-right">
          <HeaderLanguage />
          <span className="tier">{tier.toUpperCase()}</span>
          <UserMenu />
        </div>
      </header>

      <TranslationStatusBanner />

      <div className="noxel-body">
        <aside className="noxel-sidenav">
          <div className="nav-group" aria-label={t("dashboard.modules")}>
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
            {t("dashboard.sidenav.upgrade")}
          </Link>
        </aside>

        <main className="noxel-main">
          <section
            className="noxel-landing"
            aria-label={t("dashboard.hero.modulesHeading")}
          >
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
                    <h1 className="nx-title">{t("dashboard.hero.title")}</h1>
                    <p className="nx-subtitle">{t("dashboard.hero.subtitle")}</p>

                    <div
                      className="nx-section-head"
                      id="modules"
                      style={{ marginTop: 18 }}
                    >
                      <h2 className="nx-h2">
                        {t("dashboard.hero.modulesHeading")}
                      </h2>
                      <p className="nx-lead">
                        {t("dashboard.hero.modulesLead")}
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
                    aria-label={`${t("common.open")} ${m.name}`}
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
                      {t("dashboard.card.open")}
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

