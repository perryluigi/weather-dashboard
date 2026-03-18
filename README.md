# Weather Dashboard

A premium full-stack weather dashboard built with:

- **Backend:** Express + TypeScript
- **Frontend:** React + Vite + Tailwind CSS
- **Weather Data:** [Open-Meteo](https://open-meteo.com/) forecast + geocoding APIs
- **Testing:** Vitest + Supertest

---

## Features

- City search with autocomplete (Open-Meteo geocoding)
- Current conditions hero: temperature, emoji, wind, humidity
- In-memory favorites list with quick selection
- 15-day horizontal forecast cards with snap scrolling
- Precipitation bar chart with animated bars
- Stats grid (wind, humidity, and placeholders for UV, precip, visibility, pressure)
- Dark mode toggle with smooth transitions
- Skeleton loaders for a smooth loading experience

---

## Tech Stack

- Node.js, Express, TypeScript
- React 19, Vite 8
- Tailwind CSS (via `@tailwindcss/postcss`)
- Vitest, Supertest

---

## Getting Started

### 1. Install dependencies

```bash
cd /home/ocuser/openclaw-dev/weather-dashboard
npm install
cd client
npm install
```

### 2. Run the backend

From the project root:

```bash
cd /home/ocuser/openclaw-dev/weather-dashboard
npm run dev
# Starts Express server on http://localhost:3001
```

### 3. Run the frontend

In a second terminal:

```bash
cd /home/ocuser/openclaw-dev/weather-dashboard/client
npm run dev
# Starts Vite dev server on http://localhost:5173
```

The frontend calls the backend using relative `/api/weather` routes, so both need to be running.

### 4. Run tests

Backend tests (Vitest + Supertest):

```bash
cd /home/ocuser/openclaw-dev/weather-dashboard
npm test
```

---

## API Documentation

### Forecast

`GET /api/weather?lat=&lon=`

- **Description:** Proxies a 15-day forecast from Open-Meteo.
- **Query params:**
  - `lat` – latitude (number)
  - `lon` – longitude (number)
- **Response:** Open-Meteo JSON with `daily` and `hourly` fields.

### City Search

`GET /api/weather/search?q=city`

- **Description:** Uses Open-Meteo geocoding API to search for cities.
- **Query params:**
  - `q` – city name (string)
- **Response:** `{ results: [ { name, country, latitude, longitude, ... } ] }`

### Favorites

`GET /api/weather/favorites`

- **Description:** Returns the in-memory favorites list.
- **Response:**
  ```json
  [
    { "id": "NYC-40.7--74.0", "name": "New York", "country": "US", "lat": 40.7, "lon": -74.0 }
  ]
  ```

`POST /api/weather/favorites`

- **Description:** Adds a favorite city (in memory).
- **Body:**
  ```json
  { "name": "New York", "country": "US", "lat": 40.7, "lon": -74.0 }
  ```
- **Response:** The created (or existing) favorite city.

`DELETE /api/weather/favorites/:id`

- **Description:** Deletes a favorite city by ID.
- **Response:** `204 No Content` on success.

---

## Project Structure

```text
weather-dashboard/
  src/
    index.ts          # Express server entry
    weatherRoutes.ts  # Weather + favorites API routes
  tests/
    weather.api.test.ts  # Vitest + Supertest API tests
  client/
    src/
      App.tsx        # Main React app
      index.css      # Tailwind entry + global styles
      components/
        SearchBar.tsx
        CurrentWeatherHero.tsx
        ForecastGrid.tsx
        ForecastCard.tsx
        StatsGrid.tsx
        StatCard.tsx
        PrecipChart.tsx
        DarkModeToggle.tsx
        FavoritesList.tsx
        SkeletonLoader.tsx
        types.ts
        forecastTypes.ts
```

---

## License

MIT
