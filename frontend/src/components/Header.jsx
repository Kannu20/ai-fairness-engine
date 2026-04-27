import React, { useState, useEffect } from "react";
import { metaAPI } from "../utils/api";

export default function Header({ apiKey, setApiKey }) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    metaAPI.health()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const saveKey = () => {
    setApiKey(keyDraft);
    setShowKeyInput(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-base">⚖️</div>
          <div>
            <span className="font-bold text-slate-900 text-sm">AI Fairness Engine</span>
            <span className="hidden sm:inline text-slate-400 text-xs ml-2">Bias Detection & Elimination</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Backend status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <div className={`w-2 h-2 rounded-full ${
              backendOnline === null ? "bg-slate-300" :
              backendOnline ? "bg-green-400" : "bg-amber-400"
            }`} />
            {backendOnline === null ? "Checking..." : backendOnline ? "API Online" : "Offline Mode"}
          </div>

          {/* Gemini badge */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5">
            <div className={`w-2 h-2 rounded-full ${apiKey ? "bg-green-400" : "bg-amber-400"}`} />
            <span className="text-xs font-semibold text-violet-700">Gemini AI</span>
            <button
              onClick={() => setShowKeyInput((p) => !p)}
              className="text-xs text-violet-500 underline hover:text-violet-700 transition-colors"
            >
              {apiKey ? "Connected ✓" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <div className="border-t border-slate-100 bg-violet-50">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-violet-700 whitespace-nowrap">Gemini API Key:</span>
            <input
              type="password"
              className="input max-w-sm text-xs"
              placeholder="AIzaSy..."
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
              autoFocus
            />
            <button onClick={saveKey} className="btn-primary text-xs py-2 px-4 rounded-lg">Save</button>
            <button onClick={() => setShowKeyInput(false)} className="btn-secondary text-xs py-2 px-3">Cancel</button>
            <span className="text-xs text-slate-400">
              Free at{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                 className="text-violet-500 underline">aistudio.google.com</a>
              {" "}· Stays in your browser only
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
