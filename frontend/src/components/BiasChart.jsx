import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <strong>{p.value} pts</strong>
        </div>
      ))}
    </div>
  );
};

export default function BiasChart({ biased, fair }) {
  if (!biased || !fair) return null;

  const componentData = [
    {
      name: "Skills",
      Biased: biased.breakdown.skills,
      Fair: fair.breakdown.skills,
    },
    {
      name: "Experience",
      Biased: biased.breakdown.experience,
      Fair: fair.breakdown.experience,
    },
    {
      name: "Education",
      Biased: biased.breakdown.education,
      Fair: fair.breakdown.education,
    },
    {
      name: "Gender Bias",
      Biased: Math.abs(biased.breakdown.genderBias),
      Fair: 0,
      bias: true,
    },
    {
      name: "Name Bias",
      Biased: Math.abs(biased.breakdown.nameBias),
      Fair: 0,
      bias: true,
    },
  ];

  const impactData = [
    { name: "Gender\nbias", impact: biased.breakdown.genderBias },
    { name: "Name\nbias", impact: biased.breakdown.nameBias },
    { name: "Net\nbias", impact: biased.breakdown.totalBiasImpact },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Component breakdown chart */}
      <div className="card">
        <p className="section-title">Score Component Comparison</p>
        <p className="text-xs text-slate-400 mb-4">
          Bias and merit factors side by side — bias columns should be zero in a fair system
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={componentData} barSize={22} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 55]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Biased" fill="#ef4444" radius={[4, 4, 0, 0]}>
              {componentData.map((entry, i) => (
                <Cell key={i} fill={entry.bias ? "#f97316" : "#ef4444"} />
              ))}
            </Bar>
            <Bar dataKey="Fair" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 text-xs text-slate-400 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" /> Biased system score
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block" /> Bias factor (non-zero = discrimination)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Fair system score
          </span>
        </div>
      </div>

      {/* Bias impact chart */}
      <div className="card">
        <p className="section-title">Bias Impact Analysis</p>
        <p className="text-xs text-slate-400 mb-4">
          Positive values = unfair advantage · Negative = unfair penalty
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={impactData} barSize={36} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
            <Bar dataKey="impact" name="Bias pts" radius={[4, 4, 0, 0]}>
              {impactData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.impact > 0 ? "#f59e0b" : entry.impact < 0 ? "#ef4444" : "#94a3b8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total score comparison */}
      <div className="card">
        <p className="section-title">Total Score Comparison</p>
        <div className="flex gap-6 mb-3">
          {[
            { label: "Biased", score: biased.total, color: "bg-red-500" },
            { label: "Fair", score: fair.total, color: "bg-emerald-500" },
          ].map(({ label, score, color }) => (
            <div key={label} className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{label} System</span>
                <span className="font-bold">{score}/100</span>
              </div>
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${color} transition-all duration-700`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {biased.decision !== fair.decision && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 text-center font-semibold">
            🚨 Bias changed the hiring decision: {biased.decision} → {fair.decision}
          </div>
        )}
      </div>
    </div>
  );
}
