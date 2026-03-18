import { useEffect, useState } from "react";
import "./index.css";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeatherHero } from "./components/CurrentWeatherHero";
import type { CurrentConditions, GeoResult } from "./components/types";
import { SkeletonLoader } from "./components/SkeletonLoader";

interface OpenMeteoResponse {
  hourly?: {
    time: string[];
    temperature_2m: number[];
    windspeed_10m?: number[];
    relativehumidity_2m?: number[];
  };
}

function extractCurrentConditions(
  city: GeoResult,
  data: OpenMeteoResponse | null
): CurrentConditions {
  const temp = data?.hourly?.temperature_2m?.[0] ?? null;
  const wind = data?.hourly?.windspeed_10m?.[0] ?? null;
  const hum = data?.hourly?.relativehumidity_2m?.[0] ?? null;
  return {
    city: city.name,
    country: city.country,
    temperature: temp,
    windSpeed: wind,
    humidity: hum,
    code: undefined,
  };
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoResult | null>(null);
  const [conditions, setConditions] = useState<CurrentConditions | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      setLoadingWeather(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
        );
        if (!res.ok) {
          setError("Failed to load weather data");
          return;
        }
        const data = (await res.json()) as OpenMeteoResponse;
        setConditions(extractCurrentConditions(selectedCity, data));
      } catch (err) {
        console.error(err);
        setError("Network error while loading weather data");
      } finally {
        setLoadingWeather(false);
      }
    };
    void fetchWeather();
  }, [selectedCity]);

  const handleSelectCity = (city: GeoResult) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Weather Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Search for a city to view current conditions and a 15-day forecast.
          </p>
        </header>

        <SearchBar onSelect={handleSelectCity} />

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-900/40 px-4 py-2 text-xs text-rose-50">
            {error}
          </div>
        )}

        {selectedCity ? (
          <CurrentWeatherHero
            city={selectedCity}
            conditions={conditions}
            loading={loadingWeather}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 px-6 py-10 text-center text-sm text-slate-400">
            <p className="font-medium text-slate-200">
              Start by searching for a city above.
            </p>
            <p className="mt-1 text-xs">
              You&apos;ll see live conditions and forecast cards once a location
              is selected.
            </p>
          </div>
        )}

        {selectedCity && loadingWeather && (
          <div className="space-y-2">
            <SkeletonLoader className="h-24 w-full" />
            <SkeletonLoader className="h-20 w-full" />
          </div>
        )}
      </main>
    </div>
  );
}
