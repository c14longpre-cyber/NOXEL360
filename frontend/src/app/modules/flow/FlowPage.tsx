export default function FlowPage() {
  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">NOXEL FLOW</h1>
          <p className="nx-landing-lead">
            Theme, layout, and presentation system.
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">FLOW</span>
            <span className="nx-pill">ACTIVE</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Flow overview">
        <article className="nx-landing-card nx-landing-card--why">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◎</span>
            <h2 className="nx-landing-card__title">Purpose</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Flow is the visual and structural delivery layer of NOXEL360.
            </p>
            <p className="nx-landing-paragraph">
              It organizes themes, layouts, reusable presentation logic, and
              future distribution-ready design systems.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--capabilities">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◆</span>
            <h2 className="nx-landing-card__title">Capabilities</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-minihead">System Design</div>
            <div className="nx-landing-bullet">• Theme architecture and reusable structures</div>
            <div className="nx-landing-bullet">• Layout consistency across modules</div>
            <div className="nx-landing-bullet">• Presentation standardization</div>

            <div className="nx-landing-minihead">Scalable Delivery</div>
            <div className="nx-landing-bullet">• Distribution-ready UI foundations</div>
            <div className="nx-landing-bullet">• Future template and package logic</div>
            <div className="nx-landing-bullet">• Cohesive visual deployment at scale</div>
          </div>
        </article>

        <article className="nx-landing-card">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">•</span>
            <h2 className="nx-landing-card__title">Current State</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Flow is now connected as a live module entry point.
            </p>
            <p className="nx-landing-paragraph">
              The next step is to plug in the real theme engine, component
              registry, and distribution workflow.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--connections">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">↔</span>
            <h2 className="nx-landing-card__title">Connections</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-bullet">• Morph for adaptive visual behavior</div>
            <div className="nx-landing-bullet">• Optima for media and asset efficiency</div>
            <div className="nx-landing-bullet">• Maestro for orchestration of delivery logic</div>
            <div className="nx-landing-bullet">• Analytics for layout and experience performance</div>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--reserved">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◌</span>
            <h2 className="nx-landing-card__title">Module Space</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              This space is now reserved for the real Flow interface:
              themes, structural systems, layout packs, component distribution,
              and future deployable presentation products.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
