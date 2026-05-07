import React, { useState } from "react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import CandidateForm from "../components/CandidateForm";
import ScoreCard from "../components/ScoreCard";
import ComparisonTable from "../components/ComparisonTable";
import BiasChart from "../components/BiasChart";
import ExplanationPanel from "../components/ExplanationPanel";
import WhatIfSimulator from "../components/WhatIfSimulator";
import StatisticsView from "../components/StatisticsView";
import { useScoring } from "../hooks/useScoring";

const TABS = [
  { id: "analyze",  label: "⚡ Analyze",    desc: "Score a candidate" },
  { id: "compare",  label: "📊 Compare",    desc: "Side-by-side table" },
  { id: "charts",   label: "📈 Charts",     desc: "Visual breakdown" },
  { id: "whatif",   label: "🔬 What-If",    desc: "Simulate bias" },
  { id: "stats",    label: "📋 Statistics", desc: "Aggregate dataset" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("analyze");
  const {
    candidate, updateCandidate, setCandidate,
    results, loading, explanation, loadingExplanation,
    analyze,
  } = useScoring();

  const handleAnalyze = async () => {
    await analyze();
    if (tab === "analyze") {
      // stay — results will show inline
    }
  };

   const { user, logout } = useAuth();
  
    const stats = [
      { icon: "🔍", label: "Models Audited", val: user?.modelsAudited || 0, color: "teal" },
      { icon: "⚠️", label: "Bias Alerts",    val: 0,  color: "amber" },
      { icon: "📋", label: "Reports Generated", val: 0, color: "blue" },
      { icon: "🛡️", label: "Fixes Applied",  val: 0,  color: "green" },
    ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="dash-root">
      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="dash-nav">
        <div className="dash-nav__logo">
          <div className="logo-icon-sm">⚖</div>
          <span>Equi<em>Sense</em></span>
        </div>
        <div className="dash-nav__right">
          <div className="nav-badge">Free Plan</div>
          <div className="nav-user">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="nav-avatar" referrerPolicy="no-referrer" />
              : <div className="nav-avatar-fallback">{user?.name?.[0]}</div>
            }
            <span className="nav-name">{user?.name}</span>
          </div>
          <button className="nav-logout" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="dash-body">
        {/* Welcome banner */}
        <div className="dash-welcome">
          <div>
            <div className="dash-badge">🎉 You're in — let's detect some bias</div>
            <h1 className="dash-title">Welcome back, <span>{user?.name?.split(" ")[0]}</span></h1>
            <p className="dash-sub">Your AI fairness audit dashboard. Start by uploading a model or connecting an API endpoint.</p>
          </div>
          <button className="cta-btn">+ Audit New Model</button>
        </div>

        {/* Stats grid */}
        <div className="dash-stats">
          {stats.map((s, i) => (
            <div className={`stat-card stat-card--${s.color}`} key={i}>
              <div className="stat-card__icon">{s.icon}</div>
              <div className="stat-card__val">{s.val}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="dash-empty">
          <div className="empty-icon">🔍</div>
          <h3>No models audited yet</h3>
          <p>Upload your first AI model or connect an API endpoint to start detecting bias.</p>
          <button className="cta-btn cta-btn--sm">Upload Model →</button>
        </div>
      </div>
    </div>
      <div className="text-center mb-8">
        <span className="badge bg-amber-100 text-amber-700 mb-3 inline-block">
          ⚡ Hackathon Demo — AI Ethics & Fairness
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight">
          AI Decision Fairness Engine
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          Detect hidden bias in automated hiring decisions. Compare biased vs. fair AI systems
          side-by-side in real time. Powered by{" "}
          <span className="text-violet-600 font-semibold">Google Gemini AI</span>.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
          {[
            { label: "Bias factors tracked", value: "4" },
            { label: "Protected attributes", value: "5+" },
            { label: "XAI explanation layer", value: "Gemini" },
            { label: "Use cases", value: "Hiring" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-black text-indigo-600">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "tab-btn flex-1 whitespace-nowrap px-3 py-2",
              tab === t.id ? "active" : ""
            )}
          >
            <span className="block text-sm">{t.label}</span>
            <span className={clsx("block text-xs mt-0.5", tab === t.id ? "text-indigo-200" : "text-slate-400")}>
              {t.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ── ANALYZE TAB ── */}
      {tab === "analyze" && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar — form */}
          <div>
            <CandidateForm
              candidate={candidate}
              onChange={updateCandidate}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>

          {/* Main — results */}
          <div className="flex flex-col gap-5">
            {!results ? (
              <div className="card flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="text-6xl">⚖️</div>
                <h2 className="text-lg font-bold text-slate-700">Ready to Detect Bias</h2>
                <p className="text-sm text-slate-400 max-w-xs">
                  Fill in candidate details and click <strong>Analyze Candidate</strong> to see how the
                  biased and fair AI systems evaluate them differently.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {["Alex Johnson → Priya Sharma", "James Wilson → Fatima Al-Hassan"].map((s) => (
                    <span key={s} className="badge bg-amber-50 text-amber-700 text-xs">{s}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Try these pairs to see bias in action ↑</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 animate-slide-in">
                {/* Score cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ScoreCard result={results.biased} candidate={candidate} />
                  <ScoreCard result={results.fair}   candidate={candidate} />
                </div>

                {/* Decision-changed alert */}
                {results.analysis?.decisionChanged && (
                  <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <p className="font-bold text-red-800 text-sm mb-1">Bias Changed the Hiring Decision!</p>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Biased system: <strong>{results.biased.total}/100 → {results.biased.decision}</strong>
                        &nbsp;·&nbsp; Fair system: <strong>{results.fair.total}/100 → {results.fair.decision}</strong>
                        <br />
                        A {Math.abs(results.analysis.biasImpact)}-point bias was applied to{" "}
                        <strong>{candidate.name}</strong> based on demographics alone.
                        This constitutes illegal discrimination under EEOC guidelines.
                      </p>
                    </div>
                  </div>
                )}

                {/* Fairness index */}
                <div className="card-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-600">System Fairness Index</p>
                    <span className={clsx(
                      "badge text-xs",
                      (results.analysis?.fairnessIndex || 100) >= 80
                        ? "bg-emerald-100 text-emerald-700"
                        : (results.analysis?.fairnessIndex || 100) >= 50
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {results.analysis?.fairnessIndex ?? 100}%
                    </span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={clsx(
                        "h-2.5 rounded-full transition-all duration-700",
                        (results.analysis?.fairnessIndex || 100) >= 80 ? "bg-emerald-500" :
                        (results.analysis?.fairnessIndex || 100) >= 50 ? "bg-amber-400" : "bg-red-500"
                      )}
                      style={{ width: `${results.analysis?.fairnessIndex ?? 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    100% = perfectly fair · Below 80% = significant bias detected
                  </p>
                </div>

                {/* XAI explanation */}
                <ExplanationPanel results={results} candidate={candidate} />

                {/* Quick nav to other tabs */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "compare", label: "📊 View Full Comparison →" },
                    { id: "charts",  label: "📈 See Charts →" },
                    { id: "whatif",  label: "🔬 Run What-If →" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} className="btn-secondary text-xs">
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COMPARE TAB ── */}
      {tab === "compare" && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div>
            <CandidateForm
              candidate={candidate}
              onChange={updateCandidate}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>
          <div>
            {!results ? (
              <NoResults onGo={() => setTab("analyze")} />
            ) : (
              <ComparisonTable
                biased={results.biased}
                fair={results.fair}
                analysis={results.analysis}
              />
            )}
          </div>
        </div>
      )}

      {/* ── CHARTS TAB ── */}
      {tab === "charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div>
            <CandidateForm
              candidate={candidate}
              onChange={updateCandidate}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>
          <div>
            {!results ? (
              <NoResults onGo={() => setTab("analyze")} />
            ) : (
              <BiasChart biased={results.biased} fair={results.fair} />
            )}
          </div>
        </div>
      )}

      {/* ── WHAT-IF TAB ── */}
      {tab === "whatif" && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div>
            <CandidateForm
              candidate={candidate}
              onChange={updateCandidate}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>
          <div>
            <WhatIfSimulator candidate={candidate} baseResults={results} />
          </div>
        </div>
      )}

      {/* ── STATISTICS TAB ── */}
      {tab === "stats" && (
        <StatisticsView />
      )}
    </div>
  );
}

function NoResults({ onGo }) {
  return (
    <div className="card flex flex-col items-center py-20 gap-4 text-center">
      <div className="text-5xl">📊</div>
      <p className="text-slate-500 text-sm">Analyze a candidate first to see results here.</p>
      <button onClick={onGo} className="btn-secondary text-sm">
        Go to Analyze →
      </button>
    </div>
  );
}
