import React, { useState } from "react";
import axios from "axios";

export default function AnalyseurSEO() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur("");
    try {
      const response = await axios.post("http://localhost:4000/api/analyze", { url });
      setResult(response.data);
    } catch (err) {
      setErreur("Erreur lors de l’analyse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Analyse SEO d’une page</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemple.com"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Analyser
        </button>
      </form>

      {loading && <p>Analyse en cours...</p>}
      {erreur && <p className="text-red-600">{erreur}</p>}

      {result && (
        <div className="mt-4">
          <h2 className="font-semibold">Titre:</h2>
          <p>{result.title || "(aucun)"}</p>

          <h2 className="font-semibold mt-2">Description:</h2>
          <p>{result.description || "(aucune)"}</p>

          <h2 className="font-semibold mt-2">Nombre de mots:</h2>
          <p>{result.wordCount}</p>

          <h2 className="font-semibold mt-2">Score:</h2>
          <p>{result.score}/100</p>

          <h2 className="font-semibold mt-2">Suggestions:</h2>
          <ul className="list-disc ml-5">
            {result.suggestions.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {result.performance && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">📊 Performance PageSpeed</h2>
              <p><strong>Score:</strong> {result.performance.performanceScore * 100}/100</p>
              <p><strong>LCP:</strong> {result.performance.lcp}</p>
              <p><strong>CLS:</strong> {result.performance.cls}</p>
              <p><strong>TBT:</strong> {result.performance.tbt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
