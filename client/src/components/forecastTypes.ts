/** Types for daily forecast display */

export interface DailyForecast {
  date: string; // ISO date
  dayName: string;
  high: number | null;
  low: number | null;
  precip: number | null;
  emoji: string;
}
