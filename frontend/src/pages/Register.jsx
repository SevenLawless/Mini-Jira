import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const response = await api.post("/auth/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
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
            <div className="auth-icon">+</div>
            <h1>Create account</h1>
            <p>Start tracking bugs, projects, and team workspaces.</p>
          </div>

          <div className="auth-tabs">
            <Link className="auth-tab" to="/login">
              Sign In
            </Link>
            <div className="auth-tab active">Sign Up</div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

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
                placeholder="At least 6 characters"
              />
            </div>

            <button className="primary-button" type="submit">
              Create Account
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;