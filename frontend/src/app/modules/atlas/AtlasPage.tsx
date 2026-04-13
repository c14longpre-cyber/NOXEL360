export default function AtlasPage() {
  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">NOXEL ATLAS</h1>
          <p className="nx-landing-lead">
            Geographic intelligence and market mapping.
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">ATLAS</span>
            <span className="nx-pill">ACTIVE</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Atlas overview">
        <article className="nx-landing-card nx-landing-card--why">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◎</span>
            <h2 className="nx-landing-card__title">Purpose</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Atlas transforms geographic data into usable market intelligence.
            </p>
            <p className="nx-landing-paragraph">
              It helps visualize regions, compare territories, and identify where opportunity lives.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--capabilities">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◆</span>
            <h2 className="nx-landing-card__title">Capabilities</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-minihead">Geographic Intelligence</div>
            <div className="nx-landing-bullet">• Country, region, and zone comparison</div>
            <div className="nx-landing-bullet">• Market visibility mapping</div>
            <div className="nx-landing-bullet">• Audience distribution analysis</div>

            <div className="nx-landing-minihead">Strategic Reading</div>
            <div className="nx-landing-bullet">• Opportunity detection by territory</div>
            <div className="nx-landing-bullet">• Local performance interpretation</div>
            <div className="nx-landing-bullet">• Expansion support through visual insight</div>
          </div>
        </article>

        <article className="nx-landing-card">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">•</span>
            <h2 className="nx-landing-card__title">Current State</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Atlas is now connected as a live module entry point.
            </p>
            <p className="nx-landing-paragraph">
              The next step is to plug in the map, filters, and overlays.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--connections">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">↔</span>
            <h2 className="nx-landing-card__title">Connections</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-bullet">• Analytics for geographic performance reading</div>
            <div className="nx-landing-bullet">• SEO for local ranking intelligence</div>
            <div className="nx-landing-bullet">• Nexus for language and cultural overlays</div>
            <div className="nx-landing-bullet">• Maestro for orchestration across modules</div>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--reserved">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◌</span>
            <h2 className="nx-landing-card__title">Module Space</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              This space is now reserved for the real Atlas interface:
              interactive map, layers, compare mode, and future market overlays.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
