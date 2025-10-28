import { useEffect, useState } from "react";
import "../App.css"; // reuse existing app styles
import "./login.css";
import { login as apiLogin } from "../api";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  // Restore lock/attempt data from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem("login_attempts");
      const locked = localStorage.getItem("login_locked_until");
      if (s) setAttempts(Number(s));
      if (locked) setLockedUntil(Number(locked));
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // Unlock when time passes
  useEffect(() => {
    if (!lockedUntil) return;
    const now = Date.now();
    if (now >= lockedUntil) {
      setLockedUntil(null);
      setAttempts(0);
      try {
        localStorage.removeItem("login_locked_until");
        localStorage.removeItem("login_attempts");
      } catch {
        /* ignore storage errors */
      }
    }
  }, [lockedUntil, attempts]);

  const sanitize = (str) => String(str).replace(/[<>]/g, "");

  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

  const validatePassword = (value) => {
    if (!value || value.length < 8)
      return { ok: false, reason: "Password must be at least 8 characters" };
    if (!/[0-9]/.test(value))
      return { ok: false, reason: "Password must include a number" };
    if (!/[a-zA-Z]/.test(value))
      return { ok: false, reason: "Password must include a letter" };
    return { ok: true };
  };

  const lockFor = (ms) => {
    const until = Date.now() + ms;
    setLockedUntil(until);
    try {
      localStorage.setItem("login_locked_until", String(until));
    } catch {
      /* ignore storage errors */
    }
  };

  const recordFailedAttempt = () => {
    const next = attempts + 1;
    setAttempts(next);
    try {
      localStorage.setItem("login_attempts", String(next));
    } catch {
      /* ignore storage errors */
    }
    if (next >= 5) {
      lockFor(5 * 60 * 1000);
      setError("Too many failed attempts. Try again in 5 minutes.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (lockedUntil && Date.now() < lockedUntil) {
      const seconds = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Locked. Try again in ${seconds} seconds.`);
      return;
    }

    const sEmail = sanitize(email);
    const sPassword = sanitize(password);

    if (!validateEmail(sEmail)) {
      setError("Please enter a valid email address.");
      recordFailedAttempt();
      return;
    }

    const pwCheck = validatePassword(sPassword);
    if (!pwCheck.ok) {
      setError(pwCheck.reason);
      recordFailedAttempt();
      return;
    }

    setLoading(true);
    apiLogin(sEmail, sPassword)
      .then((data) => {
        setLoading(false);
        try {
          if (data && data.token) {
            if (remember) localStorage.setItem("auth_token", data.token);
            else sessionStorage.setItem("auth_token", data.token);
          }
        } catch { /* empty */ }

        try {
          localStorage.removeItem("login_attempts");
          localStorage.removeItem("login_locked_until");
        } catch { /* empty */ }

        setAttempts(0);
        setLockedUntil(null);
        setError("");
        onLogin((data && data.user) || sEmail, {
          remember,
          token: data && data.token,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error("Login error:", err, err?.response?.data);
        const status = err?.response?.status;
        if (status === 401) setError("Invalid email or password.");
        else if (status === 429) setError("Too many requests. Try again later.");
        else if (!navigator.onLine) setError("No network connection.");
        else {
          const serverMsg = err?.response?.data?.message || err?.response?.data || null;
          const devDetails =
            import.meta.env.DEV && serverMsg
              ? ` (${status || "err"}) ${JSON.stringify(serverMsg)}`
              : "";
          setError(
            err?.response?.data?.message ||
              `Login failed. Please try again.${devDetails}`
          );
        }
        recordFailedAttempt();
      });
  };

  return (
    <div className="login-page">
      <div className="login-card animate-in" role="region" aria-labelledby="login-title">
        <h2 id="login-title">Welcome back 👋</h2>
        <p className="muted">Sign in to access <b>iCodeEditor</b></p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label className="field">
            <span className="label-text">Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </label>

          <label className="field">
            <span className="label-text">Password</span>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-required="true"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <div className="controls-row">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>
              Forgot?
            </a>
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <button
            className="primary"
            type="submit"
            disabled={loading || (lockedUntil && Date.now() < lockedUntil)}
          >
            {loading ? <span className="spinner" aria-hidden="true" /> : "Sign in"}
          </button>

          <div className="divider">or continue with</div>

          <div className="social-row">
            <button
              className="social google"
              type="button"
              onClick={() => alert("Google login (coming soon)")}
            >
              Google
            </button>
            <button
              className="social github"
              type="button"
              onClick={() => alert("GitHub login (coming soon)")}
            >
              GitHub
            </button>
          </div>

          <p className="signup">
            New here?{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
