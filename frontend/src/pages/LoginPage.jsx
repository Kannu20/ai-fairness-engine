import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function Particle({ style }) {
  return <span className="particle" style={style} />;
}

function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let start = 0;
      const step = end / 60;
      const id = setInterval(() => {
        start += step;
        if (start >= end) { setVal(end); clearInterval(id); }
        else setVal(Math.floor(start));
      }, 16);
      obs.disconnect();
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get("error") === "oauth_failed") setError("Google sign-in failed. Please try again.");
  }, [params]);

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const particles = Array.from({ length: 28 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${4 + Math.random() * 6}s`,
    opacity: 0.15 + Math.random() * 0.4,
  }));

  const glowX = mousePos.x;
  const glowY = mousePos.y;

  const stats = [
    { val: 94, suffix: "%", label: "Bias reduction rate" },
    { val: 12, suffix: "+", label: "Fairness metrics" },
    { val: 4,  suffix: "×", label: "Sectors covered" },
  ];

  const features = [
    { icon: "🔍", text: "Real-time bias detection" },
    { icon: "🧠", text: "XAI plain-English reports" },
    { icon: "🛡️", text: "One-click fairness fix" },
    { icon: "📋", text: "EU AI Act compliance" },
  ];

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (!res.success) setError(res.message || "Login failed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div
        className="cursor-glow"
        style={{ left: glowX, top: glowY }}
      />

      <div className="particles-layer" aria-hidden>
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      <div className="grid-overlay" aria-hidden />

      <div className="lp-layout">

        <div className="lp-left">
          <div className="lp-logo">
            <div className="logo-icon">⚖</div>
            <span className="logo-text">Equi<em>Sense</em></span>
          </div>

          <div className="lp-left-content">
            <div className="lp-badge">
              <span className="badge-dot" />
              Google Solution Challenge 2026
            </div>

            <h1 className="lp-headline">
              AI decisions<br />
              should be<br />
              <span className="headline-accent">fair for all.</span>
            </h1>

            <p className="lp-sub">
              Detect, explain, and fix bias in your AI systems — across
              healthcare, hiring, credit, and justice. In real time.
            </p>

            <div className="lp-stats">
              {stats.map((s, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-num">
                    <Counter end={s.val} suffix={s.suffix} />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="lp-features">
              {features.map((f, i) => (
                <div className="feature-pill" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="sdg-row">
            <span className="sdg-tag sdg-10">SDG 10</span>
            <span className="sdg-tag sdg-16">SDG 16</span>
            <span className="sdg-tag sdg-3">SDG 3</span>
          </div>
        </div>

        <div className="lp-right">
          <div className="auth-card">
            <div className="card-glow-bar" />

            <div className="auth-header">
              <div className="auth-icon">
                <span>⚖</span>
              </div>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-desc">
                Sign in to start auditing your AI models for bias and fairness.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              className={`google-btn ${hovering ? "google-btn--hover" : ""}`}
              onClick={loginWithGoogle}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              aria-label="Continue with Google"
            >
              <span className="google-btn__icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              <span className="google-btn__text">Continue with Google</span>
              <span className="google-btn__arrow">→</span>
            </button>

            <div className="auth-divider">
              <span />
              <p>or sign in with email</p>
              <span />
            </div>

            <form onSubmit={handleEmailLogin} className="email-form">
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="auth-link">
                Sign up
              </button>
            </p>

            <div className="trust-row">
              <div className="trust-item">
                <span>🔒</span>
                <p>End-to-end encrypted</p>
              </div>
              <div className="trust-item">
                <span>✅</span>
                <p>GDPR compliant</p>
              </div>
            </div>

            <div className="auth-perks">
              <p className="perks-title">What you get for free</p>
              <div className="perks-list">
                {[
                  "5 model audits per month",
                  "7 protected attribute checks",
                  "XAI explanation reports",
                  "Compliance report downloads",
                ].map((p, i) => (
                  <div className="perk-row" key={i}>
                    <span className="perk-check">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="auth-tos">
              By signing in, you agree to our{" "}
              <a href="#terms">Terms of Service</a> and{" "}
              <a href="#privacy">Privacy Policy</a>.
            </p>
          </div>

          <div className="tech-badges">
            <span className="tech-badge">Vertex AI</span>
            <span className="tech-badge">Gemini API</span>
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">React</span>
          </div>
        </div>

      </div>
    </div>
  );
}
