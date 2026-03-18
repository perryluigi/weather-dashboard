import type { DailyForecast } from "./forecastTypes";

interface PrecipChartProps {
  days: DailyForecast[];
}

export function PrecipChart({ days }: PrecipChartProps) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-medium text-slate-100">Precipitation trend</p>
      <div className="flex items-end gap-1 rounded-2xl bg-slate-900/70 px-3 py-3 text-[10px] text-slate-300 shadow-md shadow-sky-900/40">
        {days.slice(0, 10).map((d, idx) => {
          const height = d.precip != null ? Math.max(6, (d.precip / 100) * 48) : 4;
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                style={{
                  height,
                  animationDelay: `${idx * 60}ms`,
                }}
                className="w-full max-w-[12px] rounded-full bg-gradient-to-t from-sky-900 via-sky-500 to-sky-300 opacity-90 shadow-sm shadow-sky-500/60 animate-[slideUp_0.35s_ease-out_forwards]"
              />
              <span className="text-[9px] text-slate-500">
                {d.dayName[0]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
