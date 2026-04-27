import { useState, useCallback } from "react";
import { scoreAPI, explainAPI } from "../utils/api";
import toast from "react-hot-toast";

const DEFAULT_CANDIDATE = {
  name: "Alex Johnson",
  gender: "male",
  education: "Bachelor's",
  experience: 5,
  skills: ["JavaScript", "React", "Node.js", "Python"],
  domain: "hiring",
};

export function useScoring() {
  const [candidate, setCandidate] = useState(DEFAULT_CANDIDATE);
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [error, setError] = useState(null);

  const updateCandidate = useCallback((updates) => {
    setCandidate((prev) => ({ ...prev, ...updates }));
    setResults(null);
    setExplanation(null);
  }, []);

  const analyze = useCallback(async (candidateOverride) => {
    const c = candidateOverride || candidate;
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const data = await scoreAPI.compare(c);
      setResults(data);
      toast.success("Analysis complete");
      return data;
    } catch (err) {
      // Fallback: run scoring client-side if backend unavailable
      const fallback = runClientScoring(c);
      setResults(fallback);
      toast("Running in offline mode — backend not connected", { icon: "⚡" });
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [candidate]);

  const fetchExplanation = useCallback(async () => {
    setLoadingExplanation(true);
    try {
      const data = await explainAPI.bias(candidate);
      setExplanation(data.explanation);
      toast.success("Gemini AI explanation ready");
    } catch (err) {
      setExplanation(null);
      toast.error("Gemini explanation unavailable: " + err.message);
    } finally {
      setLoadingExplanation(false);
    }
  }, [candidate]);

  const reset = useCallback(() => {
    setCandidate(DEFAULT_CANDIDATE);
    setResults(null);
    setExplanation(null);
    setError(null);
  }, []);

  return {
    candidate,
    updateCandidate,
    setCandidate,
    results,
    explanation,
    loading,
    loadingExplanation,
    error,
    analyze,
    fetchExplanation,
    reset,
  };
}

// ─── CLIENT-SIDE FALLBACK SCORING ─────────────────────────────────────────────
// Mirrors backend logic exactly — used when backend is unreachable
const WESTERN_NAMES = new Set([
  "alex","john","michael","david","james","robert","william","emily",
  "sarah","jessica","jennifer","ryan","chris","kevin","andrew","matthew",
  "daniel","mark","paul","peter","adam","scott","jason","tyler","nathan",
]);

const JOB_SKILLS = ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"];

function runClientScoring(c) {
  const matched = c.skills.filter((s) =>
    JOB_SKILLS.map((j) => j.toLowerCase()).includes(s.toLowerCase())
  );

  // Biased scoring
  const bSkill = Math.round((matched.length / JOB_SKILLS.length) * 38);
  const bExp   = Math.min(Math.round(c.experience * 3.2), 22);
  const bEdu   = { PhD: 8, "Master's": 5, "Bachelor's": 2, "High School": 0 }[c.education] || 0;
  const gBias  = { male: 18, female: -12, "non-binary": -5, "prefer not": 0 }[c.gender] || 0;
  const nBias  = WESTERN_NAMES.has(c.name.split(" ")[0].toLowerCase()) ? 12 : -8;
  const bTotal = Math.max(0, Math.min(100, bSkill + bExp + bEdu + gBias + nBias));

  // Fair scoring
  const fSkill = Math.round((matched.length / JOB_SKILLS.length) * 52);
  const fExp   = Math.min(Math.round(c.experience * 4.8), 33);
  const fEdu   = { PhD: 14, "Master's": 10, "Bachelor's": 5, "High School": 0 }[c.education] || 0;
  const fTotal = Math.max(0, Math.min(100, fSkill + fExp + fEdu));

  return {
    success: true,
    biased: {
      total: bTotal, decision: bTotal >= 58 ? "HIRED" : "REJECTED", mode: "biased",
      breakdown: { skills: bSkill, experience: bExp, education: bEdu, genderBias: gBias, nameBias: nBias, totalBiasImpact: gBias + nBias },
      matchedSkills: matched,
      missingSkills: JOB_SKILLS.filter((s) => !c.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())),
    },
    fair: {
      total: fTotal, decision: fTotal >= 55 ? "HIRED" : "REJECTED", mode: "fair",
      breakdown: { skills: fSkill, experience: fExp, education: fEdu, genderBias: 0, nameBias: 0, totalBiasImpact: 0 },
      matchedSkills: matched,
      missingSkills: JOB_SKILLS.filter((s) => !c.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())),
    },
    analysis: {
      scoreDifference: bTotal - fTotal,
      decisionChanged: (bTotal >= 58 ? "HIRED" : "REJECTED") !== (fTotal >= 55 ? "HIRED" : "REJECTED"),
      biasImpact: gBias + nBias,
      biasFactors: { gender: gBias, name: nBias },
      fairnessIndex: Math.max(0, 100 - Math.abs(gBias + nBias) * 2),
    },
  };
}
