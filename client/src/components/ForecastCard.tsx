import type { DailyForecast } from "./forecastTypes";

interface ForecastCardProps {
  forecast: DailyForecast;
  expanded: boolean;
  onClick: () => void;
  index: number;
}

export function ForecastCard({ forecast, expanded, onClick, index }: ForecastCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${index * 40}ms` }}
      className={`group flex-shrink-0 snap-start rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-3 text-left text-xs text-slate-100 shadow-lg shadow-sky-900/40 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl ${
        expanded ? "ring-2 ring-sky-400" : "ring-1 ring-slate-800/60"
      } animate-[slideUp_0.3s_ease-out_forwards]`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-300">
            {forecast.dayName}
          </p>
          <p className="text-[10px] text-slate-400">{forecast.date}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg">{forecast.emoji}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-200">
            <span className="font-semibold">{forecast.high != null ? `${Math.round(forecast.high)}°` : "--°"}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{forecast.low != null ? `${Math.round(forecast.low)}°` : "--°"}</span>
          </div>
          <div className="text-[10px] text-sky-300">
            🌧 {forecast.precip != null ? `${Math.round(forecast.precip)}%` : "--%"}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="mt-3 space-y-1 text-[10px] text-slate-200/90">
          <p>Detailed view coming soon (hourly breakdown, wind, UV, etc.).</p>
        </div>
      )}
    </button>
  );
}
