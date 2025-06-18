import { useEffect, useState } from "react";

export function useCachedFetch(url, cacheKey, cacheMinutes = 10, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const cached = localStorage.getItem(cacheKey);
    const cachedAt = localStorage.getItem(`${cacheKey}_at`);
    const isFresh =
      cached && cachedAt &&
      (Date.now() - Number(cachedAt) < cacheMinutes * 60 * 1000);

    if (isFresh) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      fetch(url, {
        ...options,
        headers,
      })
        .then(async (res) => {
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Fetch failed: ${res.status} - ${errText}`);
          }
          return res.json();
        })
        .then((result) => {
          setData(result);
          localStorage.setItem(cacheKey, JSON.stringify(result));
          localStorage.setItem(`${cacheKey}_at`, Date.now());
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [url, cacheKey, cacheMinutes, JSON.stringify(options)]);

  return { data, loading };
}
