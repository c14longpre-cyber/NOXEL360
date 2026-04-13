export default function LinksPage() {
  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">NOXEL LINKS</h1>
          <p className="nx-landing-lead">
            Link structure, hygiene, and opportunity management.
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">LINKS</span>
            <span className="nx-pill">ACTIVE</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Links overview">
        <article className="nx-landing-card nx-landing-card--why">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◎</span>
            <h2 className="nx-landing-card__title">Purpose</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Links gives visibility into internal structure, redirects, broken
              paths, and strategic link opportunities.
            </p>
            <p className="nx-landing-paragraph">
              It helps transform scattered URL logic into a clean, intentional,
              performance-ready link ecosystem.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--capabilities">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◆</span>
            <h2 className="nx-landing-card__title">Capabilities</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-minihead">Structure Hygiene</div>
            <div className="nx-landing-bullet">• Broken link and redirect visibility</div>
            <div className="nx-landing-bullet">• Internal structure validation</div>
            <div className="nx-landing-bullet">• Path consistency review</div>

            <div className="nx-landing-minihead">Opportunity Management</div>
            <div className="nx-landing-bullet">• Link opportunity discovery</div>
            <div className="nx-landing-bullet">• Structural improvement planning</div>
            <div className="nx-landing-bullet">• Navigation and authority flow support</div>
          </div>
        </article>

        <article className="nx-landing-card">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">•</span>
            <h2 className="nx-landing-card__title">Current State</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Links is now connected as a live module entry point.
            </p>
            <p className="nx-landing-paragraph">
              The next step is to plug in scans, redirect logic, and structural
              reports.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--connections">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">↔</span>
            <h2 className="nx-landing-card__title">Connections</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-bullet">• SEO for technical and structural visibility</div>
            <div className="nx-landing-bullet">• Analytics for path and behavior measurement</div>
            <div className="nx-landing-bullet">• Flow for routing consistency across systems</div>
            <div className="nx-landing-bullet">• Maestro for orchestration and action logic</div>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--reserved">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◌</span>
            <h2 className="nx-landing-card__title">Module Space</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              This space is now reserved for the real Links interface:
              structure maps, redirect audits, broken path reports, and future
              opportunity-driven link intelligence.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
