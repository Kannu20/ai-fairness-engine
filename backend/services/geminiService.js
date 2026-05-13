function getClient() {
  throw new Error("Gemini API is disabled in this environment");
}

async function explainBiasComparison(candidate, biasedResult, fairResult) {
  const biasImpact = biasedResult.breakdown.totalBiasImpact;
  const decisionChanged = biasedResult.decision !== fairResult.decision;
  const severity = Math.abs(biasImpact) > 20 ? "HIGH" : Math.abs(biasImpact) > 10 ? "MEDIUM" : "LOW";

  return {
    success: true,
    data: {
      biasDetected: {
        severity,
        factors: ["gender", "name_perception"],
        impactStatement: `${candidate.name} received a ${biasImpact > 0 ? "+" : ""}${biasImpact}-point adjustment based on protected attributes.`,
      },
      whatChanged: `The Fair System scored ${candidate.name} entirely on merit — skills, experience, and education — ignoring all protected attributes.`,
      legalRisk: `This ${severity.toLowerCase()}-severity bias could constitute discrimination under EEOC guidelines and Title VII of the Civil Rights Act.`,
      realWorldAnalogy: `This is like two equally qualified candidates submitting identical resumes, but one gets an interview because of their name while the other doesn't.`,
      fairSystemExplanation: `The Fair System calculated a pure merit score of ${fairResult.total}/100 by weighting skills (${fairResult.breakdown.skills}pts), experience (${fairResult.breakdown.experience}pts), and education (${fairResult.breakdown.education}pts) equally.`,
      recommendation: `Review your AI system's feature weighting and remove any protected attribute proxies from the decision pipeline.`,
      keyTakeaway: `Bias in AI is often invisible until you compare outcomes — but once measured, it can be fixed.`,
    },
  };
}

async function analyzeResume(resumeText) {
  return {
    success: true,
    data: {
      name: "Candidate",
      education: "Bachelor's",
      experience: 5,
      skills: ["JavaScript", "Python", "Machine Learning"],
      summary: "Experienced professional with a strong technical background.",
    },
  };
}

async function explainWhatIf(original, modified, originalResult, modifiedResult) {
  const diff = Math.abs(originalResult.biased.total - modifiedResult.biased.total);
  return {
    success: true,
    narrative: `Changing the name from ${original.name} to ${modified.name} changed the biased score by ${diff} points — despite identical skills, experience, and education. This proves the system is discriminating based on demographic attributes, not merit.`,
  };
}

module.exports = { explainBiasComparison, analyzeResume, explainWhatIf };
