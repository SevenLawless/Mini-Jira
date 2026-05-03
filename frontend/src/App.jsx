import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import ProjectDetails from "./pages/ProjectDetails";


function Home() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark"></div>
          <span>Buggy</span>
        </div>
      </header>

      <main className="home-page">
        <section className="home-card">
          <h1>Bug Tracking for Small Teams</h1>
          <p>
            A lightweight Mini Jira-style app for managing workspaces, projects,
            tasks, bugs, and team activity.
          </p>

          <div className="home-actions">
            <Link className="button-link" to="/register">
              Create Account
            </Link>
            <Link className="secondary-button" to="/login">
              Sign In
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspaces/:workspaceId" element={<WorkspaceDetails />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;