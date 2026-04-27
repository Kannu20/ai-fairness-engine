import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Logging in dev
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// ─── SCORE ENDPOINTS ──────────────────────────────────────────────────────────
export const scoreAPI = {
  compare: (candidate) => api.post("/api/score/compare", candidate),
  biased:  (candidate) => api.post("/api/score/biased", candidate),
  fair:    (candidate) => api.post("/api/score/fair", candidate),
  whatif:  (candidate, whatif) => api.post("/api/score/whatif", { ...candidate, whatif }),
  batch:   (candidates) => api.post("/api/score/batch", { candidates }),
};

// ─── EXPLAIN ENDPOINTS ────────────────────────────────────────────────────────
export const explainAPI = {
  bias:   (candidate) => api.post("/api/explain/bias", candidate),
  resume: (text)      => api.post("/api/explain/resume", { text }),
  whatif: (original, modified) => api.post("/api/explain/whatif", { original, modified }),
};

// ─── META ENDPOINTS ───────────────────────────────────────────────────────────
export const metaAPI = {
  health:  () => api.get("/health"),
  samples: () => api.get("/api/samples"),
  domains: () => api.get("/api/domains"),
};

export default api;
