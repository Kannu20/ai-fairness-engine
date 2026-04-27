import React, { useState } from "react";
import clsx from "clsx";

const JOB_SKILLS = ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"];

const SAMPLES = [
  { name: "Alex Johnson",    gender: "male",   education: "Bachelor's", experience: 5, skills: ["JavaScript","React","Node.js","Python","SQL"] },
  { name: "Priya Sharma",   gender: "female", education: "Master's",   experience: 6, skills: ["JavaScript","React","Node.js","Python","SQL"] },
  { name: "James Wilson",   gender: "male",   education: "Bachelor's", experience: 4, skills: ["JavaScript","React","SQL"] },
  { name: "Fatima Al-Hassan",gender:"female", education: "Bachelor's", experience: 4, skills: ["JavaScript","React","SQL"] },
  { name: "Ryan O'Brien",   gender: "male",   education: "PhD",        experience: 8, skills: ["JavaScript","React","Node.js","Python","SQL","AWS","TypeScript"] },
  { name: "Wei Zhang",      gender: "male",   education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
  { name: "Maria Garcia",   gender: "female", education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
  { name: "David Miller",   gender: "male",   education: "Master's",   experience: 7, skills: ["JavaScript","React","Node.js","Python","SQL","AWS"] },
];

export default function CandidateForm({ candidate, onChange, onAnalyze, loading }) {
  const [skillInput, setSkillInput] = useState("");

  const update = (field, value) => onChange({ [field]: value });

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !candidate.skills.includes(s)) {
      update("skills", [...candidate.skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => update("skills", candidate.skills.filter((s) => s !== skill));

  const loadSample = (s) => onChange({ ...s });

  return (
    <div className="flex flex-col gap-4">
      {/* Job info */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
        <p className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">Target Position</p>
        <p className="font-semibold text-slate-800 text-sm">Senior Software Engineer</p>
        <p className="text-xs text-slate-500 mb-2">Required skills:</p>
        <div className="flex flex-wrap gap-1">
          {JOB_SKILLS.map((s) => (
            <span key={s} className="text-xs bg-white text-indigo-600 border border-indigo-200 rounded-md px-2 py-0.5">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Sample buttons */}
      <div className="card-sm">
        <p className="label">Quick load candidate</p>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s.name}
              onClick={() => loadSample(s)}
              className={clsx(
                "text-xs px-2.5 py-1 rounded-lg border font-medium transition-all",
                candidate.name === s.name
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              {s.name.split(" ")[0]}
            </button>
          ))}
        </div>
        {candidate.name === "Priya Sharma" || candidate.name === "Fatima Al-Hassan" ? (
          <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-2 py-1">
            💡 Tip: Compare with {candidate.name.includes("Priya") ? "Alex Johnson" : "James Wilson"} — identical skills, different demographics
          </p>
        ) : null}
      </div>

      {/* Form fields */}
      <div className="card-sm flex flex-col gap-3">
        <p className="label">Candidate details</p>

        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            value={candidate.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Jordan Taylor"
          />
        </div>

        <div>
          <label className="label">Gender</label>
          <select className="select" value={candidate.gender} onChange={(e) => update("gender", e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="label">Education</label>
          <select className="select" value={candidate.education} onChange={(e) => update("education", e.target.value)}>
            <option>High School</option>
            <option>Bachelor's</option>
            <option>Master's</option>
            <option>PhD</option>
          </select>
        </div>

        <div>
          <label className="label">
            Experience —{" "}
            <span className="text-indigo-600 font-bold normal-case">{candidate.experience} years</span>
          </label>
          <input
            type="range" min="0" max="20" step="1"
            value={candidate.experience}
            onChange={(e) => update("experience", +e.target.value)}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-0.5">
            <span>0yr</span><span>10yr</span><span>20yr</span>
          </div>
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              className="input"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
              placeholder="Type skill + Enter"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-bold rounded-lg px-3 transition-colors"
            >+</button>
          </div>

          {/* Current skills */}
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-8">
            {candidate.skills.map((s) => (
              <span
                key={s}
                className={clsx(
                  "inline-flex items-center gap-1 text-xs rounded-lg px-2 py-1 font-medium",
                  JOB_SKILLS.map((j) => j.toLowerCase()).includes(s.toLowerCase())
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                )}
              >
                {JOB_SKILLS.map((j) => j.toLowerCase()).includes(s.toLowerCase()) ? "✓ " : ""}{s}
                <button
                  onClick={() => removeSkill(s)}
                  className="text-slate-400 hover:text-red-500 font-bold ml-0.5 transition-colors"
                >×</button>
              </span>
            ))}
          </div>

          {/* Quick-add missing */}
          {JOB_SKILLS.filter((s) => !candidate.skills.includes(s)).length > 0 && (
            <div className="text-xs text-slate-400">
              Add:{" "}
              {JOB_SKILLS.filter((s) => !candidate.skills.includes(s)).slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="text-indigo-500 hover:text-indigo-700 underline mr-2 transition-colors"
                >{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analyze button */}
      <button
        className="btn-primary w-full py-3 text-base"
        onClick={onAnalyze}
        disabled={loading || !candidate.name.trim()}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyzing...
          </span>
        ) : (
          "⚡ Analyze Candidate"
        )}
      </button>
    </div>
  );
}
