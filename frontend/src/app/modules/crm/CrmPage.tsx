export default function CrmPage() {
  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">NOXEL CRM</h1>
          <p className="nx-landing-lead">
            Customer relationship and lifecycle intelligence.
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">CRM</span>
            <span className="nx-pill">ACTIVE</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="CRM overview">
        <article className="nx-landing-card nx-landing-card--why">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◎</span>
            <h2 className="nx-landing-card__title">Purpose</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              CRM centralizes customer relationships, pipeline visibility, and
              lifecycle intelligence inside NOXEL360.
            </p>
            <p className="nx-landing-paragraph">
              It is designed to connect sales, support, follow-up, and customer
              context in one structured system.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--capabilities">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◆</span>
            <h2 className="nx-landing-card__title">Capabilities</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-minihead">Relationship Management</div>
            <div className="nx-landing-bullet">• Lead and client record tracking</div>
            <div className="nx-landing-bullet">• Contact history and interaction context</div>
            <div className="nx-landing-bullet">• Structured follow-up flow</div>

            <div className="nx-landing-minihead">Lifecycle Intelligence</div>
            <div className="nx-landing-bullet">• Pipeline stage visibility</div>
            <div className="nx-landing-bullet">• Retention and conversion support</div>
            <div className="nx-landing-bullet">• Opportunity prioritization</div>
          </div>
        </article>

        <article className="nx-landing-card">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">•</span>
            <h2 className="nx-landing-card__title">Current State</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              CRM is now connected as a live module entry point.
            </p>
            <p className="nx-landing-paragraph">
              The next step is to plug real records, pipelines, automations,
              and client views.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--connections">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">↔</span>
            <h2 className="nx-landing-card__title">Connections</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-bullet">• Analytics for behavior and value insight</div>
            <div className="nx-landing-bullet">• Social for audience-to-lead continuity</div>
            <div className="nx-landing-bullet">• Maestro for workflow orchestration</div>
            <div className="nx-landing-bullet">• Morph for adaptive customer experience</div>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--reserved">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◌</span>
            <h2 className="nx-landing-card__title">Module Space</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              This space is now reserved for the real CRM interface:
              customer records, lifecycle tracking, pipeline boards,
              automations, and future client-facing portal tools.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
