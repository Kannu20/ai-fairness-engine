import React from "react";
import clsx from "clsx";

export default function ComparisonTable({ biased, fair, analysis }) {
  if (!biased || !fair) return null;

  const rows = [
    { label: "Total Score", b: biased.total, f: fair.total, type: "score" },
    { label: "Decision", b: biased.decision, f: fair.decision, type: "decision" },
    { label: "Skills Score", b: biased.breakdown.skills, f: fair.breakdown.skills, type: "number" },
    { label: "Experience Score", b: biased.breakdown.experience, f: fair.breakdown.experience, type: "number" },
    { label: "Education Score", b: biased.breakdown.education, f: fair.breakdown.education, type: "number" },
    { label: "Gender Bias ⚠", b: biased.breakdown.genderBias, f: 0, type: "bias" },
    { label: "Name Perception Bias ⚠", b: biased.breakdown.nameBias, f: 0, type: "bias" },
    { label: "Total Bias Impact ⚠", b: biased.breakdown.totalBiasImpact, f: 0, type: "bias-total" },
    { label: "Fairness Index", b: `${100 - Math.abs(biased.breakdown.totalBiasImpact) * 2}%`, f: "100%", type: "percent" },
  ];

  const formatValue = (val, type, side) => {
    if (type === "decision") {
      const isHired = val === "HIRED";
      return (
        <span className={clsx("badge text-xs", isHired ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>
          {isHired ? "✓ HIRED" : "✗ REJECTED"}
        </span>
      );
    }
    if (type === "score") {
      return <span className={clsx("font-black text-lg", side === "b" ? "text-red-600" : "text-emerald-600")}>{val}</span>;
    }
    if (type === "bias" || type === "bias-total") {
      const n = +val;
      return (
        <span className={clsx("font-bold", n > 0 ? "text-amber-600" : n < 0 ? "text-red-600" : "text-slate-300")}>
          {n > 0 ? `+${n}` : n === 0 ? "—" : n}
        </span>
      );
    }
    if (type === "percent") return <span className="font-semibold">{val}</span>;
    return <span>{val}</span>;
  };

  const getDiff = (b, f, type) => {
    if (type === "decision") return b === f ? null : "CHANGED";
    if (type === "percent") return null;
    const diff = +b - +f;
    if (diff === 0) return null;
    return diff;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Biased Score", value: biased.total, color: "text-red-600" },
          { label: "Fair Score", value: fair.total, color: "text-emerald-600" },
          {
            label: "Bias Impact",
            value: `${analysis.biasImpact > 0 ? "+" : ""}${analysis.biasImpact} pts`,
            color: analysis.biasImpact < 0 ? "text-red-600" : analysis.biasImpact > 0 ? "text-amber-600" : "text-slate-400",
          },
          {
            label: "Decision Changed",
            value: analysis.decisionChanged ? "YES ⚠" : "No",
            color: analysis.decisionChanged ? "text-red-600" : "text-emerald-600",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={clsx("text-xl font-black", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 w-48">Factor</th>
              <th className="text-center text-xs font-semibold text-red-500 px-4 py-3">Biased System</th>
              <th className="text-center text-xs font-semibold text-emerald-600 px-4 py-3">Fair System</th>
              <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const diff = getDiff(row.b, row.f, row.type);
              const isBiasRow = row.type === "bias" || row.type === "bias-total";
              return (
                <tr
                  key={i}
                  className={clsx(
                    "border-b border-slate-50 transition-colors",
                    isBiasRow ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"
                  )}
                >
                  <td className={clsx("px-4 py-2.5 font-medium", isBiasRow ? "text-red-700" : "text-slate-700")}>
                    {row.label}
                  </td>
                  <td className="text-center px-4 py-2.5">{formatValue(row.b, row.type, "b")}</td>
                  <td className="text-center px-4 py-2.5">{formatValue(row.f, row.type, "f")}</td>
                  <td className="text-center px-4 py-2.5">
                    {diff === "CHANGED" ? (
                      <span className="badge bg-red-100 text-red-700 text-xs">Changed ⚠</span>
                    ) : diff !== null ? (
                      <span className={clsx("font-semibold text-xs", +diff > 0 ? "text-red-600" : "text-emerald-600")}>
                        {+diff > 0 ? `+${diff}` : diff}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verdict box */}
      <div className={clsx(
        "rounded-2xl border-2 p-4",
        analysis.decisionChanged ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-200"
      )}>
        <p className="font-bold text-sm mb-1">
          {analysis.decisionChanged ? "🚨 Bias Changed the Outcome" : "⚠ Bias Detected"}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">{analysis.verdict}</p>
      </div>
    </div>
  );
}
