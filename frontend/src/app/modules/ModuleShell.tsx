import ModuleLayout from "./ModuleLayout";
import { LOGO_BY_ID } from "@/app/modules/logos";

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

type ModuleCard = {
  title: string;
  text: string;
  bullets?: string[];
  linkLabel?: string;
};

type ModuleKpi = {
  label: string;
  value: string;
  hint?: string;
};

type ModuleShellProps = {
  activeKey: ModuleKey;
  badge?: string;
  title: string;
  subtitle: string;
  kicker?: string;
  kpis?: ModuleKpi[];
  cards: ModuleCard[];
};

export default function ModuleShell({
  activeKey,
  badge = "PRO",
  title,
  subtitle,
  kicker = "NOXEL MODULE",
  kpis = [],
  cards,
}: ModuleShellProps) {
  const logoSrc = LOGO_BY_ID[activeKey as keyof typeof LOGO_BY_ID];

  return (
    <ModuleLayout activeKey={activeKey}>
      <section className="noxel-landing" aria-label={title}>
        <div className="nx-bg-glow" aria-hidden="true">
          <span className="nx-glow nx-glow--green"></span>
          <span className="nx-glow nx-glow--purple"></span>
          <span className="nx-glow nx-glow--blue"></span>
        </div>

        <div className="nx-wrap">
          <header className="nx-hero">
            <div className="nx-hero__brand">
              <div className="nx-logo" aria-hidden="true">
                {logoSrc ? (
                  <>
                    <img
                      src={logoSrc}
                      alt=""
                      loading="lazy"
                      className="nx-logo__img"
                    />
                    <span className="nx-logo__color" aria-hidden="true" />
                  </>
                ) : (
                  <div className="nx-logo__fallback">
                    {title.replace("NOXEL ", "").slice(0, 2)}
                  </div>
                )}
              </div>

              <div className="nx-hero__text">
                <div className="nx-kicker">
                  {kicker} · {badge}
                </div>

                <h1 className="nx-title">{title}</h1>

                <p className="nx-subtitle">{subtitle}</p>
              </div>
            </div>
          </header>

          {kpis.length > 0 ? (
            <div className="nx-kpi-grid">
              {kpis.map((kpi, index) => (
                <article key={kpi.label} className="nx-kpi-card">
                  <div className="nx-kpi-card__top">
                    <span className="nx-kpi-card__eyebrow">{kpi.label}</span>
                    <span className="nx-kpi-card__dot" data-alt={index % 2 === 1} />
                  </div>

                  <div className="nx-kpi-card__value">{kpi.value}</div>

                  {kpi.hint ? (
                    <div className="nx-kpi-card__hint">{kpi.hint}</div>
                  ) : (
                    <div className="nx-kpi-card__hint">Live module signal</div>
                  )}
                </article>
              ))}
            </div>
          ) : null}

          <div className="nx-grid nx-grid--3">
            {cards.map((card) => (
              <article key={card.title} className="nx-card">
                <div className="nx-card__top">
                  <span className="nx-badge">{badge}</span>
                </div>

                <h2 className="nx-card__title">{card.title}</h2>
                <p className="nx-card__text">{card.text}</p>

                {card.bullets?.length ? (
                  <ul className="nx-card__list">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                <span className="nx-card__link">
                  {card.linkLabel || "Open section →"}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </ModuleLayout>
  );
}