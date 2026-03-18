import express from "express";
import type { Request, Response } from "express";
import { registerWeatherRoutes } from "./weatherRoutes.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Simple health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Attach weather routes
registerWeatherRoutes(app);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
