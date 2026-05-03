import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark"></div>
          <span>Buggy</span>
        </div>
      </header>

      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">✓</div>
            <h1>Welcome back</h1>
            <p>Sign in to continue to your workspace.</p>
          </div>

          <div className="auth-tabs">
            <div className="auth-tab active">Sign In</div>
            <Link className="auth-tab" to="/register">
              Sign Up
            </Link>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
              />
            </div>

            <button className="primary-button" type="submit">
              Sign In
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-footer">
            No account yet? <Link to="/register">Create one</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;