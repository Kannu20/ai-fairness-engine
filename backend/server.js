/**
 * AI Fairness Engine — Backend Server
 * Express API for bias detection and fair scoring
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("./middleware/cors");
const rateLimiter = require("./middleware/rateLimit");
const passport = require("./config/passport");

// Route imports
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");
const explainRoutes = require("./routes/explain");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MONGODB CONNECTION ──────────────────────────────────────────────────────
let mongoReady = false;
mongoose
  .connect(process.env.MONGODB_URI , {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    mongoReady = true;
    console.log("   MongoDB: ✓ Connected");
  })
  .catch((err) => console.error("   MongoDB: ✗ Connection failed:", err.message));

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── SESSION ──────────────────────────────────────────────────────────────────
  app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);


// ─── PASSPORT ─────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── RATE LIMITING ─────────────────────────────────────────────────────────────
app.use("/api/", rateLimiter);

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Fairness Engine API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    mongoConnected: mongoReady,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
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
        icon: "👔",
        biasFactors: ["gender", "name_perception", "age", "race", "disability"],
        fairFactors: ["skills", "experience", "education", "certifications"],
      },
      {
        id: "healthcare",
        name: "Healthcare",
        description: "Medical diagnosis and treatment recommendations",
        active: true,
        icon: "🏥",
        biasFactors: ["race", "gender", "age", "socioeconomic_status", "disability"],
        fairFactors: ["symptoms", "medical_history", "test_results", "urgency"],
      },
      {
        id: "loan",
        name: "Loan Approval",
        description: "Credit and loan approval decisions",
        active: true,
        icon: "💳",
        biasFactors: ["zip_code", "race_proxy", "gender", "age", "marital_status"],
        fairFactors: ["income", "credit_score", "debt_ratio", "employment_history"],
      },
      {
        id: "justice",
        name: "Criminal Justice",
        description: "Risk assessment and sentencing decisions",
        active: true,
        icon: "⚖️",
        biasFactors: ["race", "socioeconomic_status", "gender", "age", "neighborhood"],
        fairFactors: ["criminal_history", "offense_severity", "recidivism_risk", "rehabilitation"],
      },
      {
        id: "insurance",
        name: "Insurance",
        description: "Premium pricing and coverage decisions",
        active: true,
        icon: "🛡️",
        biasFactors: ["gender", "race", "disability", "genetic_info", "location"],
        fairFactors: ["risk_assessment", "claim_history", "coverage_type", "age_band"],
      },
      {
        id: "education",
        name: "Education",
        description: "Admissions and academic evaluation",
        active: true,
        icon: "🎓",
        biasFactors: ["race", "gender", "socioeconomic_status", "disability", "geography"],
        fairFactors: ["grades", "test_scores", "extracurriculars", "essays"],
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
  console.log(`   Mode: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
