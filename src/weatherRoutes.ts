/**
 * Weather routes and Open-Meteo proxy logic.
 *
 * Routes:
 *  - GET /api/weather?lat=&lon=
 *  - GET /api/weather/search?q=city
 *  - GET/POST/DELETE /api/weather/favorites
 */
import type { Request, Response, Router } from "express";

export interface FavoriteCity {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

// In-memory favorites store (lives for the lifetime of the process)
const favorites: FavoriteCity[] = [];

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";

/** Build Open-Meteo forecast URL for a 15-day forecast with relevant fields. */
function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "rain_sum",
      "snowfall_sum",
      "windspeed_10m_max",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation",
      "rain",
      "snowfall",
      "windspeed_10m",
      "relativehumidity_2m",
      "uv_index",
    ].join(","),
    forecast_days: "15",
    timezone: "auto",
  });
  return `${OPEN_METEO_BASE}?${params.toString()}`;
}

/** Attach weather routes to a router or app instance. */
export function registerWeatherRoutes(router: Router) {
  /**
   * GET /api/weather
   * Proxies a 15-day forecast for the given lat/lon.
   */
  router.get("/api/weather", async (req: Request, res: Response) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing lat/lon query parameters" });
    }

    try {
      const url = buildForecastUrl(lat, lon);
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        console.error("Open-Meteo error", response.status, text);
        return res.status(502).json({ error: "Upstream weather service error" });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Error calling Open-Meteo forecast API", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/weather/search
   * Uses Open-Meteo geocoding API to search by city name.
   */
  router.get("/api/weather/search", async (req: Request, res: Response) => {
    const q = (req.query.q as string | undefined)?.trim();
    if (!q) {
      return res.status(400).json({ error: "Missing ?q=city query parameter" });
    }

    try {
      const params = new URLSearchParams({ name: q, count: "5" });
      const url = `${OPEN_METEO_GEOCODE}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        console.error("Open-Meteo geocoding error", response.status, text);
        return res.status(502).json({ error: "Upstream geocoding service error" });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Error calling Open-Meteo geocoding API", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/weather/favorites
   * Returns the in-memory favorites list.
   */
  router.get("/api/weather/favorites", (_req: Request, res: Response) => {
    return res.json(favorites);
  });

  /**
   * POST /api/weather/favorites
   * Body: { name, country?, lat, lon }
   */
  router.post("/api/weather/favorites", (req: Request, res: Response) => {
    const { name, country, lat, lon } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "'name' is required and must be a string" });
    }

    const latNum = Number(lat);
    const lonNum = Number(lon);

    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return res
        .status(400)
        .json({ error: "'lat' and 'lon' must be valid numbers" });
    }

    const id = `${name}-${latNum}-${lonNum}`;
    const existing = favorites.find((f) => f.id === id);
    if (existing) {
      return res.status(200).json(existing);
    }

    const favorite: FavoriteCity = {
      id,
      name,
      country,
      lat: latNum,
      lon: lonNum,
    };

    favorites.push(favorite);
    return res.status(201).json(favorite);
  });

  /**
   * DELETE /api/weather/favorites/:id
   */
  router.delete("/api/weather/favorites/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = favorites.findIndex((f) => f.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    favorites.splice(idx, 1);
    return res.status(204).send();
  });
}
