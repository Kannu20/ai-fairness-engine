import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("gemini_api_key") || ""
  );

  const handleSetApiKey = (key) => {
    setApiKey(key);
    if (key) localStorage.setItem("gemini_api_key", key);
    else localStorage.removeItem("gemini_api_key");
  };

  // Inject API key into requests via a global — picked up by explainAPI
  if (typeof window !== "undefined") {
    window.__GEMINI_KEY__ = apiKey;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header apiKey={apiKey} setApiKey={handleSetApiKey} />
      <main>
        <Routes>
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-16 py-6 text-center text-xs text-slate-400">
        <p>
          AI Fairness Engine · Built with React, Node.js, Google Gemini · Hackathon Demo
        </p>
        <p className="mt-1">
          Bias factors shown are for educational demonstration only.
          Real-world AI systems must not use protected attributes.
        </p>
      </footer>
    </div>
  );
}
