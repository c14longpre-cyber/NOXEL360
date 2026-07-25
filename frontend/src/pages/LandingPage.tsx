import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="noxel-landing">
      <nav className="nl-nav">
        <Link to="/" className="logo">
          <img src="/favicon-192x192.png" alt="NOXEL360" />
          NOXEL360
        </Link>
        <div className="nav-links">
          <a href="#modules">Modules</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/learn">Learn</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <Link to="/dashboard" className="nav-cta">Open Dashboard</Link>
      </nav>

      <main>
        <div className="hero">
          <div className="wrap">
            <div className="eyebrow">🧩 Built Beyond.</div>
            <h1>
              One account.<br />
              Three connected modules.<br />
              <span className="accent">Zero juggling tools.</span>
            </h1>
            <p className="lead">
              NOXEL360 is the modular suite for anyone building online — solopreneurs, small teams,
              and agencies managing clients — who need search visibility, verified backlinks, and
              language intelligence without stitching together five separate subscriptions to get it.
            </p>
            <div className="hero-ctas">
              <Link to="/dashboard" className="btn-primary">Open Your Dashboard →</Link>
              <a href="#modules" className="btn-secondary">See the Modules</a>
            </div>
            <div className="trust-row">
              <div><strong>3</strong> connected modules</div>
              <div><strong>1</strong> shared account, one login</div>
              <div><strong>115</strong> languages supported across the ecosystem</div>
            </div>
          </div>
        </div>

        <section id="modules">
          <div className="wrap">
            <div className="section-tag">NOXEL Modules</div>
            <h2 className="section-title">Specialized tools, built to ship one by one.</h2>
            <p className="section-lead">
              Each module stands completely on its own. Enable only what you need today — the rest
              plugs in later without refactoring anything.
            </p>

            <div className="modules-grid">
              <div className="module-card">
                <span className="icon">🔍</span>
                <div className="module-top">
                  <h3>NOXEL SEO</h3>
                  <span className="badge live">LIVE</span>
                </div>
                <p>Search visibility, technical audits, and AI-powered optimization intelligence.</p>
                <ul>
                  <li>Automated site audits, 50+ signals</li>
                  <li>AI Copilot for plain-language fixes</li>
                  <li>Google Search Console integration</li>
                </ul>
                <a href="https://noxelseo.com" className="module-link">Open NOXEL SEO <span className="arrow">→</span></a>
              </div>

              <div className="module-card">
                <span className="icon">🔗</span>
                <div className="module-top">
                  <h3>NOXEL Forge</h3>
                  <span className="badge live">LIVE</span>
                </div>
                <p>A verified backlink exchange network for real, trusted sites — not a link farm.</p>
                <ul>
                  <li>AI-reviewed submissions, every time</li>
                  <li>Trust-scored member network</li>
                  <li>Screened against spam and thin content</li>
                </ul>
                <a href="https://noxelforge.com" className="module-link">Open NOXEL Forge <span className="arrow">→</span></a>
              </div>

              <div className="module-card">
                <span className="icon">🌐</span>
                <div className="module-top">
                  <h3>NOXEL Nexus</h3>
                  <span className="badge core">CORE</span>
                </div>
                <p>The language, region, and cultural intelligence engine underneath the ecosystem.</p>
                <ul>
                  <li>Detects visitor language & region</li>
                  <li>Adapts content automatically</li>
                  <li>Runs quietly under every module</li>
                </ul>
                <Link to="/dashboard" className="module-link">Included with your account <span className="arrow">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="wrap">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Sign in once. Use what you need.</h2>
            <p className="section-lead">No separate billing relationships, no re-entering your business details three times over.</p>

            <div className="how-grid">
              <div className="how-step">
                <span className="num">STEP 1</span>
                <h4>Create one account</h4>
                <p>Your NOXEL360 account is the single login for every module in the ecosystem — present and future.</p>
              </div>
              <div className="how-step">
                <span className="num">STEP 2</span>
                <h4>Enable what you need</h4>
                <p>Start with NOXEL SEO, add NOXEL Forge when you're ready to build backlinks — activate modules on your own timeline.</p>
              </div>
              <div className="how-step">
                <span className="num">STEP 3</span>
                <h4>Everything stays connected</h4>
                <p>Nexus quietly adapts language and region across every module, so the experience stays consistent no matter which tool you're in.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="split">
              <div>
                <div className="section-tag">Why One Ecosystem</div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>
                  Built for everyone doing this without a five-figure budget.
                </h2>
                <p style={{ color: "var(--nl-muted)", fontSize: 16, lineHeight: 1.7 }}>
                  Most tools in this space are priced and built for marketing teams with headcount.
                  NOXEL360 works whether it's just you, a small team, or an agency running it across
                  a dozen client sites — enterprise-grade capability, without the enterprise price tag
                  or the five separate logins.
                </p>
                <ul className="checklist">
                  <li>One identity across every module — no context-switching between disconnected dashboards</li>
                  <li>Pay for what you actually use, module by module</li>
                  <li>New modules plug in without disrupting what already works</li>
                </ul>
              </div>
              <div className="split-visual">
                <div className="stat-row"><span className="label">Modules live today</span><span className="val">2 (SEO, Forge)</span></div>
                <div className="stat-row"><span className="label">Core intelligence layer</span><span className="val">Nexus</span></div>
                <div className="stat-row"><span className="label">Accounts required</span><span className="val">1</span></div>
                <div className="stat-row"><span className="label">Languages supported</span><span className="val">115</span></div>
                <div className="stat-row"><span className="label">Built for</span><span className="val">Everyone</span></div>
              </div>
            </div>
          </div>
        </section>

        <div className="final-cta">
          <div className="wrap">
            <h2>Ready to stop juggling tools?</h2>
            <p>Open your NOXEL360 dashboard and activate the modules you actually need — today.</p>
            <Link to="/dashboard" className="btn-primary">Open Your Dashboard →</Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-top">
            <p className="footer-desc">
              NOXEL360 connects NOXEL SEO, NOXEL Forge, and Nexus in one dashboard for search
              visibility, verified backlinks, and language intelligence.
            </p>
            <div className="footer-links">
              <a href="https://noxelseo.com">NOXEL SEO</a>
              <a href="https://noxelforge.com">NOXEL Forge</a>
              <Link to="/dashboard">NOXEL Nexus</Link>
              <Link to="/learn">Learn</Link>
              <Link to="/account">Account</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">© 2026 NOXEL360. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
