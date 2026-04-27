/**
 * Score Routes
 * POST /api/score/biased    — Returns biased AI score
 * POST /api/score/fair      — Returns fair AI score
 * POST /api/score/compare   — Returns both scores + diff analysis
 * POST /api/score/whatif    — What-if simulation (change name/gender)
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
const { scoreBiased } = require("../services/biasEngine");
const { scoreFair } = require("../services/fairEngine");

const router = express.Router();

// ─── VALIDATION MIDDLEWARE ────────────────────────────────────────────────────
const candidateValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name too long"),
  body("gender")
    .optional()
    .isIn(["male", "female", "non-binary", "prefer not"])
    .withMessage("Invalid gender value"),
  body("education")
    .isIn(["High School", "Bachelor's", "Master's", "PhD"])
    .withMessage("Education must be one of: High School, Bachelor's, Master's, PhD"),
  body("experience")
    .isFloat({ min: 0, max: 50 })
    .withMessage("Experience must be 0–50 years"),
  body("skills")
    .isArray({ min: 0, max: 30 })
    .withMessage("Skills must be an array (max 30)"),
  body("domain")
    .optional()
    .isIn(["hiring", "loan"])
    .withMessage("Domain must be 'hiring' or 'loan'"),
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
}

// ─── POST /api/score/biased ───────────────────────────────────────────────────
router.post("/biased", candidateValidation, validate, (req, res) => {
  try {
    const { name, gender, education, experience, skills, domain } = req.body;
    const candidate = { name, gender, education, experience: +experience, skills };
    const result = scoreBiased(candidate, domain || "hiring");
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/score/fair ─────────────────────────────────────────────────────
router.post("/fair", candidateValidation, validate, (req, res) => {
  try {
    const { name, gender, education, experience, skills, domain } = req.body;
    const candidate = { name, gender, education, experience: +experience, skills };
    const result = scoreFair(candidate, domain || "hiring");
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/score/compare ──────────────────────────────────────────────────
router.post("/compare", candidateValidation, validate, (req, res) => {
  try {
    const { name, gender, education, experience, skills, domain } = req.body;
    const candidate = { name, gender, education, experience: +experience, skills };
    const d = domain || "hiring";

    const biased = scoreBiased(candidate, d);
    const fair = scoreFair(candidate, d);

    const diff = {
      scoreDifference: biased.total - fair.total,
      decisionChanged: biased.decision !== fair.decision,
      biasImpact: biased.breakdown.totalBiasImpact,
      biasFactors: {
        gender: biased.breakdown.genderBias,
        name: biased.breakdown.nameBias,
      },
      verdict:
        biased.decision !== fair.decision
          ? `CRITICAL: Bias changed the hiring decision. ${candidate.name} would be ${biased.decision} in the biased system but ${fair.decision} in the fair system.`
          : biased.breakdown.totalBiasImpact !== 0
          ? `WARNING: Bias affected the score by ${Math.abs(biased.breakdown.totalBiasImpact)} points, but did not change the final decision this time.`
          : "No significant bias detected for this candidate profile.",
      fairnessIndex: Math.max(0, 100 - Math.abs(biased.breakdown.totalBiasImpact) * 2),
    };

    res.json({ success: true, biased, fair, analysis: diff });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/score/whatif ───────────────────────────────────────────────────
router.post(
  "/whatif",
  [
    ...candidateValidation,
    body("whatif.name").optional().trim().isLength({ max: 100 }),
    body("whatif.gender").optional().isIn(["male", "female", "non-binary", "prefer not"]),
  ],
  validate,
  (req, res) => {
    try {
      const { name, gender, education, experience, skills, domain, whatif } = req.body;
      const original = { name, gender, education, experience: +experience, skills };
      const modified = {
        ...original,
        name: whatif?.name || name,
        gender: whatif?.gender || gender,
      };
      const d = domain || "hiring";

      const originalScores = {
        biased: scoreBiased(original, d),
        fair: scoreFair(original, d),
      };
      const modifiedScores = {
        biased: scoreBiased(modified, d),
        fair: scoreFair(modified, d),
      };

      const biasedDiff = modifiedScores.biased.total - originalScores.biased.total;
      const fairDiff = modifiedScores.fair.total - originalScores.fair.total;

      res.json({
        success: true,
        original: { candidate: original, ...originalScores },
        modified: { candidate: modified, ...modifiedScores },
        delta: {
          biasedScoreDiff: biasedDiff,
          fairScoreDiff: fairDiff,
          biasedDecisionChanged: originalScores.biased.decision !== modifiedScores.biased.decision,
          fairDecisionChanged: originalScores.fair.decision !== modifiedScores.fair.decision,
          insight:
            Math.abs(biasedDiff) > 0 && Math.abs(fairDiff) === 0
              ? `Changing name and gender shifted the biased score by ${Math.abs(biasedDiff)} points with ZERO change in qualifications. The fair system score remained unchanged (${fairDiff} pts difference). This is algorithmic discrimination.`
              : `Score changes: Biased system: ${biasedDiff > 0 ? "+" : ""}${biasedDiff}pts | Fair system: ${fairDiff > 0 ? "+" : ""}${fairDiff}pts`,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ─── POST /api/score/batch ────────────────────────────────────────────────────
router.post("/batch", (req, res) => {
  try {
    const { candidates, domain } = req.body;
    if (!Array.isArray(candidates) || candidates.length > 20) {
      return res.status(422).json({ success: false, error: "candidates must be an array of max 20" });
    }
    const d = domain || "hiring";
    const results = candidates.map((c) => ({
      candidate: c.name,
      biased: scoreBiased(c, d),
      fair: scoreFair(c, d),
    }));

    const summary = {
      total: results.length,
      biasedHires: results.filter((r) => r.biased.decision === "HIRED").length,
      fairHires: results.filter((r) => r.fair.decision === "HIRED").length,
      decisionChanges: results.filter((r) => r.biased.decision !== r.fair.decision).length,
      avgBiasImpact: Math.round(
        results.reduce((sum, r) => sum + r.biased.breakdown.totalBiasImpact, 0) / results.length
      ),
    };

    res.json({ success: true, results, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
