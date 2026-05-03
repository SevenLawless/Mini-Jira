import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getCurrentUser() {
    const response = await api.get("/auth/me");
    setUser(response.data.user);
  }

  async function getWorkspaces() {
    const response = await api.get("/workspaces");
    setWorkspaces(response.data.workspaces);
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        await getCurrentUser();
        await getWorkspaces();
      } catch (error) {
        setError("You must login first");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  async function handleCreateWorkspace(e) {
    e.preventDefault();
    setError("");

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      await api.post("/workspaces", {
        name: workspaceName,
      });

      setWorkspaceName("");
      await getWorkspaces();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create workspace");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>

      {user && (
        <section>
          <p>Logged in as: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </section>
      )}

      <hr />

      <section>
        <h2>Your Workspaces</h2>

        <form onSubmit={handleCreateWorkspace}>
          <input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace name"
          />

          <button type="submit">Create Workspace</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {workspaces.length === 0 ? (
          <p>No workspaces yet.</p>
        ) : (
          <ul>
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <Link to={`/workspaces/${workspace.id}`}>
                  {workspace.name}
                </Link>{" "}
                — {workspace.role}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Dashboard;