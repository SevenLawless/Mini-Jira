const db = require("../db");

async function getUserWorkspaces(req, res) {
  try {
    const [workspaces] = await db.query(
      `
      SELECT 
        w.id,
        w.name,
        w.owner_id,
        wm.role,
        w.created_at,
        w.updated_at
      FROM workspaces w
      JOIN workspace_members wm ON wm.workspace_id = w.id
      WHERE wm.user_id = ?
      ORDER BY w.created_at DESC
      `,
      [req.user.id]
    );

    res.json({ workspaces });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get workspaces",
      error: error.message,
    });
  }
}

async function createWorkspace(req, res) {
  const connection = await db.getConnection();

  try {
    const { name } = req.body;

    if (!name) {
      connection.release();

      return res.status(400).json({
        message: "Workspace name is required",
      });
    }

    await connection.beginTransaction();

    const [workspaceResult] = await connection.query(
      "INSERT INTO workspaces (name, owner_id) VALUES (?, ?)",
      [name, req.user.id]
    );

    const workspaceId = workspaceResult.insertId;

    await connection.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES (?, ?, ?)
      `,
      [workspaceId, req.user.id, "owner"]
    );

    await connection.commit();

    res.status(201).json({
      message: "Workspace created successfully",
      workspace: {
        id: workspaceId,
        name,
        owner_id: req.user.id,
        role: "owner",
      },
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Failed to create workspace",
      error: error.message,
    });
  } finally {
    connection.release();
  }
}

async function getWorkspaceById(req, res) {
  try {
    const { workspaceId } = req.params;

    const [workspaces] = await db.query(
      `
      SELECT 
        w.id,
        w.name,
        w.owner_id,
        wm.role,
        w.created_at,
        w.updated_at
      FROM workspaces w
      JOIN workspace_members wm ON wm.workspace_id = w.id
      WHERE w.id = ? AND wm.user_id = ?
      `,
      [workspaceId, req.user.id]
    );

    if (workspaces.length === 0) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    res.json({ workspace: workspaces[0] });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get workspace",
      error: error.message,
    });
  }
}

async function updateWorkspace(req, res) {
  try {
    const { workspaceId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required",
      });
    }

    const [members] = await db.query(
      `
      SELECT role
      FROM workspace_members
      WHERE workspace_id = ? AND user_id = ?
      `,
      [workspaceId, req.user.id]
    );

    if (members.length === 0) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const role = members[0].role;

    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({
        message: "Only owners and admins can update this workspace",
      });
    }

    await db.query(
      "UPDATE workspaces SET name = ? WHERE id = ?",
      [name, workspaceId]
    );

    res.json({
      message: "Workspace updated successfully",
      workspace: {
        id: Number(workspaceId),
        name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update workspace",
      error: error.message,
    });
  }
}

async function deleteWorkspace(req, res) {
  try {
    const { workspaceId } = req.params;

    const [members] = await db.query(
      `
      SELECT role
      FROM workspace_members
      WHERE workspace_id = ? AND user_id = ?
      `,
      [workspaceId, req.user.id]
    );

    if (members.length === 0) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (members[0].role !== "owner") {
      return res.status(403).json({
        message: "Only the owner can delete this workspace",
      });
    }

    await db.query(
      "DELETE FROM workspaces WHERE id = ?",
      [workspaceId]
    );

    res.json({
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete workspace",
      error: error.message,
    });
  }
}

module.exports = {
  getUserWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};