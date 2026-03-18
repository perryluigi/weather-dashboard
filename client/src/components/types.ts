/** Shared types for weather dashboard frontend. */

export interface GeoResult {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface CurrentConditions {
  city: string;
  country?: string;
  temperature: number | null;
  windSpeed: number | null;
  humidity: number | null;
  code?: string;
}
