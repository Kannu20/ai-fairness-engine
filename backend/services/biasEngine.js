/**
 * BiasEngine — Demonstrates a flawed, biased AI scoring system.
 *
 * PURPOSE: Educational demo only. This engine intentionally
 * injects discriminatory factors (gender, name perception) to show
 * how real-world biased AI systems operate.
 *
 * In production, NEVER use protected attributes in scoring.
 */

// Names statistically associated with majority demographics
// (based on US Census & audit study research by Bertrand & Mullainathan, 2004)
const WESTERN_NAMES = new Set([
  "alex","john","michael","david","james","robert","william","emily",
  "sarah","jessica","jennifer","ryan","chris","kevin","andrew","matthew",
  "daniel","mark","paul","peter","adam","scott","jason","tyler","nathan",
  "luke","eric","steven","lisa","karen","patricia","barbara","susan",
  "margaret","angela","melissa","deborah","stephanie","rebecca","laura",
  "helen","amy","anna","kathleen","pamela","emma","elizabeth","samantha",
  "caroline","amanda","rachel","megan","ashley","brittany","lauren",
  "joshua","brandon","jacob","ethan","zachary","austin","hunter",
  "jordan","justin","sean","aaron","adam","ian","mason","evan",
]);

// Job requirements definition
const JOB_CONFIG = {
  hiring: {
    title: "Senior Software Engineer",
    requiredSkills: ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"],
    maxSkillScore: 38,
    maxExpScore: 22,
    hireThreshold: 58,
    expMultiplier: 3.2,
    educationScores: { PhD: 8, "Master's": 5, "Bachelor's": 2, "High School": 0 },
  },
};

/**
 * Gender bias weights — intentionally discriminatory for demo.
 * Sources: Research shows such biases exist in some real ATS systems.
 */
const GENDER_BIAS = {
  male: +18,
  female: -12,
  "non-binary": -5,
  "prefer not": 0,
};

/**
 * Derive name bias from first name perception.
 * Based on audit study research on callback rates for identical resumes.
 */
function computeNameBias(fullName) {
  const firstName = fullName.trim().split(/\s+/)[0].toLowerCase();
  return WESTERN_NAMES.has(firstName) ? +12 : -8;
}

/**
 * Extract and score merit-based features.
 */
function scoreMerit(candidate, config) {
  const { requiredSkills, maxSkillScore, maxExpScore, expMultiplier, educationScores } = config;
  const matchedSkills = candidate.skills.filter((s) =>
    requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())
  );
  const skillScore = Math.round((matchedSkills.length / requiredSkills.length) * maxSkillScore);
  const expScore = Math.min(Math.round(candidate.experience * expMultiplier), maxExpScore);
  const eduScore = educationScores[candidate.education] ?? 0;
  return { skillScore, expScore, eduScore, matchedSkills };
}

/**
 * Main biased scoring function.
 * @param {Object} candidate - { name, gender, education, experience, skills }
 * @param {string} domain - "hiring" | "loan"
 * @returns {Object} Detailed biased scoring result
 */
function scoreBiased(candidate, domain = "hiring") {
  const config = JOB_CONFIG[domain] || JOB_CONFIG.hiring;
  const { skillScore, expScore, eduScore, matchedSkills } = scoreMerit(candidate, config);

  // ⚠️ BIAS INJECTION — protected attributes weighted
  const genderBias = GENDER_BIAS[candidate.gender?.toLowerCase()] ?? 0;
  const nameBias = computeNameBias(candidate.name || "");

  const rawTotal = skillScore + expScore + eduScore + genderBias + nameBias;
  const total = Math.max(0, Math.min(100, rawTotal));
  const decision = total >= config.hireThreshold ? "HIRED" : "REJECTED";

  return {
    total,
    decision,
    mode: "biased",
    domain,
    candidate: {
      name: candidate.name,
      gender: candidate.gender,
      education: candidate.education,
      experience: candidate.experience,
    },
    breakdown: {
      skills: skillScore,
      experience: expScore,
      education: eduScore,
      genderBias,
      nameBias,
      totalBiasImpact: genderBias + nameBias,
    },
    matchedSkills,
    missingSkills: (config.requiredSkills || []).filter(
      (s) => !candidate.skills.map((c) => c.toLowerCase()).includes(s.toLowerCase())
    ),
    explanation: buildBiasedExplanation(candidate, { skillScore, expScore, eduScore }, genderBias, nameBias, decision),
    warning: "⚠️ This score was computed using protected attributes (gender, name). This constitutes illegal discrimination in most jurisdictions.",
  };
}

function buildBiasedExplanation(candidate, merit, genderBias, nameBias, decision) {
  const factors = [];
  if (genderBias !== 0) {
    factors.push(`Gender (${candidate.gender}): ${genderBias > 0 ? "+" : ""}${genderBias} pts`);
  }
  if (nameBias !== 0) {
    factors.push(`Name perception: ${nameBias > 0 ? "+" : ""}${nameBias} pts`);
  }
  return {
    summary: `Candidate ${decision} with score ${merit.skillScore + merit.expScore + merit.eduScore + genderBias + nameBias}/100`,
    meritFactors: `Skills: ${merit.skillScore}pts + Experience: ${merit.expScore}pts + Education: ${merit.eduScore}pts`,
    biasFactors: factors.join("; ") || "None applied",
    note: factors.length
      ? `Discriminatory factors applied: ${factors.join(", ")}. These are illegal in hiring decisions.`
      : "No bias factors triggered.",
  };
}

module.exports = { scoreBiased };
