/**
 * Explain Routes — Gemini-powered Explainable AI
 * POST /api/explain/bias     — Full XAI explanation of bias comparison
 * POST /api/explain/resume   — Parse and analyze resume text
 * POST /api/explain/whatif   — What-if scenario narrative
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
const { scoreBiased } = require("../services/biasEngine");
const { scoreFair } = require("../services/fairEngine");
const { explainBiasComparison, analyzeResume, explainWhatIf } = require("../services/geminiService");

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
}

// ─── POST /api/explain/bias ───────────────────────────────────────────────────
router.post(
  "/bias",
  [
    body("name").trim().notEmpty(),
    body("gender").optional(),
    body("education").notEmpty(),
    body("experience").isFloat({ min: 0, max: 50 }),
    body("skills").isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          success: false,
          error: "Gemini API key not configured. Add GEMINI_API_KEY to backend .env",
        });
      }

      const { name, gender, education, experience, skills } = req.body;
      const candidate = { name, gender, education, experience: +experience, skills };

      const biasedResult = scoreBiased(candidate, "hiring");
      const fairResult = scoreFair(candidate, "hiring");

      const explanation = await explainBiasComparison(candidate, biasedResult, fairResult);

      res.json({
        success: true,
        candidate,
        biasedResult,
        fairResult,
        explanation,
        poweredBy: "Google Gemini 1.5 Flash",
      });
    } catch (err) {
      console.error("[Gemini Error]", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ─── POST /api/explain/resume ─────────────────────────────────────────────────
router.post(
  "/resume",
  [body("text").trim().notEmpty().withMessage("Resume text is required")],
  validate,
  async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ success: false, error: "Gemini API key not configured" });
      }
      const parsed = await analyzeResume(req.body.text);
      res.json({ success: true, ...parsed, poweredBy: "Google Gemini 1.5 Flash" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ─── POST /api/explain/whatif ─────────────────────────────────────────────────
router.post("/whatif", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ success: false, error: "Gemini API key not configured" });
    }

    const { original, modified } = req.body;
    if (!original || !modified) {
      return res.status(422).json({ success: false, error: "original and modified candidate required" });
    }

    const originalResult = {
      biased: scoreBiased(original, "hiring"),
      fair: scoreFair(original, "hiring"),
    };
    const modifiedResult = {
      biased: scoreBiased(modified, "hiring"),
      fair: scoreFair(modified, "hiring"),
    };

    const narrative = await explainWhatIf(original, modified, originalResult, modifiedResult);

    res.json({
      success: true,
      original: { candidate: original, ...originalResult },
      modified: { candidate: modified, ...modifiedResult },
      narrative,
      poweredBy: "Google Gemini 1.5 Flash",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
