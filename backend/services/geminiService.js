/**
 * GeminiService — Explainable AI via Google Gemini 1.5 Flash
 *
 * Uses Gemini to generate:
 * 1. Human-readable bias analysis
 * 2. Structured XAI explanations
 * 3. What-if impact narratives
 * 4. Resume text analysis
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

/**
 * Generate XAI explanation for a bias comparison result.
 */
async function explainBiasComparison(candidate, biasedResult, fairResult) {
  const model = getClient();

  const prompt = `You are an expert in AI fairness, algorithmic bias, and employment law. Analyze this hiring decision case and provide a structured explanation.

CANDIDATE: ${candidate.name}
Gender: ${candidate.gender} | Experience: ${candidate.experience} years | Education: ${candidate.education}
Skills: ${candidate.skills.join(", ")}
Job Position: Senior Software Engineer

BIASED AI SYSTEM RESULT:
- Score: ${biasedResult.total}/100 → Decision: ${biasedResult.decision}
- Skill score: ${biasedResult.breakdown.skills}pts
- Experience score: ${biasedResult.breakdown.experience}pts
- Education score: ${biasedResult.breakdown.education}pts
- Gender bias applied: ${biasedResult.breakdown.genderBias > 0 ? "+" : ""}${biasedResult.breakdown.genderBias}pts (discriminatory factor)
- Name perception bias: ${biasedResult.breakdown.nameBias > 0 ? "+" : ""}${biasedResult.breakdown.nameBias}pts (discriminatory factor)
- Total bias impact: ${biasedResult.breakdown.totalBiasImpact > 0 ? "+" : ""}${biasedResult.breakdown.totalBiasImpact}pts

FAIR AI SYSTEM RESULT:
- Score: ${fairResult.total}/100 → Decision: ${fairResult.decision}
- Only merit factors used: skills, experience, education
- Protected attributes: gender and name IGNORED

DECISION CHANGED: ${biasedResult.decision !== fairResult.decision ? "YES — bias altered the outcome" : "NO — same outcome but unfair process"}

Respond in EXACTLY this JSON format (no markdown, no code blocks, pure JSON):
{
  "biasDetected": {
    "severity": "HIGH|MEDIUM|LOW",
    "factors": ["list of bias factors found"],
    "impactStatement": "one sentence describing quantified impact"
  },
  "whatChanged": "one sentence: what the fair system did differently",
  "legalRisk": "one sentence on legal implications under EEOC/employment law",
  "realWorldAnalogy": "one relatable real-world analogy for this type of bias",
  "fairSystemExplanation": "two sentences explaining how the fair score was derived",
  "recommendation": "one actionable recommendation for the hiring team",
  "keyTakeaway": "one powerful closing sentence for a general audience"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return { success: true, data: JSON.parse(cleaned), raw: text };
  } catch {
    return { success: true, data: null, raw: text };
  }
}

/**
 * Analyze resume text and extract structured candidate profile.
 */
async function analyzeResume(resumeText) {
  const model = getClient();

  const prompt = `You are an AI resume parser. Extract structured information from this resume text.

RESUME:
${resumeText}

Respond in EXACTLY this JSON format (no markdown, pure JSON):
{
  "name": "candidate full name",
  "education": "PhD|Master's|Bachelor's|High School",
  "experience": <years as number>,
  "skills": ["skill1", "skill2"],
  "summary": "2-sentence professional summary"
}

For skills, extract only technical skills. For experience, estimate total years.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return { success: true, data: JSON.parse(cleaned) };
  } catch {
    return { success: false, error: "Could not parse resume", raw: text };
  }
}

/**
 * Generate what-if narrative for name/gender change simulation.
 */
async function explainWhatIf(original, modified, originalResult, modifiedResult) {
  const model = getClient();

  const prompt = `In 3 short punchy sentences (max 80 words total), explain the significance of this AI bias demonstration:

Original: ${original.name} (${original.gender}) → Biased score: ${originalResult.biased.total}/100 (${originalResult.biased.decision})
Modified: ${modified.name} (${modified.gender}) → Biased score: ${modifiedResult.biased.total}/100 (${modifiedResult.biased.decision})
Skills, experience, and education: IDENTICAL in both cases
Fair system score: ${originalResult.fair.total} vs ${modifiedResult.fair.total} (should be the same)

Make it powerful and easy to understand for a general audience. No jargon. Use specific numbers.`;

  const result = await model.generateContent(prompt);
  return { success: true, narrative: result.response.text() };
}

module.exports = { explainBiasComparison, analyzeResume, explainWhatIf };
