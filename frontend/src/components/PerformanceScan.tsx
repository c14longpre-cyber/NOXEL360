import React, { useState } from "react";

type PageSpeedInfo = {
  performanceScore: number;
  lcp: string;
  cls: string;
  tbt: string;
  strategy: string;
} | null;

type ImageItem = {
  src: string;
  alt: string | null;
  isWebP: boolean;
  hasAlt: boolean;
};

type PerformanceScanResult = {
  ok: boolean;
  url: string;
  strategy: string;
  pageSpeed: PageSpeedInfo;
  imagesFound: number;
  imagesNonWebP: number;
  imagesMissingAlt: number;
  imageList: ImageItem[];
  recommendation: {
    convertImages: string;
    improveLCP: string;
    lazyAdvice: string;
  };
};

export default function PerformanceScan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PerformanceScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy: "mobile" }),
      });

      const text = await response.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Réponse non-JSON :", text);
        setError("Réponse non valide du backend (performance).");
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error || "Erreur lors de l'analyse performance.");
        return;
      }

      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError("Impossible de joindre l'API performance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h1>Audit Performance B+ (images & WebP)</h1>

      <div className="form-group">
        <label>URL à analyser</label>
        <input
          placeholder="ex: https://kuryz.ca"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <button
        className="button-primary"
        onClick={handleScan}
        disabled={loading}
      >
        {loading ? "Analyse en cours..." : "Analyser la performance"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="results">
          <p>
            <strong>URL :</strong> {result.url}
          </p>

          {result.pageSpeed && (
            <>
              <p>
                <strong>Score PageSpeed :</strong>{" "}
                {Math.round(result.pageSpeed.performanceScore * 100)} / 100
              </p>
              <p>
                <strong>LCP :</strong> {result.pageSpeed.lcp}
              </p>
              <p>
                <strong>CLS :</strong> {result.pageSpeed.cls}
              </p>
              <p>
                <strong>TBT :</strong> {result.pageSpeed.tbt}
              </p>
            </>
          )}

          <p>
            <strong>Images détectées :</strong> {result.imagesFound}
          </p>
          <p>
            <strong>Images non WebP :</strong> {result.imagesNonWebP}
          </p>
          <p>
            <strong>Images sans ALT :</strong> {result.imagesMissingAlt}
          </p>

          <h2 style={{ fontWeight: 600, marginTop: 12 }}>🔥 Recommandations</h2>
          <ul>
            <li>{result.recommendation.convertImages}</li>
            <li>{result.recommendation.improveLCP}</li>
            <li>{result.recommendation.lazyAdvice}</li>
          </ul>

          {result.imageList && result.imageList.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <strong>Images principales à optimiser :</strong>
              <div className="image-grid">
                {result.imageList.map((img, i) => (
                  <div key={i} className="image-card">
                    <div className="image-card__preview">
                      <img src={img.src} alt={img.alt || ""} />
                    </div>
                    <div>
                      <div>
                        {img.isWebP ? "✅ Format WebP" : "⚠️ Format non-WebP"}
                      </div>
                      <div>
                        {img.hasAlt ? "✅ ALT présent" : "⚠️ ALT manquant"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
