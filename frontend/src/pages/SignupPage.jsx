import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function Particle({ style }) {
  return <span className="particle" style={style} />;
}

export default function SignupPage() {
  const { loginWithGoogle, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("developer");
  const [loading, setLoading] = useState(false);

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await signupWithEmail(name, email, password, role);
      if (!res.success) setError(res.message || "Registration failed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="cursor-glow" style={{ left: glowX, top: glowY }} />

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
              Start building<br />
              <span className="headline-accent">fair AI today.</span>
            </h1>

            <p className="lp-sub">
              Join developers and auditors worldwide using EquiSense to detect
              and eliminate bias in AI decision-making systems.
            </p>
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
              <h2 className="auth-title">Create your account</h2>
              <p className="auth-desc">
                Get started with 5 free model audits per month.
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
              aria-label="Sign up with Google"
            >
              <span className="google-btn__icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              <span className="google-btn__text">Sign up with Google</span>
              <span className="google-btn__arrow">→</span>
            </button>

            <div className="auth-divider">
              <span />
              <p>or sign up with email</p>
              <span />
            </div>

            <form onSubmit={handleSignup} className="email-form">
              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
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
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="form-input"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-role">Role</label>
                <select
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                >
                  <option value="developer">Developer</option>
                  <option value="auditor">Auditor</option>
                  <option value="policymaker">Policymaker</option>
                </select>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="auth-link">
                Sign in
              </button>
            </p>

            <p className="auth-tos">
              By signing up, you agree to our{" "}
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
