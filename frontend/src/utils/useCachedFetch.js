import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// utils/useCachedFetch.js or a separate utils/cacheUtils.js
export function clearCache(keys = [], matchPatterns = []) {
  // Remove known cache keys
  keys.forEach((key) => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_at`);
  });

  // Remove dynamic keys using prefix matching
  Object.keys(localStorage).forEach((key) => {
    matchPatterns.forEach((pattern) => {
      if (key.startsWith(pattern)) {
        localStorage.removeItem(key);
      }
    });
  });
}

export function useCachedFetch(url, cacheKey, cacheMinutes = 10, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFresh = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, { ...options, headers });

      if (res.status === 401) {
        localStorage.removeItem("token");
        clearCache([cacheKey]);
        alert("Session expired. Please log in again.");
        navigate("/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Fetch failed: ${res.status} - ${errText}`);
      }

      const result = await res.json();
      setData(result);
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(`${cacheKey}_at`, Date.now());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    const cachedAt = localStorage.getItem(`${cacheKey}_at`);
    const isFresh = cached && cachedAt &&
      (Date.now() - Number(cachedAt) < cacheMinutes * 60 * 1000);

    if (isFresh) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchFresh().finally(() => setLoading(false));
    }
  }, [url, cacheKey, cacheMinutes, JSON.stringify(options), navigate]);

  return { data, loading, refresh: fetchFresh };
}