/**
 * Glass-morphism search bar with autocomplete for city search.
 */
import { useEffect, useState } from "react";
import type { GeoResult } from "./types";
import { SkeletonLoader } from "./SkeletonLoader";

interface SearchBarProps {
  onSelect: (city: GeoResult) => void;
}

interface ApiGeoResponse {
  results?: {
    id?: number;
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }[];
}

const RECENT_LIMIT = 5;

/** Builds gradient background based on a simple temperature heuristic. */
export function backgroundForTemp(temp: number | null): string {
  if (temp == null) return "from-slate-800/70 via-slate-900/70 to-black/80";
  if (temp >= 28) return "from-orange-500/70 via-rose-500/60 to-amber-500/60";
  if (temp >= 18) return "from-sky-500/60 via-indigo-500/60 to-blue-600/60";
  if (temp <= 0) return "from-slate-100/70 via-sky-200/70 to-blue-300/60";
  return "from-emerald-500/60 via-blue-500/60 to-indigo-600/60";
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<GeoResult[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem("weather_recent_cities");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as GeoResult[];
        setRecent(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          console.warn("Search API returned non-OK", res.status);
          return;
        }
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          console.warn("Search API did not return JSON", contentType);
          return;
        }
        const data = (await res.json()) as ApiGeoResponse;
        const mapped: GeoResult[] = (data.results ?? []).map((r) => ({
          id: `${r.name}-${r.latitude}-${r.longitude}`,
          name: r.name,
          country: r.country,
          lat: r.latitude,
          lon: r.longitude,
        }));
        setResults(mapped);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSelect = (city: GeoResult) => {
    onSelect(city);
    setQuery(city.name);
    setResults([]);
    const updated = [city, ...recent.filter((r) => r.id !== city.id)].slice(0, RECENT_LIMIT);
    setRecent(updated);
    window.localStorage.setItem("weather_recent_cities", JSON.stringify(updated));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 shadow-xl shadow-sky-900/40 backdrop-blur-xl">
        <span className="text-lg">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="flex-1 bg-transparent text-sm text-slate-50 placeholder:text-slate-500 outline-none"
        />
        {loading && <SkeletonLoader className="h-4 w-10" />}
      </div>

      {recent.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          {recent.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              className="rounded-full bg-slate-800/60 px-3 py-1 text-slate-100 shadow-sm shadow-sky-900/40 hover:bg-slate-700/80"
            >
              {city.name}
              {city.country ? `, ${city.country}` : ""}
            </button>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-1 space-y-1 rounded-2xl bg-slate-900/80 p-2 text-sm text-slate-100 shadow-lg shadow-sky-900/40">
          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-800/80"
            >
              <span>
                {city.name}
                {city.country ? `, ${city.country}` : ""}
              </span>
              <span className="text-xs text-slate-400">
                {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
