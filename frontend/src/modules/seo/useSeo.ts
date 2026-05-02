import { useCallback, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export function useSeo(initialUrl: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (targetUrl = initialUrl) => {
    if (!targetUrl.trim()) return;

    if (!API_BASE) {
      setError("VITE_API_URL is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = `/api/seo/vm/summary?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(endpoint, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        throw new Error(`SEO scan failed (${res.status})`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "SEO scan failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [initialUrl]);

  useEffect(() => {
    void run(initialUrl);
  }, []);

  return { data, loading, error, run };
}
