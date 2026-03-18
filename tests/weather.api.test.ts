/**
 * Vitest + Supertest tests for weather API proxy and favorites.
 */
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.ts";

// Helper to mock global fetch
function mockFetchOnce(payload: unknown, ok = true, status = 200) {
  (global as any).fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Weather API", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns 400 when lat/lon missing", async () => {
    const res = await request(app).get("/api/weather");
    expect(res.status).toBe(400);
  });

  it("proxies forecast from Open-Meteo", async () => {
    const mock = { latitude: 1, longitude: 2, daily: { time: ["2024-01-01"] } };
    mockFetchOnce(mock);

    const res = await request(app).get("/api/weather?lat=40&lon=-74");
    expect(res.status).toBe(200);
    expect(res.body.daily.time[0]).toBe("2024-01-01");
  });

  it("searches city via geocoding API", async () => {
    const mock = { results: [{ name: "New York", latitude: 40.7, longitude: -74.0 }] };
    mockFetchOnce(mock);

    const res = await request(app).get("/api/weather/search?q=new%20york");
    expect(res.status).toBe(200);
    expect(res.body.results[0].name).toBe("New York");
  });

  it("validates favorites POST body", async () => {
    const res = await request(app).post("/api/weather/favorites").send({});
    expect(res.status).toBe(400);
  });

  it("adds and deletes favorites in memory", async () => {
    const createRes = await request(app)
      .post("/api/weather/favorites")
      .send({ name: "NYC", lat: 40.7, lon: -74.0 });

    expect(createRes.status).toBe(201);
    const fav = createRes.body;

    const listRes = await request(app).get("/api/weather/favorites");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);

    const delRes = await request(app).delete(`/api/weather/favorites/${fav.id}`);
    expect(delRes.status).toBe(204);
  });
});
