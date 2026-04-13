export default function SocialPage() {
  return (
    <div className="nx-landing-page">
      <header className="nx-landing-hero">
        <div className="nx-landing-hero__content">
          <div className="nx-kicker">NOXEL360</div>
          <h1 className="nx-landing-title">NOXEL SOCIAL</h1>
          <p className="nx-landing-lead">
            Social presence, content, and audience intelligence.
          </p>

          <div className="nx-landing-meta">
            <span className="nx-pill nx-pill--intel">SOCIAL</span>
            <span className="nx-pill">ACTIVE</span>
          </div>
        </div>
      </header>

      <section className="nx-landing-grid" aria-label="Social overview">
        <article className="nx-landing-card nx-landing-card--why">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◎</span>
            <h2 className="nx-landing-card__title">Purpose</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Social is the audience and content intelligence layer of NOXEL360.
            </p>
            <p className="nx-landing-paragraph">
              It is designed to connect visibility, engagement, platform presence,
              and future content operations in one structured system.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--capabilities">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◆</span>
            <h2 className="nx-landing-card__title">Capabilities</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-minihead">Content Intelligence</div>
            <div className="nx-landing-bullet">• Social presence tracking</div>
            <div className="nx-landing-bullet">• Audience and engagement reading</div>
            <div className="nx-landing-bullet">• Structured content planning support</div>

            <div className="nx-landing-minihead">Audience Growth</div>
            <div className="nx-landing-bullet">• Future content strategy guidance</div>
            <div className="nx-landing-bullet">• Multi-platform insight alignment</div>
            <div className="nx-landing-bullet">• Foundation for audience intelligence flows</div>
          </div>
        </article>

        <article className="nx-landing-card">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">•</span>
            <h2 className="nx-landing-card__title">Current State</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              Social is now connected as a live module entry point.
            </p>
            <p className="nx-landing-paragraph">
              The next step is to plug platform data, content views, and future
              planning workflows into the interface.
            </p>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--connections">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">↔</span>
            <h2 className="nx-landing-card__title">Connections</h2>
          </div>
          <div className="nx-landing-card__body">
            <div className="nx-landing-bullet">• Analytics for engagement and performance reading</div>
            <div className="nx-landing-bullet">• CRM for audience-to-customer continuity</div>
            <div className="nx-landing-bullet">• Nexus for language and cultural adaptation</div>
            <div className="nx-landing-bullet">• Maestro for workflow orchestration across channels</div>
          </div>
        </article>

        <article className="nx-landing-card nx-landing-card--reserved">
          <div className="nx-landing-card__head">
            <span className="nx-landing-card__icon">◌</span>
            <h2 className="nx-landing-card__title">Module Space</h2>
          </div>
          <div className="nx-landing-card__body">
            <p className="nx-landing-paragraph">
              This space is now reserved for the real Social interface:
              presence tracking, engagement reading, content planning,
              and future audience intelligence workflows.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
