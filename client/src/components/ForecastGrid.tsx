import { useState } from "react";
import type { DailyForecast } from "./forecastTypes";
import { ForecastCard } from "./ForecastCard";

interface ForecastGridProps {
  days: DailyForecast[];
}

export function ForecastGrid({ days }: ForecastGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="font-medium text-slate-100">15-day outlook</span>
      </div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {days.map((day, idx) => {
          const id = day.date;
          const expanded = expandedId === id;
          return (
            <ForecastCard
              key={id}
              forecast={day}
              expanded={expanded}
              onClick={() => setExpandedId(expanded ? null : id)}
              index={idx}
            />
          );
        })}
      </div>
    </section>
  );
}
