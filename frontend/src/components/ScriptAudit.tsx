import React, { useState } from "react";

type ScriptItem = {
  src: string | null;
  inline: boolean;
  async: boolean;
  defer: boolean;
  thirdParty: boolean;
};

type ScriptResult = {
  ok: boolean;
  url: string;
  totalScripts: number;
  externalScripts: number;
  inlineScripts: number;
  thirdPartyScripts: number;
  shopifyLikeScripts: number;
  scripts: ScriptItem[];
  recommendation: {
    reduceThirdParty: string;
    asyncDefer: string;
    shopifyApps: string;
  };
};

export default function ScriptAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScriptResult | null>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Merci d’entrer une URL (ex: https://kuryz.ca).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const text = await response.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Réponse Scripts non-JSON :", text);
        setError("Réponse non valide du backend (scripts).");
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error || "Erreur lors de l'analyse des scripts.");
        return;
      }

      setResult(data as ScriptResult);
    } catch (err) {
      console.error(err);
      setError("Impossible de joindre l'API scripts.");
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers pour les stats avancées ----------------------

  const getBlockingCount = (scripts: ScriptItem[]) =>
    scripts.filter((s) => !s.async && !s.defer).length;

  const getDuplicateCount = (scripts: ScriptItem[]) => {
    const counts = new Map<string, number>();
    scripts.forEach((s) => {
      if (!s.src) return;
      const key = s.src;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    let duplicates = 0;
    for (const [, count] of counts) {
      if (count > 1) {
        duplicates += count - 1;
      }
    }
    return duplicates;
  };

  // ----------------------------------------------------------

  return (
    <div className="card">
      <h1>Audit Scripts & Apps (JS)</h1>

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
        {loading ? "Analyse des scripts..." : "Analyser les scripts"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="results" style={{ marginTop: 16 }}>
          {/* Résumé global */}
          <p>
            <strong>URL :</strong> {result.url}
          </p>
          <p>
            <strong>Scripts totaux :</strong> {result.totalScripts}
          </p>
          <p>
            <strong>Externes :</strong> {result.externalScripts} |{" "}
            <strong>Inline :</strong> {result.inlineScripts}
          </p>
          <p>
            <strong>Scripts tiers :</strong> {result.thirdPartyScripts}
          </p>
          <p>
            <strong>Scripts liés à des apps Shopify :</strong>{" "}
            {result.shopifyLikeScripts}
          </p>

          {/* Stats avancées calculées côté frontend */}
          <div style={{ marginTop: 12 }}>
            <p>
              <strong>Scripts bloquants (sans async / defer) :</strong>{" "}
              {getBlockingCount(result.scripts)}
            </p>
            <p>
              <strong>Scripts doublons :</strong>{" "}
              {getDuplicateCount(result.scripts)}
            </p>
          </div>

          {/* Recommandations générales (backend) */}
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontWeight: 600 }}>🔥 Recommandations générales</h3>
            <ul>
              <li>{result.recommendation.reduceThirdParty}</li>
              <li>{result.recommendation.asyncDefer}</li>
              <li>{result.recommendation.shopifyApps}</li>
            </ul>
          </div>

          {/* Recos dynamiques calculées côté frontend */}
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontWeight: 600 }}>🎯 Actions NOXEL360 suggérées</h3>
            <ul>
              {getBlockingCount(result.scripts) > 0 && (
                <li>
                  ➡️ Convertir{" "}
                  <strong>{getBlockingCount(result.scripts)}</strong> script(s)
                  en <b>async</b> ou <b>defer</b> pour réduire le temps de
                  blocage.
                </li>
              )}

              {result.externalScripts > 15 && (
                <li>
                  ⚠️ Beaucoup de scripts externes (
                  <strong>{result.externalScripts}</strong>) — fusionner ou
                  supprimer ceux qui ne sont pas essentiels.
                </li>
              )}

              {getDuplicateCount(result.scripts) > 0 && (
                <li>
                  🪓 <strong>{getDuplicateCount(result.scripts)}</strong>{" "}
                  script(s) doublon(s) détecté(s) — vérifier les inclusions
                  multiples.
                </li>
              )}

              {result.shopifyLikeScripts > 5 && (
                <li>
                  🧩 Plusieurs scripts d’apps Shopify (
                  <strong>{result.shopifyLikeScripts}</strong>) — vérifier
                  quelles apps peuvent être désinstallées ou désactivées.
                </li>
              )}

              {getBlockingCount(result.scripts) === 0 &&
                getDuplicateCount(result.scripts) === 0 &&
                result.externalScripts <= 15 && (
                  <li>✅ Structure des scripts globalement saine.</li>
                )}
            </ul>
          </div>

          {/* Tableau lisible des scripts */}
          {result.scripts && result.scripts.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontWeight: 600 }}>📊 Scripts détectés</h3>
              <div style={{ overflowX: "auto", marginTop: 8 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "left",
                          padding: "4px 6px",
                        }}
                      >
                        Source
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "center",
                          padding: "4px 6px",
                        }}
                      >
                        Async
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "center",
                          padding: "4px 6px",
                        }}
                      >
                        Defer
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "center",
                          padding: "4px 6px",
                        }}
                      >
                        Type
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "center",
                          padding: "4px 6px",
                        }}
                      >
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.scripts.map((s, i) => {
                      const impact =
                        s.async || s.defer ? "🟢 OK" : "🔴 Bloquant";
                      const typeLabel = s.inline
                        ? "Inline"
                        : s.src && s.src.includes("shopify")
                        ? "Shopify / App"
                        : s.thirdParty
                        ? "Tiers"
                        : "Interne";

                      return (
                        <tr key={i}>
                          <td
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              padding: "4px 6px",
                              maxWidth: 280,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={s.src ?? "Inline script"}
                          >
                            {s.inline ? "Inline script" : s.src}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              textAlign: "center",
                              padding: "4px 6px",
                            }}
                          >
                            {s.async ? "✔️" : "—"}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              textAlign: "center",
                              padding: "4px 6px",
                            }}
                          >
                            {s.defer ? "✔️" : "—"}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              textAlign: "center",
                              padding: "4px 6px",
                            }}
                          >
                            {typeLabel}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              textAlign: "center",
                              padding: "4px 6px",
                            }}
                          >
                            {impact}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


