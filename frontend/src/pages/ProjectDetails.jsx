import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getProject() {
    const response = await api.get(`/projects/${projectId}`);

    setProject(response.data.project);
    setColumns(response.data.columns);

    setForm({
      name: response.data.project.name,
      description: response.data.project.description || "",
    });
  }

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        await getProject();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdateProject(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await api.patch(`/projects/${projectId}`, {
        name: form.name,
        description: form.description,
      });

      await getProject();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update project");
    }
  }

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${projectId}`);
      navigate(`/workspaces/${project.workspace_id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete project");
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Loading project...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Project not found.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <Link to={`/workspaces/${project.workspace_id}`}>
        ← Back to workspace
      </Link>

      <h1>{project.name}</h1>

      {project.description && <p>{project.description}</p>}

      <p>Workspace ID: {project.workspace_id}</p>
      <p>Your role: {project.role}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <section>
        <h2>Board Columns</h2>

        {columns.length === 0 ? (
          <p>No columns found.</p>
        ) : (
          <ul>
            {columns.map((column) => (
              <li key={column.id}>
                {column.position}. {column.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      <section>
        <h2>Edit Project</h2>

        <form onSubmit={handleUpdateProject}>
          <div>
            <label>Project name</label>
            <br />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Project name"
            />
          </div>

          <br />

          <div>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Project description"
              rows="3"
            />
          </div>

          <br />

          <button type="submit">Save Project</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Danger Zone</h2>
        <button onClick={handleDeleteProject}>Delete Project</button>
      </section>
    </main>
  );
}

export default ProjectDetails;