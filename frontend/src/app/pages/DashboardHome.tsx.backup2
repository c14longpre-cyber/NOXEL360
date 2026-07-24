import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_BY_ID } from "@/app/modules/logos";
import { useModulesIndex } from "../modules/useModulesIndex";
import UserMenu from "@/components/UserMenu";
import HeaderLanguage from "@/components/HeaderLanguage";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";
import { useI18n } from "@/useI18n";

export default function DashboardHome() {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";
  const nav = useNavigate();
  const modules = useModulesIndex();
  const { t } = useI18n();

  const [activeKey, setActiveKey] = useState<string>("nexus");

  function openModule(key: string, route: string, external?: boolean) {
    setActiveKey(key);
    if (external) {
      window.open(route, "_blank", "noopener,noreferrer");
    } else {
      nav(route);
    }
  }

  const onCardKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    key: string,
    route: string,
    external?: boolean
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModule(key, route, external);
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
          <div className="nav-group" aria-label="Modules">
            {modules.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`nav-item ${m.key === activeKey ? "is-active" : ""}`}
                onClick={() => openModule(m.key, m.route, m.external)}
              >
                <div className="nav-row">
                  <div className="nav-title">{m.name}</div>
                  <span
                    className={`pill pill--${
                      m.status === "ready" ? "live" : m.status
                    }`}
                  >
                    {m.status === "ready" ? "LIVE" : m.status.toUpperCase()}
                  </span>
                </div>
                <div className="nav-sub">{m.promise}</div>
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
                      <p className="nx-lead">{t("dashboard.hero.modulesLead")}</p>
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
                      m.key === "nexus" ? "nx-card--highlight" : "",
                      m.key === activeKey ? "nx-card--active" : "",
                    ].join(" ")}
                    onClick={() => openModule(m.key, m.route, m.external)}
                    onKeyDown={(e) => onCardKeyDown(e, m.key, m.route, m.external)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t("common.open")} ${m.name}`}
                  >
                    <div className="nx-card__top">
                      <img
                        src={LOGO_BY_ID[m.key] || LOGO_BY_ID["360"]}
                        alt=""
                        style={{ width: 40, height: 40, objectFit: "contain" }}
                        loading="lazy"
                      />
                      <span
                        className={[
                          "nx-badge",
                          m.status === "ready" ? "nx-badge--live" : "",
                          m.status === "core" ? "nx-badge--core" : "",
                        ].join(" ")}
                      >
                        {m.status === "ready" ? "LIVE" : m.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="nx-card__title">{m.name}</h3>
                    <p className="nx-card__text">{m.promise}</p>

                    {m.external ? (
                      <a
                        className="nx-card__link"
                        href={m.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("dashboard.card.open")} ↗
                      </a>
                    ) : (
                      <Link
                        className="nx-card__link"
                        to={m.route}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("dashboard.card.open")}
                      </Link>
                    )}
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
