import React from "react";
import clsx from "clsx";

export default function ScoreCard({ result, candidate }) {
  if (!result) return null;

  const isBiased = result.mode === "biased";
  const isHired = result.decision === "HIRED";
  const hasBias =
    isBiased &&
    (result.breakdown.genderBias !== 0 || result.breakdown.nameBias !== 0);

  return (
    <div
      className={clsx(
        "rounded-2xl border-2 p-5 flex flex-col gap-4 animate-slide-in",
        isBiased ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span
            className={clsx(
              "badge text-xs mb-2",
              isBiased ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
            )}
          >
            {isBiased ? "⚠ Biased System" : "✓ Fair System"}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={clsx(
                "text-4xl font-black",
                isBiased ? "text-red-600" : "text-emerald-600"
              )}
            >
              {result.total}
            </span>
            <span className="text-slate-400 text-sm">/100</span>
          </div>
        </div>
        <div
          className={clsx(
            "px-3 py-1.5 rounded-lg text-sm font-bold",
            isHired ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
          )}
        >
          {isHired ? "✓ HIRED" : "✗ REJECTED"}
        </div>
      </div>

      {/* Score bar */}
      <div className="bg-white/60 rounded-full h-2.5 overflow-hidden">
        <div
          className={clsx("h-2.5 rounded-full transition-all duration-700", isBiased ? "bg-red-500" : "bg-emerald-500")}
          style={{ width: `${result.total}%` }}
        />
      </div>

      {/* Score breakdown */}
      <div className="bg-white/70 rounded-xl p-3 flex flex-col gap-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Score Breakdown</p>
        {[
          { label: "Skills", value: result.breakdown.skills, max: isBiased ? 38 : 52 },
          { label: "Experience", value: result.breakdown.experience, max: isBiased ? 22 : 33 },
          { label: "Education", value: result.breakdown.education, max: isBiased ? 8 : 14 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-20">{item.label}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-slate-400 transition-all duration-500"
                style={{ width: `${Math.round((item.value / item.max) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-8 text-right">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Skill match */}
      <div>
        <p className="text-xs text-slate-500 mb-1.5">
          <strong className="text-slate-700">{result.matchedSkills?.length || 0}/7</strong> required skills matched
        </p>
        <div className="flex flex-wrap gap-1">
          {(result.matchedSkills || []).map((s) => (
            <span key={s} className="text-xs bg-white text-slate-600 border border-slate-200 rounded-md px-2 py-0.5">
              ✓ {s}
            </span>
          ))}
        </div>
      </div>

      {/* Bias factors */}
      {isBiased && hasBias && (
        <div className="bg-red-100 border border-red-200 rounded-xl p-3">
          <p className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">⚠ Bias Factors Applied</p>
          {result.breakdown.genderBias !== 0 && (
            <div className="flex justify-between text-xs text-red-700 mb-1">
              <span>Gender ({candidate?.gender})</span>
              <strong>{result.breakdown.genderBias > 0 ? "+" : ""}{result.breakdown.genderBias} pts</strong>
            </div>
          )}
          {result.breakdown.nameBias !== 0 && (
            <div className="flex justify-between text-xs text-red-700 mb-1">
              <span>Name perception</span>
              <strong>{result.breakdown.nameBias > 0 ? "+" : ""}{result.breakdown.nameBias} pts</strong>
            </div>
          )}
          <div className="border-t border-red-200 mt-2 pt-2 flex justify-between text-xs font-bold text-red-900">
            <span>Total bias impact</span>
            <span>{result.breakdown.totalBiasImpact > 0 ? "+" : ""}{result.breakdown.totalBiasImpact} pts</span>
          </div>
        </div>
      )}

      {/* Fair system note */}
      {!isBiased && (
        <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-3">
          <p className="text-xs font-bold text-emerald-800 mb-1">Protected Attributes Ignored</p>
          <p className="text-xs text-emerald-700">
            Gender · Name · Age · Ethnicity · Religion — all zeroed out.
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Decision based solely on: Skills + Experience + Education
          </p>
        </div>
      )}
    </div>
  );
}
