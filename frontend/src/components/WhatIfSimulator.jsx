import React, { useState } from "react";
import { scoreAPI, explainAPI } from "../utils/api";
import toast from "react-hot-toast";
import clsx from "clsx";

const PRESET_PROFILES = [
  { name: "Priya Sharma",    gender: "female", label: "South Asian female" },
  { name: "James Wilson",    gender: "male",   label: "Western male" },
  { name: "Fatima Al-Hassan",gender: "female", label: "Arabic female" },
  { name: "Ryan O'Brien",   gender: "male",   label: "Irish male" },
  { name: "Wei Zhang",      gender: "male",   label: "Chinese male" },
  { name: "Maria Garcia",   gender: "female", label: "Hispanic female" },
  { name: "David Miller",   gender: "male",   label: "Western male" },
  { name: "Aisha Johnson",  gender: "female", label: "African American female" },
];

function ScoreDot({ score, decision, color }) {
  return (
    <div className="text-center">
      <div className={clsx("text-4xl font-black", color)}>{score}</div>
      <div
        className={clsx(
          "inline-block mt-1 px-2.5 py-1 rounded-lg text-xs font-bold",
          decision === "HIRED" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
        )}
      >
        {decision === "HIRED" ? "✓ HIRED" : "✗ REJECTED"}
      </div>
    </div>
  );
}

export default function WhatIfSimulator({ candidate, baseResults }) {
  const [wiName, setWiName] = useState("Priya Sharma");
  const [wiGender, setWiGender] = useState("female");
  const [wiResults, setWiResults] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNarr, setLoadingNarr] = useState(false);

  if (!baseResults) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-5xl">🔬</div>
        <p className="text-slate-500 text-sm">Analyze a candidate first, then use this simulator.</p>
      </div>
    );
  }

  const runSimulation = async () => {
    setLoading(true);
    setNarrative(null);
    try {
      const data = await scoreAPI.whatif(candidate, { name: wiName, gender: wiGender });
      setWiResults(data);
      toast.success("Simulation complete");
    } catch {
      // Client-side fallback
      const { runClientScoring } = await import("../hooks/useScoring.js");
      toast("Running simulation offline", { icon: "⚡" });
    } finally {
      setLoading(false);
    }
  };

  const getGeminiNarrative = async () => {
    setLoadingNarr(true);
    try {
      const original = { ...candidate };
      const modified = { ...candidate, name: wiName, gender: wiGender };
      const data = await explainAPI.whatif(original, modified);
      setNarrative(data.narrative?.narrative || null);
      toast.success("Gemini narrative ready");
    } catch (err) {
      toast.error("Gemini unavailable: " + err.message);
    } finally {
      setLoadingNarr(false);
    }
  };

  const origBiased = wiResults?.original?.biased || baseResults?.biased;
  const origFair   = wiResults?.original?.fair   || baseResults?.fair;
  const modBiased  = wiResults?.modified?.biased;
  const modFair    = wiResults?.modified?.fair;

  const delta = wiResults?.delta;
  const biasedDiff = delta?.biasedScoreDiff || 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>What-If Simulator:</strong> Change only name and gender. Skills, experience, and
        education remain identical — isolating pure demographic bias. The fair system score should
        not change.
      </div>

      {/* Controls */}
      <div className="card">
        <p className="section-title mb-4">Modify Demographic Attributes Only</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Alternative Name</label>
            <input
              className="input"
              value={wiName}
              onChange={(e) => setWiName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Alternative Gender</label>
            <select className="select" value={wiGender} onChange={(e) => setWiGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer not">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Preset profiles (same qualifications, different demographics):</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROFILES.map((p) => (
              <button
                key={p.name}
                onClick={() => { setWiName(p.name); setWiGender(p.gender); }}
                className={clsx(
                  "text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all",
                  wiName === p.name
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                )}
                title={p.label}
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-400 mb-4 bg-slate-50 rounded-lg p-2">
          Keeping: Skills ({candidate.skills?.join(", ")}), Experience ({candidate.experience}yr),
          Education ({candidate.education})
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Simulating..." : "🔬 Run What-If Simulation"}
        </button>
      </div>

      {/* Results */}
      {(modBiased || delta) && (
        <div className="flex flex-col gap-4 animate-slide-in">
          {/* Side by side */}
          <div className="card">
            <p className="section-title mb-1">Biased System — Score Comparison</p>
            <p className="text-xs text-slate-400 mb-4">Identical qualifications. Only name and gender changed.</p>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Original</p>
                <p className="font-semibold text-sm text-slate-700">{candidate.name}</p>
                <p className="text-xs text-slate-400 mb-3">{candidate.gender}</p>
                <ScoreDot score={origBiased.total} decision={origBiased.decision} color="text-red-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl text-slate-300">→</div>
                {biasedDiff !== 0 && (
                  <div
                    className={clsx(
                      "text-xs font-bold mt-1",
                      biasedDiff > 0 ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    {biasedDiff > 0 ? `+${biasedDiff}` : biasedDiff} pts
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Modified</p>
                <p className="font-semibold text-sm text-slate-700">{wiName}</p>
                <p className="text-xs text-slate-400 mb-3">{wiGender}</p>
                <ScoreDot
                  score={modBiased?.total || "?"}
                  decision={modBiased?.decision || "?"}
                  color="text-red-600"
                />
              </div>
            </div>

            {/* Fair system note */}
            {modFair && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                <span>Fair System — Original:</span>
                <strong className="text-emerald-600">{origFair.total} ({origFair.decision})</strong>
                <span>Fair System — Modified:</span>
                <strong className="text-emerald-600">{modFair.total} ({modFair.decision})</strong>
                <span className="text-emerald-600 font-semibold">
                  Diff: {modFair.total - origFair.total === 0 ? "No change ✓" : `${modFair.total - origFair.total} pts`}
                </span>
              </div>
            )}
          </div>

          {/* Insight box */}
          {delta?.insight && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4">
              <p className="font-bold text-red-800 mb-2 text-sm">🚨 This is algorithmic discrimination</p>
              <p className="text-sm text-red-700 leading-relaxed">{delta.insight}</p>
            </div>
          )}

          {/* Gemini narrative */}
          {narrative ? (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-bold text-violet-700 mb-2 uppercase tracking-wide">Gemini AI Narrative</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{narrative}</p>
              <p className="text-xs text-slate-400 mt-2 text-right">Powered by Google Gemini 1.5 Flash</p>
            </div>
          ) : (
            <button
              onClick={getGeminiNarrative}
              disabled={loadingNarr}
              className="flex items-center justify-center gap-2 text-xs bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loadingNarr ? "Gemini thinking..." : "✨ Get Gemini AI Narrative for This Simulation"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
