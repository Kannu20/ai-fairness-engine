import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell, ScatterChart, Scatter, ZAxis,
} from "recharts";
import clsx from "clsx";

// Client-side scoring for stats page
const JOB_SKILLS = ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"];
const WESTERN_NAMES = new Set([
  "alex","john","michael","david","james","robert","william","emily",
  "sarah","jessica","jennifer","ryan","chris","kevin","andrew","matthew",
]);

function clientScore(c, biased) {
  const matched = c.skills.filter((s) =>
    JOB_SKILLS.map((j) => j.toLowerCase()).includes(s.toLowerCase())
  );
  if (!biased) {
    const f = Math.round((matched.length / JOB_SKILLS.length) * 52);
    const e = Math.min(Math.round(c.experience * 4.8), 33);
    const d = { PhD: 14, "Master's": 10, "Bachelor's": 5, "High School": 0 }[c.education] || 0;
    const t = Math.max(0, Math.min(100, f + e + d));
    return { total: t, decision: t >= 55 ? "HIRED" : "REJECTED", impact: 0 };
  }
  const f = Math.round((matched.length / JOB_SKILLS.length) * 38);
  const e = Math.min(Math.round(c.experience * 3.2), 22);
  const d = { PhD: 8, "Master's": 5, "Bachelor's": 2, "High School": 0 }[c.education] || 0;
  const g = { male: 18, female: -12, "non-binary": -5, "prefer not": 0 }[c.gender] || 0;
  const n = WESTERN_NAMES.has(c.name.split(" ")[0].toLowerCase()) ? 12 : -8;
  const t = Math.max(0, Math.min(100, f + e + d + g + n));
  return { total: t, decision: t >= 58 ? "HIRED" : "REJECTED", impact: g + n };
}

const ALL_SAMPLES = [
  { name: "Alex Johnson",    gender: "male",   education: "Bachelor's", experience: 5, skills: ["JavaScript","React","Node.js","Python","SQL"] },
  { name: "Priya Sharma",   gender: "female", education: "Master's",   experience: 6, skills: ["JavaScript","React","Node.js","Python","SQL"] },
  { name: "James Wilson",   gender: "male",   education: "Bachelor's", experience: 4, skills: ["JavaScript","React","SQL"] },
  { name: "Fatima Al-Hassan",gender:"female", education: "Bachelor's", experience: 4, skills: ["JavaScript","React","SQL"] },
  { name: "Ryan O'Brien",   gender: "male",   education: "PhD",        experience: 8, skills: ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"] },
  { name: "Wei Zhang",      gender: "male",   education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
  { name: "Maria Garcia",   gender: "female", education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
  { name: "David Miller",   gender: "male",   education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
];

export default function StatisticsView() {
  const rows = useMemo(() =>
    ALL_SAMPLES.map((c) => {
      const b = clientScore(c, true);
      const f = clientScore(c, false);
      return { ...c, biased: b.total, fair: f.total, impact: b.impact, biasedD: b.decision, fairD: f.decision };
    }), []
  );

  const maleRows    = rows.filter((r) => r.gender === "male");
  const femaleRows  = rows.filter((r) => r.gender === "female");
  const avgBiasedM  = Math.round(maleRows.reduce((a, r) => a + r.biased, 0) / maleRows.length);
  const avgBiasedF  = Math.round(femaleRows.reduce((a, r) => a + r.biased, 0) / femaleRows.length);
  const avgFairM    = Math.round(maleRows.reduce((a, r) => a + r.fair, 0) / maleRows.length);
  const avgFairF    = Math.round(femaleRows.reduce((a, r) => a + r.fair, 0) / femaleRows.length);
  const changedCount = rows.filter((r) => r.biasedD !== r.fairD).length;
  const maxBias     = Math.max(...rows.map((r) => Math.abs(r.biased - r.fair)));

  const chartData = rows.map((r) => ({
    name: r.name.split(" ")[0],
    Biased: r.biased,
    Fair: r.fair,
    gender: r.gender,
  }));

  const genderGapData = [
    { group: "Male avg — Biased",   score: avgBiasedM, fill: "#3b82f6" },
    { group: "Female avg — Biased", score: avgBiasedF, fill: "#f43f5e" },
    { group: "Male avg — Fair",     score: avgFairM,   fill: "#6366f1" },
    { group: "Female avg — Fair",   score: avgFairF,   fill: "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Candidates analyzed", value: rows.length, color: "text-indigo-600" },
          { label: "Decisions changed by bias", value: `${changedCount}/${rows.length}`, color: "text-red-600" },
          { label: "Avg penalty on female candidates", value: `${avgBiasedF - avgFairF} pts`, color: "text-red-600" },
          { label: "Max bias score swing", value: `${maxBias} pts`, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-400 mb-1 leading-tight">{s.label}</p>
            <p className={clsx("text-2xl font-black", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart — all candidates */}
      <div className="card">
        <p className="section-title">Biased vs Fair Scores — All Candidates</p>
        <p className="text-xs text-slate-400 mb-4">Candidates with comparable qualifications — score gaps reveal bias</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
              formatter={(v, n) => [`${v}/100`, n]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Biased" name="Biased System" radius={[3, 3, 0, 0]} barSize={18}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.gender === "female" ? "#f43f5e" : "#ef4444"} />
              ))}
            </Bar>
            <Bar dataKey="Fair" fill="#10b981" name="Fair System" radius={[3, 3, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 text-xs text-slate-400 mt-2 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded inline-block"/> Male biased</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-pink-500 rounded inline-block"/> Female biased (deeper penalty)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded inline-block"/> Fair system (merit-only)</span>
        </div>
      </div>

      {/* Gender gap chart */}
      <div className="card">
        <p className="section-title">Gender Gap: Biased vs Fair System</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={genderGapData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis dataKey="group" type="category" width={150} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={22}>
              {genderGapData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="bg-red-50 rounded-xl p-3 mt-3 text-xs text-red-700">
          <strong>Gender gap in biased system:</strong> Male avg {avgBiasedM} vs Female avg {avgBiasedF} = <strong>{avgBiasedM - avgBiasedF}-point gap</strong>.
          In the fair system: Male avg {avgFairM} vs Female avg {avgFairF} = <strong>{Math.abs(avgFairM - avgFairF)}-point gap</strong>.
          Bias amplifies the gap by <strong>{(avgBiasedM - avgBiasedF) - Math.abs(avgFairM - avgFairF)} points</strong>.
        </div>
      </div>

      {/* Full table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="section-title">Full Candidate Dataset</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Candidate</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Gender</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Education</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-red-500">Biased</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-emerald-600">Fair</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500">Impact</th>
              <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500">Changed?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-medium text-slate-800">{r.name}</td>
                <td className="px-4 py-2.5">
                  <span className={clsx(
                    "badge text-xs",
                    r.gender === "female" ? "bg-pink-50 text-pink-700" :
                    r.gender === "male" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {r.gender}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{r.education}</td>
                <td className="px-4 py-2.5 text-center font-bold text-red-600">{r.biased}</td>
                <td className="px-4 py-2.5 text-center font-bold text-emerald-600">{r.fair}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={clsx(
                    "text-xs font-bold",
                    r.impact < 0 ? "text-red-600" : r.impact > 0 ? "text-amber-600" : "text-slate-300"
                  )}>
                    {r.impact > 0 ? `+${r.impact}` : r.impact === 0 ? "—" : r.impact}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {r.biasedD !== r.fairD ? (
                    <span className="badge bg-red-100 text-red-700 text-xs">YES ⚠</span>
                  ) : (
                    <span className="badge bg-slate-100 text-slate-500 text-xs">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
