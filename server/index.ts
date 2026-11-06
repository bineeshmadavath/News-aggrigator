import "dotenv/config";
import express from "express";
import cors from "cors";
import { clustersRouter } from "./routes/clusters.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Allow requests from the Vite dev server and the built app.
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      `http://localhost:${PORT}`,
    ],
  })
);

app.use(express.json());
app.use("/api", clustersRouter);

// Health check so it's easy to verify the server is up.
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`\n  API proxy running at http://localhost:${PORT}`);
  console.log(`  Guardian key: ${process.env.GUARDIAN_API_KEY ? "✓ set" : "✗ missing"}`);
  console.log(`  GNews key:    ${process.env.GNEWS_API_KEY ? "✓ set" : "✗ missing (secondary source disabled)"}\n`);
});
