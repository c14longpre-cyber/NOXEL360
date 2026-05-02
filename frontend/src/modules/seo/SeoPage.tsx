import { useState } from "react";
import { useSeo } from "./useSeo";

export default function SeoPage() {
  const [url, setUrl] = useState("https://example.com");
  const { data, loading, error, run } = useSeo(url);

  return (
    <section className="nx-wrap">
      <div className="nx-hero">
        <div className="nx-kicker">NOXEL SEO</div>
        <h1 className="nx-title">Search visibility, audits, and optimization intelligence</h1>
        <p className="nx-subtitle">
          Analyze any website and get actionable SEO insights instantly.
        </p>
      </div>

      <div className="nx-card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ padding: 12, minWidth: 320, borderRadius: 12 }}
          />
          <button className="nx-pill" onClick={() => void run(url)}>
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      </div>

      {data && (
        <>
          <div className="nx-grid nx-grid--5">
            <div className="nx-card"><strong>Health</strong><h2>{data.healthScore ?? "-"}</h2></div>
            <div className="nx-card"><strong>SEO</strong><h2>{data.scores?.seo ?? "-"}</h2></div>
            <div className="nx-card"><strong>Performance</strong><h2>{data.scores?.performance ?? "-"}</h2></div>
            <div className="nx-card"><strong>Accessibility</strong><h2>{data.scores?.accessibility ?? "-"}</h2></div>
            <div className="nx-card"><strong>Best Practices</strong><h2>{data.scores?.bestPractices ?? "-"}</h2></div>
          </div>

          <div className="nx-grid nx-grid--5">
            <div className="nx-card"><strong>Critical</strong><h2>{data.issuesCount?.critical ?? 0}</h2></div>
            <div className="nx-card"><strong>Warnings</strong><h2>{data.issuesCount?.warning ?? 0}</h2></div>
            <div className="nx-card"><strong>Info</strong><h2>{data.issuesCount?.info ?? 0}</h2></div>
          </div>
        </>
      )}
    </section>
  );
}
