import { useEffect, useState } from "react";
import type { GeoResult } from "./types";

interface FavoriteApi {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

interface FavoritesListProps {
  onSelect: (city: GeoResult) => void;
}

export function FavoritesList({ onSelect }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteApi[]>([]);

  const loadFavorites = async () => {
    try {
      const res = await fetch("/api/weather/favorites");
      if (!res.ok) return;
      const data = (await res.json()) as FavoriteApi[];
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void loadFavorites();
  }, []);

  if (!favorites.length) return null;

  return (
    <section className="space-y-2 text-xs text-slate-200">
      <p className="font-medium text-slate-100">Favorites</p>
      <div className="flex flex-wrap gap-2">
        {favorites.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() =>
              onSelect({
                id: f.id,
                name: f.name,
                country: f.country,
                lat: f.lat,
                lon: f.lon,
              })
            }
            className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-100 shadow-sm shadow-sky-900/40 hover:border-sky-400/80"
          >
            {f.name}
            {f.country ? `, ${f.country}` : ""}
          </button>
        ))}
      </div>
    </section>
  );
}
