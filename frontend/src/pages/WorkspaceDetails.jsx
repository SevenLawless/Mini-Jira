import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function WorkspaceDetails() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);

  const [workspaceName, setWorkspaceName] = useState("");
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getWorkspace() {
    const response = await api.get(`/workspaces/${workspaceId}`);
    setWorkspace(response.data.workspace);
    setWorkspaceName(response.data.workspace.name);
  }

  async function getProjects() {
    const response = await api.get(`/workspaces/${workspaceId}/projects`);
    setProjects(response.data.projects);
  }

  useEffect(() => {
    async function loadWorkspacePage() {
      try {
        setLoading(true);
        await getWorkspace();
        await getProjects();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspacePage();
  }, [workspaceId]);

  async function handleUpdateWorkspace(e) {
    e.preventDefault();
    setError("");

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      await api.patch(`/workspaces/${workspaceId}`, {
        name: workspaceName,
      });

      await getWorkspace();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update workspace");
    }
  }

  async function handleDeleteWorkspace() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/workspaces/${workspaceId}`);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete workspace");
    }
  }

  function handleProjectChange(e) {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreateProject(e) {
    e.preventDefault();
    setError("");

    if (!projectForm.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await api.post(`/workspaces/${workspaceId}/projects`, {
        name: projectForm.name,
        description: projectForm.description,
      });

      setProjectForm({
        name: "",
        description: "",
      });

      await getProjects();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create project");
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Loading workspace...</p>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Workspace not found.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <Link to="/dashboard">← Back to dashboard</Link>

      <h1>{workspace.name}</h1>

      <p>Your role: {workspace.role}</p>
      <p>Workspace ID: {workspace.id}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <section>
        <h2>Projects</h2>

        <form onSubmit={handleCreateProject}>
          <div>
            <label>Project name</label>
            <br />
            <input
              name="name"
              value={projectForm.name}
              onChange={handleProjectChange}
              placeholder="Example: Buggy MVP"
            />
          </div>

          <br />

          <div>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              value={projectForm.description}
              onChange={handleProjectChange}
              placeholder="Short project description"
              rows="3"
            />
          </div>

          <br />

          <button type="submit">Create Project</button>
        </form>

        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.name}</Link>
                {project.description && <> — {project.description}</>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      <section>
        <h2>Rename Workspace</h2>

        <form onSubmit={handleUpdateWorkspace}>
          <input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace name"
          />

          <button type="submit">Save</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Danger Zone</h2>
        <button onClick={handleDeleteWorkspace}>Delete Workspace</button>
      </section>
    </main>
  );
}

export default WorkspaceDetails;