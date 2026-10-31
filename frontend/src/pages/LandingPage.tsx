import { useEffect } from "react";
import NoxelTopbar from "../components/NoxelTopbar";
import Footer from "../components/Footer";
import { useI18n } from "../useI18n";
import { HudLink } from "../components/hud/HudButton";
import { HudRouteLink } from "../components/hud/HudRouteLink";
import "./LandingPage.css";

// Textes : clés `landing.*` des dictionnaires (frontend/src/i18n/locales).
// Les noms de produits (NOXEL SEO, NOXEL FORGE, NOXEL NEXUS, NOXEL SPECTRA) ne se traduisent pas.

const FAQ_COUNT = 8;
const dtStyle = { fontWeight: 700, color: "var(--nl-text, #eef1f0)", marginBottom: 6 } as const;

export default function LandingPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "hidden"; };
  }, []);

  return (
    <div className="noxel-landing">
      <NoxelTopbar />

      <main>
        <div className="hero">
          <div className="wrap">
            <div className="eyebrow">🧩 {t("landing.hero.eyebrow")}</div>
            <h1>
              {t("landing.hero.line1")}<br />
              {t("landing.hero.line2")}<br />
              <span className="accent">{t("landing.hero.accent")}</span>
            </h1>
            <p className="lead">{t("landing.hero.lead")}</p>
            <div className="hero-ctas">
              <HudRouteLink to="/dashboard" action="open-project" label={t("landing.hero.ctaPrimary")} />
              <HudLink href="#modules" action="layer-down" label={t("landing.hero.ctaSecondary")} />
            </div>
            <div className="trust-row">
              <div><strong>3</strong> {t("landing.hero.trustModules")}</div>
              <div><strong>1</strong> {t("landing.hero.trustAccount")}</div>
              <div><strong>115</strong> {t("landing.hero.trustLanguages")}</div>
            </div>
          </div>
          <img
            src="/NX360-transparent.avif"
            alt={t("landing.hero.imageAlt")}
            loading="lazy"
            style={{
              width: 280,
              marginLeft: "auto",
              flexShrink: 0,
              opacity: 0.95,
              alignSelf: "flex-end",
            }}
          />
        </div>

        <section id="modules">
          <div className="wrap">
            <div className="section-tag">{t("landing.modules.tag")}</div>
            <h2 className="section-title">{t("landing.modules.title")}</h2>
            <p className="section-lead">{t("landing.modules.lead")}</p>

            <div className="modules-grid">
              <div className="module-card">
                <span className="icon">🔍</span>
                <div className="module-top">
                  <h3>NOXEL SEO</h3>
                  <span className="badge live">{t("landing.badge.live")}</span>
                </div>
                <p>{t("landing.seo.desc")}</p>
                <ul>
                  <li>{t("landing.seo.b1")}</li>
                  <li>{t("landing.seo.b2")}</li>
                  <li>{t("landing.seo.b3")}</li>
                </ul>
                <HudLink href="https://noxelseo.com" action="open-project" compact className="module-hud" label={t("landing.seo.cta")} />
              </div>

              <div className="module-card">
                <span className="icon">🔗</span>
                <div className="module-top">
                  <h3>NOXEL FORGE</h3>
                  <span className="badge live">{t("landing.badge.live")}</span>
                </div>
                <p>{t("landing.forge.desc")}</p>
                <ul>
                  <li>{t("landing.forge.b1")}</li>
                  <li>{t("landing.forge.b2")}</li>
                  <li>{t("landing.forge.b3")}</li>
                </ul>
                <HudLink href="https://noxelforge.com" action="open-project" compact className="module-hud" label={t("landing.forge.cta")} />
              </div>

              <div className="module-card">
                <span className="icon">🌐</span>
                <div className="module-top">
                  <h3>NOXEL NEXUS</h3>
                  <span className="badge core">{t("landing.badge.core")}</span>
                </div>
                <p>{t("landing.nexus.desc")}</p>
                <ul>
                  <li>{t("landing.nexus.b1")}</li>
                  <li>{t("landing.nexus.b2")}</li>
                  <li>{t("landing.nexus.b3")}</li>
                </ul>
                <HudRouteLink to="/nexus" action="open-project" compact className="module-hud" label={t("landing.nexus.cta")} />
              </div>
            </div>
          </div>
        </section>

        <section id="whats-next">
          <div className="wrap">
            <div className="section-tag">{t("landing.next.tag")}</div>
            <h2 className="section-title">{t("landing.next.title")}</h2>
            <p className="section-lead">{t("landing.next.lead")}</p>

            <div className="teaser">
              <div>
                <span className="badge soon-p">{t("landing.badge.soon")}</span>
                <h3>{t("landing.spectra.title")}</h3>
                <p>{t("landing.spectra.p1")}</p>
                <p>{t("landing.spectra.p2")}</p>
                <HudLink href="https://noxelspectra.com" action="continue" compact className="module-hud" label={t("landing.spectra.cta")} />
              </div>
              <ul className="teaser-list">
                <li><strong>{t("landing.spectra.convertTitle")}</strong><span>{t("landing.spectra.convertText")}</span></li>
                <li><strong>{t("landing.spectra.compressTitle")}</strong><span>{t("landing.spectra.compressText")}</span></li>
                <li><strong>{t("landing.spectra.paletteTitle")}</strong><span>{t("landing.spectra.paletteText")}</span></li>
                <li><strong>{t("landing.spectra.vectorTitle")}</strong><span>{t("landing.spectra.vectorText")}</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="wrap">
            <div className="section-tag">{t("landing.how.tag")}</div>
            <h2 className="section-title">{t("landing.how.title")}</h2>
            <p className="section-lead">{t("landing.how.lead")}</p>

            <div className="how-grid">
              {[1, 2, 3].map((n) => (
                <div className="how-step" key={n}>
                  <span className="num">{t("landing.how.step", { n })}</span>
                  <h4>{t(`landing.how.s${n}Title`)}</h4>
                  <p>{t(`landing.how.s${n}Text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="connected">
          <div className="wrap">
            <div className="section-tag">{t("landing.connected.tag")}</div>
            <h2 className="section-title">{t("landing.connected.title")}</h2>
            <p className="section-lead">{t("landing.connected.lead")}</p>
            <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              {t("landing.connected.p1")}
            </p>
            <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7 }}>
              {t("landing.connected.p2")}
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="split">
              <div>
                <div className="section-tag">{t("landing.why.tag")}</div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>
                  {t("landing.why.title")}
                </h2>
                <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7 }}>
                  {t("landing.why.text")}
                </p>
                <ul className="checklist">
                  <li>{t("landing.why.c1")}</li>
                  <li>{t("landing.why.c2")}</li>
                  <li>{t("landing.why.c3")}</li>
                </ul>
              </div>
              <div className="split-visual" style={{ position: "relative" }}>
                <img
                  src="/NX360-transparent.avif"
                  alt="NX360"
                  style={{ width: 120, marginBottom: 16, opacity: 0.95 }}
                />
                <div className="stat-row"><span className="label">{t("landing.stats.live")}</span><span className="val">2 (SEO, Forge)</span></div>
                <div className="stat-row"><span className="label">{t("landing.stats.core")}</span><span className="val">Nexus</span></div>
                <div className="stat-row"><span className="label">{t("landing.stats.next")}</span><span className="val">Spectra</span></div>
                <div className="stat-row"><span className="label">{t("landing.stats.languages")}</span><span className="val">115</span></div>
                <div className="stat-row"><span className="label">{t("landing.stats.builtFor")}</span><span className="val">{t("landing.stats.builtForValue")}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="wrap">
            <div className="section-tag">{t("landing.faq.tag")}</div>
            <h2 className="section-title">{t("landing.faq.title")}</h2>
            <dl style={{ fontSize: 16, lineHeight: 1.7, color: "var(--nl-muted)" }}>
              {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => (
                <div key={n}>
                  <dt style={dtStyle}>{t(`landing.faq.q${n}`)}</dt>
                  <dd style={{ margin: n === FAQ_COUNT ? 0 : "0 0 20px" }}>{t(`landing.faq.a${n}`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="final-cta">
          <div className="wrap">
            <h2>{t("landing.cta.title")}</h2>
            <p>{t("landing.cta.text")}</p>
            <HudRouteLink to="/dashboard" action="open-project" label={t("landing.hero.ctaPrimary")} />
          </div>
        </div>
      </main>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Footer
          brand="NOXEL360"
          siteUrl="https://noxel360.com"
          contactEmail="founder@noxel360.com"
          links={[
            { label: "NOXEL SEO", href: "https://noxelseo.com", external: true },
            { label: "NOXEL FORGE", href: "https://noxelforge.com", external: true },
            { label: "NOXEL NEXUS", href: "/nexus" },
            { label: "NOXEL SPECTRA", href: "https://noxelspectra.com", external: true },
            { label: t("landing.nav.pricing"), href: "/pricing/" },
            { label: t("landing.nav.learn"), href: "/learn/" },
            { label: t("landing.footer.privacy"), href: "/privacy" },
            { label: t("landing.footer.terms"), href: "/terms" },
          ]}
        />
      </div>
    </div>
  );
}
