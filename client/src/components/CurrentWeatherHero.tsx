/**
 * CurrentWeatherHero shows key metrics for the selected city.
 */
import type { CurrentConditions, GeoResult } from "./types";
import { SkeletonLoader } from "./SkeletonLoader";

function emojiForConditions(temp: number | null, code?: string): string {
  if (code?.startsWith("snow")) return "❄️";
  if (code?.startsWith("rain")) return "🌧️";
  if (code?.startsWith("storm")) return "⛈️";
  if (code?.startsWith("cloud")) return "⛅";
  if (temp == null) return "🌎";
  if (temp >= 28) return "🔥";
  if (temp >= 18) return "☀️";
  if (temp <= 0) return "🥶";
  return "🌤️";
}

interface CurrentWeatherHeroProps {
  city: GeoResult | null;
  conditions: CurrentConditions | null;
  loading: boolean;
}

export function CurrentWeatherHero({ city, conditions, loading }: CurrentWeatherHeroProps) {
  const temp = conditions?.temperature ?? null;
  const emoji = emojiForConditions(temp, conditions?.code);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/30 via-indigo-600/40 to-slate-900/80 p-5 shadow-2xl shadow-sky-900/50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{emoji}</span>
            <div>
              {city ? (
                <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                  {city.name}
                  {city.country ? `, ${city.country}` : ""}
                </h1>
              ) : (
                <p className="text-sm text-slate-200">Search for a city to begin</p>
              )}
              <p className="text-xs text-slate-200/80">
                Premium weather dashboard – powered by Open-Meteo
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-end gap-4">
            {loading ? (
              <SkeletonLoader className="h-12 w-24" />
            ) : (
              <p className="text-4xl font-semibold tracking-tight text-slate-50">
                {temp != null ? `${Math.round(temp)}°` : "--°"}
              </p>
            )}
            <div className="space-y-1 text-xs text-slate-100/90">
              <div className="flex items-center gap-2">
                <span className="text-sky-100">💨</span>
                {loading ? (
                  <SkeletonLoader className="h-3 w-20" />
                ) : (
                  <span>
                    Wind {conditions?.windSpeed != null ? `${Math.round(conditions.windSpeed)} km/h` : "--"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-100">💧</span>
                {loading ? (
                  <SkeletonLoader className="h-3 w-16" />
                ) : (
                  <span>
                    Humidity {conditions?.humidity != null ? `${Math.round(conditions.humidity)}%` : "--"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
