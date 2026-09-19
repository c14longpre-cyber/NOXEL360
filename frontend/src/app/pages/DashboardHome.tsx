import { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "hidden"; };
  }, []);

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
                 <img
                    src="/NX360-transparent.avif"
                    alt="NX360, your NOXEL360 companion"
                    loading="lazy"
                    style={{
                      width: 380,
                      height: "auto",
                      marginLeft: "auto",
                      flexShrink: 0,
                      opacity: 0.95,
                      alignSelf: "flex-start",
                    }}
                  />
                </div>
              <section aria-label="About NOXEL360" style={{ maxWidth: 760, margin: "0 auto 32px", color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7 }}>
                <p>NOXEL360 is a modular platform built around three functional products.</p>
                <p><strong style={{ color: "#fff" }}>NOXEL SEO</strong> provides automated site audits, technical and content scoring, AI-powered fix suggestions, and search visibility tracking — including integration with Google Search Console for real impressions, clicks, and query data. It&apos;s built for solopreneurs and small teams who need enterprise-grade SEO tooling without the enterprise price tag.</p>
                <p><strong style={{ color: "#fff" }}>NOXEL Forge</strong> is a verified backlink exchange network. Members submit real sites in exchange for reviewed, quality backlinks — every submission is screened by an AI reviewer against spam, thin content, and off-niche criteria before approval, keeping the network free of low-quality link farms.</p>
                <p><strong style={{ color: "#fff" }}>NOXEL Nexus</strong> is the language and region intelligence engine underneath the ecosystem — detecting a visitor&apos;s language, region, and cultural context to adapt content and experience automatically across NOXEL360&apos;s products.</p>
                <p>Together, these three products form a connected toolkit: sign in once, and move between search optimization, link building, and localization without juggling separate accounts or tools.</p>
              </section>

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
                    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48, padding: "32px 0", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            <p style={{ maxWidth: 720, margin: "0 auto 16px", lineHeight: 1.6 }}>
              NOXEL360 connects NOXEL SEO, NOXEL Forge, and Nexus in one dashboard for search
              visibility, verified backlinks, and language intelligence.
            </p>
            <nav aria-label="Site links" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 14 }}>
              <a href="https://noxelseo.com" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL SEO</a>
              <a href="https://noxelforge.com" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL Forge</a>
              <Link to="/nexus" style={{ color: "#3ddc84", textDecoration: "none" }}>NOXEL Nexus</Link>
              <a href="/learn" style={{ color: "#3ddc84", textDecoration: "none" }}>Learn</a>
              <Link to="/app/account" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Account</Link>
              <Link to="/privacy" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Privacy</Link>
              <Link to="/terms" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Terms</Link>
            </nav>
            <p style={{ margin: 0 }}>© 2026 NOXEL360. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
