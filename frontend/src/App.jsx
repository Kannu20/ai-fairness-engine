import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

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
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
