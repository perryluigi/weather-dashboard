import type { CurrentConditions } from "./types";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  conditions: CurrentConditions | null;
}

export function StatsGrid({ conditions }: StatsGridProps) {
  const wind =
    conditions?.windSpeed != null ? `${Math.round(conditions.windSpeed)} km/h` : "--";
  const hum =
    conditions?.humidity != null ? `${Math.round(conditions.humidity)}%` : "--";

  // Placeholder values for now; can be wired to real data if available
  const uv = "--";
  const pressure = "--";
  const visibility = "--";
  const precip = "--";

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatCard label="Wind" value={wind} icon="💨" />
      <StatCard label="Humidity" value={hum} icon="💧" />
      <StatCard label="UV Index" value={uv} icon="🔆" />
      <StatCard label="Precip" value={precip} icon="🌧" />
      <StatCard label="Visibility" value={visibility} icon="👁️" />
      <StatCard label="Pressure" value={pressure} icon="📈" />
    </section>
  );
}
