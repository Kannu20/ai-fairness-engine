/**
 * AI Fairness Engine — Backend Server
 * Express API for bias detection and fair scoring
 */

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("./middleware/cors");
const rateLimiter = require("./middleware/rateLimit");

// Route imports
const scoreRoutes = require("./routes/score");
const explainRoutes = require("./routes/explain");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── RATE LIMITING ─────────────────────────────────────────────────────────────
app.use("/api/", rateLimiter);

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Fairness Engine API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    gemini: !!process.env.GEMINI_API_KEY,
  });
});

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/score", scoreRoutes);
app.use("/api/explain", explainRoutes);

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────
app.get("/api/samples", (req, res) => {
  const samples = require("./data/sampleCandidates.json");
  res.json({ success: true, data: samples });
});

// ─── DOMAIN INFO ───────────────────────────────────────────────────────────────
app.get("/api/domains", (req, res) => {
  res.json({
    success: true,
    domains: [
      {
        id: "hiring",
        name: "Resume / Hiring",
        description: "Automated hiring and resume screening",
        active: true,
        biasFactors: ["gender", "name_perception", "age"],
        fairFactors: ["skills", "experience", "education"],
      },
      {
        id: "loan",
        name: "Loan Approval",
        description: "Credit and loan approval decisions",
        active: false,
        biasFactors: ["zip_code", "race_proxy", "gender"],
        fairFactors: ["income", "credit_score", "debt_ratio"],
      },
    ],
  });
});

// ─── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚖️  AI Fairness Engine API`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Gemini AI: ${process.env.GEMINI_API_KEY ? "✓ Connected" : "✗ No API key"}\n`);
});

module.exports = app;
