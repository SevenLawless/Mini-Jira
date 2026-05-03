const db = require("../db");

const DEFAULT_COLUMNS = ["Backlog", "To Do", "In Progress", "Review", "Done"];

async function getWorkspaceMembership(workspaceId, userId) {
  const [members] = await db.query(
    `
    SELECT role
    FROM workspace_members
    WHERE workspace_id = ? AND user_id = ?
    `,
    [workspaceId, userId]
  );

  return members[0] || null;
}

async function getProjectAccess(projectId, userId) {
  const [projects] = await db.query(
    `
    SELECT
      p.id,
      p.workspace_id,
      p.name,
      p.description,
      p.created_at,
      p.updated_at,
      wm.role
    FROM projects p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = ? AND wm.user_id = ?
    `,
    [projectId, userId]
  );

  return projects[0] || null;
}

function canManageProjects(role) {
  return role === "owner" || role === "admin";
}

async function getProjectsByWorkspace(req, res) {
  try {
    const { workspaceId } = req.params;

    const membership = await getWorkspaceMembership(workspaceId, req.user.id);

    if (!membership) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const [projects] = await db.query(
      `
      SELECT
        id,
        workspace_id,
        name,
        description,
        created_at,
        updated_at
      FROM projects
      WHERE workspace_id = ?
      ORDER BY created_at DESC
      `,
      [workspaceId]
    );

    res.json({ projects });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get projects",
      error: error.message,
    });
  }
}

async function createProject(req, res) {
  const connection = await db.getConnection();

  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      connection.release();

      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const membership = await getWorkspaceMembership(workspaceId, req.user.id);

    if (!membership) {
      connection.release();

      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (!canManageProjects(membership.role)) {
      connection.release();

      return res.status(403).json({
        message: "Only owners and admins can create projects",
      });
    }

    await connection.beginTransaction();

    const [projectResult] = await connection.query(
      `
      INSERT INTO projects (workspace_id, name, description)
      VALUES (?, ?, ?)
      `,
      [workspaceId, name.trim(), description || null]
    );

    const projectId = projectResult.insertId;

    for (let i = 0; i < DEFAULT_COLUMNS.length; i++) {
      await connection.query(
        `
        INSERT INTO board_columns (project_id, name, position)
        VALUES (?, ?, ?)
        `,
        [projectId, DEFAULT_COLUMNS[i], i + 1]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Project created successfully",
      project: {
        id: projectId,
        workspace_id: Number(workspaceId),
        name: name.trim(),
        description: description || null,
      },
      columns: DEFAULT_COLUMNS.map((columnName, index) => ({
        name: columnName,
        position: index + 1,
      })),
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  } finally {
    connection.release();
  }
}

async function getProjectById(req, res) {
  try {
    const { projectId } = req.params;

    const project = await getProjectAccess(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const [columns] = await db.query(
      `
      SELECT id, project_id, name, position
      FROM board_columns
      WHERE project_id = ?
      ORDER BY position ASC
      `,
      [projectId]
    );

    res.json({
      project,
      columns,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get project",
      error: error.message,
    });
  }
}

async function updateProject(req, res) {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await getProjectAccess(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!canManageProjects(project.role)) {
      return res.status(403).json({
        message: "Only owners and admins can update projects",
      });
    }

    await db.query(
      `
      UPDATE projects
      SET name = ?, description = ?
      WHERE id = ?
      `,
      [name.trim(), description || null, projectId]
    );

    res.json({
      message: "Project updated successfully",
      project: {
        id: Number(projectId),
        workspace_id: project.workspace_id,
        name: name.trim(),
        description: description || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
}

async function deleteProject(req, res) {
  try {
    const { projectId } = req.params;

    const project = await getProjectAccess(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!canManageProjects(project.role)) {
      return res.status(403).json({
        message: "Only owners and admins can delete projects",
      });
    }

    await db.query("DELETE FROM projects WHERE id = ?", [projectId]);

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
}

module.exports = {
  getProjectsByWorkspace,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};