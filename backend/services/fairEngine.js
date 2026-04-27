/**
 * FairEngine — Merit-based, bias-free AI scoring system.
 *
 * Principles:
 * 1. Zero weight on protected attributes (gender, name, age, ethnicity, religion)
 * 2. All scoring factors directly relevant to job performance
 * 3. Transparent, auditable, explainable weights
 * 4. Identical score for identical qualifications regardless of demographics
 *
 * Compliance: EEOC, EU AI Act Article 10, ISO/IEC 24027 (AI Bias)
 */

const JOB_CONFIG = {
  hiring: {
    title: "Senior Software Engineer",
    requiredSkills: ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"],
    weights: {
      skills: 0.52,       // 52% — most predictive of job performance
      experience: 0.33,   // 33% — years of relevant practice
      education: 0.15,    // 15% — baseline qualification signal
    },
    maxScores: {
      skills: 52,
      experience: 33,
      education: 15,
    },
    hireThreshold: 55,    // Minimum score for hire recommendation
    expMultiplier: 4.8,   // Points per year of experience
    educationScores: {
      PhD: 14,
      "Master's": 10,
      "Bachelor's": 5,
      "High School": 0,
    },
    seniorityBonus: {     // Bonus for relevant seniority signals
      threshold: 8,       // 8+ years = senior
      bonus: 5,
    },
  },
  loan: {
    title: "Personal Loan Application",
    requiredFactors: ["annual_income","credit_score","debt_to_income","employment_years"],
    weights: { income: 0.35, credit: 0.40, debt: 0.25 },
    hireThreshold: 60,
  },
};

/**
 * Score candidate using only merit-based, job-relevant criteria.
 * Protected attributes are explicitly stripped and logged.
 */
function scoreFair(candidate, domain = "hiring") {
  const config = JOB_CONFIG[domain] || JOB_CONFIG.hiring;

  // Explicitly document stripped attributes
  const strippedAttributes = {
    gender: candidate.gender || "not provided",
    name: candidate.name,
    note: "These attributes were received but assigned zero weight per fair hiring policy.",
  };

  if (domain === "hiring") {
    return scoreHiring(candidate, config, strippedAttributes);
  }
  return { error: "Domain not yet implemented", domain };
}

function scoreHiring(candidate, config, strippedAttributes) {
  const { requiredSkills, maxScores, hireThreshold, expMultiplier, educationScores, seniorityBonus } = config;

  // ─── SKILL MATCHING ──────────────────────────────────────────────────────────
  const matchedSkills = candidate.skills.filter((s) =>
    requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())
  );
  const missingSkills = requiredSkills.filter(
    (s) => !candidate.skills.map((c) => c.toLowerCase()).includes(s.toLowerCase())
  );
  const skillRatio = matchedSkills.length / requiredSkills.length;
  const skillScore = Math.round(skillRatio * maxScores.skills);

  // ─── EXPERIENCE SCORING ───────────────────────────────────────────────────────
  const rawExpScore = Math.round((candidate.experience || 0) * expMultiplier);
  const expScore = Math.min(rawExpScore, maxScores.experience);

  // Seniority bonus (merit-based, not demographic)
  const seniorBonus =
    (candidate.experience || 0) >= seniorityBonus.threshold ? seniorityBonus.bonus : 0;

  // ─── EDUCATION SCORING ────────────────────────────────────────────────────────
  const eduScore = educationScores[candidate.education] ?? 0;

  // ─── TOTAL ────────────────────────────────────────────────────────────────────
  const rawTotal = skillScore + expScore + eduScore + seniorBonus;
  const total = Math.max(0, Math.min(100, rawTotal));
  const decision = total >= hireThreshold ? "HIRED" : "REJECTED";

  // ─── CONFIDENCE INTERVAL ─────────────────────────────────────────────────────
  const confidence = skillRatio > 0.7 ? "HIGH" : skillRatio > 0.4 ? "MEDIUM" : "LOW";

  return {
    total,
    decision,
    mode: "fair",
    domain: "hiring",
    candidate: {
      name: candidate.name,
      education: candidate.education,
      experience: candidate.experience,
      // NOTE: gender deliberately omitted from fair output
    },
    breakdown: {
      skills: skillScore,
      experience: expScore,
      education: eduScore,
      seniorityBonus: seniorBonus,
      genderBias: 0,   // Explicitly zero for comparison
      nameBias: 0,     // Explicitly zero for comparison
      totalBiasImpact: 0,
    },
    matchedSkills,
    missingSkills,
    skillCoverage: `${matchedSkills.length}/${requiredSkills.length} (${Math.round(skillRatio * 100)}%)`,
    confidence,
    strippedAttributes,
    complianceNote: "Score computed under EEOC guidelines. Zero weight assigned to protected attributes.",
    explanation: {
      summary: `Candidate ${decision} based on merit: ${total}/100`,
      meritFactors: `Skills: ${skillScore}pts (${matchedSkills.length}/${requiredSkills.length} matched) + Experience: ${expScore}pts (${candidate.experience}yr) + Education: ${eduScore}pts`,
      protectedAttributesIgnored: Object.keys(strippedAttributes)
        .filter((k) => k !== "note")
        .join(", "),
      recommendation: buildRecommendation(decision, missingSkills, candidate.experience, confidence),
    },
  };
}

function buildRecommendation(decision, missingSkills, experience, confidence) {
  if (decision === "HIRED") {
    return `Strong merit-based match. Confidence: ${confidence}. ${
      missingSkills.length > 0
        ? `Consider onboarding plan for: ${missingSkills.join(", ")}.`
        : "Full skill coverage — no gaps."
    }`;
  }
  return `Does not meet minimum merit threshold. Key gaps: ${
    missingSkills.length ? missingSkills.join(", ") : "experience or education"
  }. Recommend skill development before reapplication.`;
}

module.exports = { scoreFair };
