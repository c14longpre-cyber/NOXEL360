import React, { useState } from "react";
import { tierLogos } from "../tierLogos";

type TierName = "bronze" | "argent" | "or" | "platine" | "diamant";

type LinkSample = {
  href: string;
  text: string;
  rel: string | null;
  internal: boolean;
  status: number | null;
  isBroken: boolean;
  isRedirect: boolean;
};

type ResultType = {
  ok: boolean;
  url: string;
  title: string | null;
  description: string | null;
  h1: string[];
  wordCount: number;
  score: number;
  suggestions: string[];
  // Structure & images
  h2Count: number;
  h3Count: number;
  images: number;
  missingAlt: number;
  // Liens
  links: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  sampleLinks: LinkSample[];
  // Balises avancées
  canonical: string | null;
  ogTitle: string | null;
  ogImage: string | null;
  strategy?: string;
};

function LogoNiveau({ plan }: { plan: TierName }) {
  const logo = tierLogos[plan];

  return (
    <picture>
      <source srcSet={logo.webp} type="image/webp" />
      <img
        src={logo.webp}
        alt={`Niveau ${plan}`}
        width={200}
        height={200}
        style={{ display: "block" }}
      />
    </picture>
  );
}

export default function AnalyseurSEO() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!url.trim()) {
      setError("Merci d’entrer une URL (ex: kuryz.ca).");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy }),
      });

      const text = await response.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Réponse non-JSON :", text);
        setError(
          "Le backend ne renvoie pas du JSON. Vérifie l’URL de l’API (port 4000)."
        );
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error || "Erreur lors de l'analyse.");
        return;
      }

      setResult(data as ResultType);
    } catch (err) {
      console.error(err);
      setError("Impossible de joindre l'API (backend).");
    } finally {
      setLoading(false);
    }
  };

  // pour l’instant, on affiche Platine en dur.
  const currentPlan: TierName = "platine";

  return (
    <div className="card">
      {/* Header Noxel360 + logo de niveau */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div>
          <h1>Noxel360 — Analyse SEO d’une page</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
            Module 1 — Audit structure & contenu · Module 2 — Liens & erreurs
          </p>
          <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
            Niveau actuel :{" "}
            <strong style={{ textTransform: "uppercase" }}>
              {currentPlan}
            </strong>
          </p>
        </div>
        <LogoNiveau plan={currentPlan} />
      </div>

      {/* Formulaire */}
      <div className="form-group">
        <label>URL à analyser</label>
        <input
          placeholder="ex: kuryz.ca ou https://kuryz.ca"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Stratégie</label>
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
        onClick={handleAnalyse}
        disabled={loading}
      >
        {loading ? "Analyse en cours..." : "Analyser la page"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="results">
          {/* Résumé SEO de base */}
          <h3 style={{ marginTop: 10, marginBottom: 4 }}>Résumé de la page</h3>
          <p>
            <strong>URL :</strong> {result.url}
          </p>
          <p>
            <strong>Title :</strong> {result.title || "Non défini"}
          </p>
          <p>
            <strong>Meta description :</strong>{" "}
            {result.description || "Non définie"}
          </p>
          <p>
            <strong>H1 :</strong>{" "}
            {result.h1.length ? result.h1.join(", ") : "Aucun"}
          </p>
          <p>
            <strong>Nombre de mots :</strong> {result.wordCount}
          </p>
          <p>
            <strong>Score SEO :</strong> {result.score}/100
          </p>

          {/* Structure titres & images */}
          <div style={{ marginTop: 10 }}>
            <h3 style={{ marginBottom: 4 }}>Structure & contenu</h3>
            <p>
              <strong>H2 :</strong> {result.h2Count} •{" "}
              <strong>H3 :</strong> {result.h3Count}
            </p>
            <p>
              <strong>Images :</strong> {result.images} •{" "}
              <strong>Images sans ALT :</strong> {result.missingAlt}
            </p>
          </div>

          {/* MODULE LIENS + BROKEN LINKS */}
          <div style={{ marginTop: 10 }}>
            <h3 style={{ marginBottom: 4 }}>Liens internes, externes & 404</h3>
            <p>
              <strong>Liens totaux :</strong> {result.links}
            </p>
            <p>
              <strong>Liens internes :</strong> {result.internalLinks} •{" "}
              <strong>Liens externes :</strong> {result.externalLinks}
            </p>
            <p>
              <strong>Liens nofollow :</strong> {result.nofollowLinks}
            </p>
            <p>
              <strong>Liens cassés (4xx/5xx) :</strong>{" "}
              {result.brokenLinks > 0 ? (
                <span style={{ color: "#b91c1c", fontWeight: 600 }}>
                  {result.brokenLinks}
                </span>
              ) : (
                "0"
              )}
            </p>
            <p>
              <strong>Liens en redirection (3xx) :</strong>{" "}
              {result.redirectLinks}
            </p>

            {result.sampleLinks && result.sampleLinks.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <strong>Exemples de liens vérifiés :</strong>
                <ul>
                  {result.sampleLinks.map((link, i) => {
                    let icon = link.internal ? "🏠" : "🌐";
                    let statusLabel = "";
                    let statusColor = "#059669"; // vert OK

                    if (link.isBroken) {
                      icon = "❌";
                      statusLabel = link.status
                        ? ` (${link.status})`
                        : " (erreur)";
                      statusColor = "#b91c1c";
                    } else if (link.isRedirect) {
                      icon = "↪";
                      statusLabel = link.status ? ` (${link.status})` : "";
                      statusColor = "#d97706";
                    } else if (link.status) {
                      statusLabel = ` (${link.status})`;
                    }

                    return (
                      <li key={i}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span>{icon}</span>
                          <span title={link.href}>
                            {link.text || "(sans texte)"} —{" "}
                            <code style={{ fontSize: "0.75rem" }}>
                              {link.href}
                            </code>
                          </span>
                          {link.rel && (
                            <span style={{ color: "#6b7280", fontSize: 11 }}>
                              ({link.rel.toLowerCase()})
                            </span>
                          )}
                          {link.status !== null && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 11,
                                color: statusColor,
                              }}
                            >
                              {statusLabel}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Balises avancées */}
          <div style={{ marginTop: 10 }}>
            <h3 style={{ marginBottom: 4 }}>Balises avancées</h3>
            <p>
              <strong>Canonical :</strong>{" "}
              {result.canonical || "Non définie"}
            </p>
            <p>
              <strong>Open Graph title :</strong>{" "}
              {result.ogTitle || "Non défini"}
            </p>
            <p>
              <strong>Open Graph image :</strong>{" "}
              {result.ogImage || "Non définie"}
            </p>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <h3 style={{ marginBottom: 4 }}>Suggestions Noxel360</h3>
              <ul>
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


