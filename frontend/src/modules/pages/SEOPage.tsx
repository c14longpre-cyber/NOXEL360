import { useState } from "react";
import { useSeo } from "../../modules/seo/useSeo";
import "@/styles/noxel-standard.css";

export default function SEOPage() {
  const [url, setUrl] = useState("https://example.com");
  const { data, loading, error, run } = useSeo(url);

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="nx-kicker" style={{ marginBottom: 8 }}>NOXEL360</div>
        <h1 className="nx-title-xl" style={{ marginBottom: 10 }}>NOXEL SEO</h1>
        <p className="nx-text" style={{ maxWidth: 720 }}>
          Search visibility, audits, performance signals, and optimization intelligence.
        </p>
      </div>

      <div className="nx-card" style={{ padding: "20px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ padding: 12, minWidth: 340, borderRadius: 12 }}
          />
          <button className="nx-pill" onClick={() => void run(url)}>
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      </div>

      {data && (
        <>
          <div className="nx-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <div className="nx-card"><strong>Health</strong><h2>{data.healthScore ?? "-"}</h2></div>
            <div className="nx-card"><strong>SEO</strong><h2>{data.scores?.seo ?? "-"}</h2></div>
            <div className="nx-card"><strong>Performance</strong><h2>{data.scores?.performance ?? "-"}</h2></div>
            <div className="nx-card"><strong>Accessibility</strong><h2>{data.scores?.accessibility ?? "-"}</h2></div>
            <div className="nx-card"><strong>Best Practices</strong><h2>{data.scores?.bestPractices ?? "-"}</h2></div>
          </div>

          <div className="nx-card" style={{ padding: "20px 24px", marginTop: 18 }}>
            <h3>Issues</h3>
            <p>Critical: {data.issuesCount?.critical ?? 0}</p>
            <p>Warnings: {data.issuesCount?.warning ?? 0}</p>
            <p>Info: {data.issuesCount?.info ?? 0}</p>
          </div>
        </>
      )}
    </div>
  );
}
