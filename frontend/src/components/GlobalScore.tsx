import React, { useState } from "react";

type GlobalSummary = {
  url: string;
  seoScore: number;
  perfScore: number | null;
  imageScore: number | null;
  globalScore: number | null;
  seoSuggestions: string[];
  perfAdvice: string[];
  imageAdvice: string[];
};

export default function GlobalScore() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<GlobalSummary | null>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      // 1) Appel SEO
      const seoRes = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });

      const seoText = await seoRes.text();
      let seoData: any;
      try {
        seoData = JSON.parse(seoText);
      } catch {
        console.error("Réponse SEO non-JSON:", seoText);
        setError("Réponse SEO non valide.");
        return;
      }

      if (!seoRes.ok || !seoData.ok) {
        setError(seoData.error || "Erreur lors de l'analyse SEO.");
        return;
      }

      const seoScore: number = typeof seoData.score === "number"
        ? seoData.score
        : 0;

      // 2) Appel Performance
      const perfRes = await fetch("http://localhost:4000/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });

      const perfText = await perfRes.text();
      let perfData: any;
      try {
        perfData = JSON.parse(perfText);
      } catch {
        console.error("Réponse Performance non-JSON:", perfText);
        setError("Réponse Performance non valide.");
        return;
      }

      if (!perfRes.ok || !perfData.ok) {
        setError(perfData.error || "Erreur lors de l'analyse performance.");
        return;
      }

      // Score PageSpeed (0–1) → 0–100
      let perfScore: number | null = null;
      if (
        perfData.pageSpeed &&
        typeof perfData.pageSpeed.performanceScore === "number"
      ) {
        perfScore = Math.round(perfData.pageSpeed.performanceScore * 100);
      }

      // Score images (WebP + ALT)
      let imageScore: number | null = null;
      const totalImages: number = perfData.imagesFound || 0;
      const nonWebP: number = perfData.imagesNonWebP || 0;
      const missingAlt: number = perfData.imagesMissingAlt || 0;

      if (totalImages > 0) {
        const webpOK = (totalImages - nonWebP) / totalImages; // 0–1
        const altOK = (totalImages - missingAlt) / totalImages; // 0–1
        const raw = 0.5 * webpOK + 0.5 * altOK;
        imageScore = Math.round(raw * 100);
      } else {
        // pas d’images = pas de pénalité
        imageScore = 100;
      }

      // Score global pondéré
      let globalScore: number | null = null;
      let sum = 0;
      let weight = 0;

      if (!isNaN(seoScore)) {
        sum += seoScore * 0.4;
        weight += 0.4;
      }
      if (perfScore !== null) {
        sum += perfScore * 0.4;
        weight += 0.4;
      }
      if (imageScore !== null) {
        sum += imageScore * 0.2;
        weight += 0.2;
      }

      if (weight > 0) {
        globalScore = Math.round(sum / weight);
      }

      const seoSuggestions: string[] = Array.isArray(seoData.suggestions)
        ? seoData.suggestions
        : [];

      const perfAdvice: string[] = [];
      if (perfData.recommendation) {
        if (perfData.recommendation.improveLCP)
          perfAdvice.push(perfData.recommendation.improveLCP);
        if (perfData.recommendation.lazyAdvice)
          perfAdvice.push(perfData.recommendation.lazyAdvice);
      }

      const imageAdvice: string[] = [];
      if (nonWebP > 0) {
        imageAdvice.push(
          `${nonWebP} image(s) devraient être converties en WebP.`
        );
      }
      if (missingAlt > 0) {
        imageAdvice.push(
          `${missingAlt} image(s) n'ont pas de texte ALT descriptif.`
        );
      }

      setSummary({
        url: seoData.url || url,
        seoScore,
        perfScore,
        imageScore,
        globalScore,
        seoSuggestions,
        perfAdvice,
        imageAdvice,
      });
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue lors du scan global.");
    } finally {
      setLoading(false);
    }
  };

  const renderScorePill = (label: string, score: number | null, color: string) => {
    if (score === null || isNaN(score)) {
      return (
        <div className="score-pill score-pill--neutral">
          <span>{label}</span>
          <strong>N/A</strong>
        </div>
      );
    }

    return (
      <div className={`score-pill ${color}`}>
        <span>{label}</span>
        <strong>{score}/100</strong>
      </div>
    );
  };

  const renderBar = (score: number | null) => {
    if (score === null || isNaN(score)) {
      return (
        <div className="score-bar">
          <div className="score-bar__fill score-bar__fill--na" />
        </div>
      );
    }
    const width = Math.min(100, Math.max(0, score));
    return (
      <div className="score-bar">
        <div
          className={
            "score-bar__fill " +
            (score >= 80
              ? "score-bar__fill--good"
              : score >= 50
              ? "score-bar__fill--medium"
              : "score-bar__fill--bad")
          }
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <h1>Score global NOXEL360</h1>

      <div className="form-group">
        <label>URL à analyser</label>
        <input
          placeholder="ex: https://kuryz.ca"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Stratégie :</label>
        <select
          value={strategy}
          onChange={(e) =>
            setStrategy(e.target.value as "mobile" | "desktop")
          }
        >
          <option value="mobile">📱 Mobile</option>
          <option value="desktop">🖥 Desktop</option>
        </select>
      </div>

      <button
        className="button-primary"
        onClick={handleScan}
        disabled={loading}
      >
        {loading ? "Analyse globale..." : "Calculer le score global"}
      </button>

      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="results" style={{ marginTop: 14 }}>
          <p>
            <strong>URL :</strong> {summary.url}
          </p>

          <div className="global-score-grid">
            <div className="global-score-main">
              <p className="global-score-label">Score global NOXEL360</p>
              <p className="global-score-value">
                {summary.globalScore !== null
                  ? `${summary.globalScore}/100`
                  : "N/A"}
              </p>
              {renderBar(summary.globalScore)}
              <p className="global-score-hint">
                Pondération : SEO 40% • Performance 40% • Images 20%
              </p>
            </div>

            <div className="global-score-side">
              {renderScorePill("SEO", summary.seoScore, "score-pill--seo")}
              {renderScorePill(
                "Performance",
                summary.perfScore,
                "score-pill--perf"
              )}
              {renderScorePill(
                "Images",
                summary.imageScore,
                "score-pill--img"
              )}
            </div>
          </div>

          {/* Conseils condensés */}
          <div className="global-score-advice">
            {summary.seoSuggestions.length > 0 && (
              <div className="advice-block">
                <h3>SEO – Priorités</h3>
                <ul>
                  {summary.seoSuggestions.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {(summary.perfAdvice.length > 0 ||
              summary.imageAdvice.length > 0) && (
              <div className="advice-block">
                <h3>Performance & Images – Priorités</h3>
                <ul>
                  {summary.perfAdvice.slice(0, 2).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {summary.imageAdvice.slice(0, 2).map((s, i) => (
                    <li key={i + 100}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
