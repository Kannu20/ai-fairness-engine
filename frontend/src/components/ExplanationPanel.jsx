import React, { useState } from "react";
import { explainAPI } from "../utils/api";
import toast from "react-hot-toast";

function StaticExplanation({ biased, fair, candidate }) {
  if (!biased || !fair) return null;
  const gBias = biased.breakdown.genderBias;
  const nBias = biased.breakdown.nameBias;
  const impact = biased.breakdown.totalBiasImpact;
  const changed = biased.decision !== fair.decision;

  return (
    <div className="flex flex-col gap-3 text-sm text-slate-700 leading-relaxed">
      <p>
        <strong>Bias detected:</strong> The biased system applied a{" "}
        <span className="text-red-600 font-semibold">
          {gBias > 0 ? "+" : ""}{gBias}-point gender bias
        </span>{" "}
        and{" "}
        <span className="text-red-600 font-semibold">
          {nBias > 0 ? "+" : ""}{nBias}-point name perception bias
        </span>{" "}
        to {candidate.name} — factors with zero relevance to job performance.
      </p>
      <p>
        <strong>What this means:</strong> The candidate's{" "}
        {impact < 0
          ? `demographics caused an unfair penalty of ${Math.abs(impact)} points. In a fair market, they would score ${fair.total} — but the biased system gave them only ${biased.total}.`
          : `demographics gave an unfair advantage of ${impact} points. The system rewarded who they are, not what they can do.`}
      </p>
      <p>
        <strong>Fair correction:</strong> The Fair System scored {candidate.name} entirely on skill
        match ({fair.breakdown.skills} pts), years of experience ({fair.breakdown.experience} pts),
        and educational attainment ({fair.breakdown.education} pts). No protected attributes were
        consulted.
      </p>
      {changed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 font-semibold text-sm">
          🚨 The bias was severe enough to <strong>change the hiring decision</strong>. The candidate
          was {biased.decision} by the biased system but would be {fair.decision} under a fair evaluation.
          This is textbook illegal discrimination under EEOC guidelines.
        </div>
      )}
      <p className="text-xs text-slate-400 italic">
        Connect Gemini AI (header button) for a deeper, AI-generated analysis with legal context and
        real-world analogies.
      </p>
    </div>
  );
}

export default function ExplanationPanel({ results, candidate }) {
  const [geminiData, setGeminiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGemini = async () => {
    setLoading(true);
    try {
      const data = await explainAPI.bias(candidate);
      setGeminiData(data.explanation?.data || null);
      if (!data.explanation?.data) {
        toast("Got raw Gemini text — showing below", { icon: "📝" });
        setGeminiData({ raw: data.explanation?.raw });
      }
    } catch (err) {
      toast.error("Gemini unavailable: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const g = geminiData;

  return (
    <div className="card border-violet-200 bg-violet-50 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="badge bg-violet-100 text-violet-700 text-xs">✨ Explainable AI</span>
          <span className="text-xs text-slate-400">What did the AI use to decide?</span>
        </div>
        <button
          onClick={fetchGemini}
          disabled={loading}
          className="flex items-center gap-2 text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Gemini thinking...
            </>
          ) : (
            "✨ Get Gemini Explanation"
          )}
        </button>
      </div>

      {/* Gemini structured output */}
      {g && !g.raw && (
        <div className="bg-white rounded-xl p-4 flex flex-col gap-3 border border-violet-100 animate-fade-in">
          {g.biasDetected && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Bias Detection</p>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`badge text-xs ${
                    g.biasDetected.severity === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : g.biasDetected.severity === "MEDIUM"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {g.biasDetected.severity} severity
                </span>
              </div>
              <p className="text-sm text-slate-700">{g.biasDetected.impactStatement}</p>
            </div>
          )}
          {g.whatChanged && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">What Changed</p>
              <p className="text-sm text-slate-700">{g.whatChanged}</p>
            </div>
          )}
          {g.legalRisk && (
            <div className="bg-red-50 rounded-lg p-2">
              <p className="text-xs font-bold text-red-600 mb-0.5">⚖️ Legal Risk</p>
              <p className="text-xs text-red-700">{g.legalRisk}</p>
            </div>
          )}
          {g.realWorldAnalogy && (
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-xs font-bold text-blue-600 mb-0.5">💡 Real-World Analogy</p>
              <p className="text-xs text-blue-700">{g.realWorldAnalogy}</p>
            </div>
          )}
          {g.fairSystemExplanation && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Fair System</p>
              <p className="text-sm text-slate-700">{g.fairSystemExplanation}</p>
            </div>
          )}
          {g.keyTakeaway && (
            <div className="bg-violet-100 rounded-lg p-3 border border-violet-200">
              <p className="text-sm font-semibold text-violet-800">"{g.keyTakeaway}"</p>
            </div>
          )}
          {g.recommendation && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Recommendation</p>
              <p className="text-sm text-slate-700">{g.recommendation}</p>
            </div>
          )}
          <p className="text-xs text-slate-400 text-right">Powered by Google Gemini 1.5 Flash</p>
        </div>
      )}

      {/* Raw text fallback */}
      {g?.raw && (
        <div className="bg-white rounded-xl p-4 border border-violet-100 animate-fade-in">
          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Gemini AI Analysis</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{g.raw}</p>
          <p className="text-xs text-slate-400 mt-2 text-right">Powered by Google Gemini 1.5 Flash</p>
        </div>
      )}

      {/* Static fallback */}
      {!g && results && (
        <StaticExplanation
          biased={results.biased}
          fair={results.fair}
          candidate={candidate}
        />
      )}
    </div>
  );
}
