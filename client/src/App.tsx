import { useEffect, useState } from "react";
import "./index.css";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeatherHero } from "./components/CurrentWeatherHero";
import type { CurrentConditions, GeoResult } from "./components/types";
import { SkeletonLoader } from "./components/SkeletonLoader";
import type { DailyForecast } from "./components/forecastTypes";
import { ForecastGrid } from "./components/ForecastGrid";
import { StatsGrid } from "./components/StatsGrid";
import { PrecipChart } from "./components/PrecipChart";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { FavoritesList } from "./components/FavoritesList";

interface OpenMeteoResponse {
  hourly?: {
    time: string[];
    temperature_2m: number[];
    windspeed_10m?: number[];
    relativehumidity_2m?: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
  };
}

function emojiForDay(high: number | null): string {
  if (high == null) return "🌤️";
  if (high >= 28) return "🔥";
  if (high >= 20) return "☀️";
  if (high <= 0) return "❄️";
  return "⛅";
}

function extractDaily(data: OpenMeteoResponse | null): DailyForecast[] {
  const days: DailyForecast[] = [];
  const times = data?.daily?.time ?? [];
  for (let i = 0; i < times.length; i++) {
    const date = times[i];
    const d = new Date(date);
    const dayName = d.toLocaleDateString(undefined, { weekday: "short" });
    const high = data?.daily?.temperature_2m_max?.[i] ?? null;
    const low = data?.daily?.temperature_2m_min?.[i] ?? null;
    const precipRaw = data?.daily?.precipitation_sum?.[i];
    const precip = precipRaw == null ? null : Math.min(100, precipRaw * 10);
    days.push({
      date,
      dayName,
      high,
      low,
      precip,
      emoji: emojiForDay(high),
    });
  }
  return days;
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
  const [daily, setDaily] = useState<DailyForecast[]>([]);
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
        setDaily(extractDaily(data));
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
      <main className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Weather Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Search for a city to view current conditions and a 15-day forecast.
            </p>
          </div>
          <DarkModeToggle />
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="space-y-4">
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

            {selectedCity && !loadingWeather && conditions && (
              <StatsGrid conditions={conditions} />
            )}
          </div>

          <div className="space-y-4">
            <FavoritesList onSelect={handleSelectCity} />

            {selectedCity && !loadingWeather && daily.length > 0 && (
              <PrecipChart days={daily} />
            )}
          </div>
        </div>

        {selectedCity && !loadingWeather && daily.length > 0 && (
          <ForecastGrid days={daily} />
        )}
      </main>
    </div>
  );
}
