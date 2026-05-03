const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
  getProjectsByWorkspace,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(requireAuth);

router.get("/workspaces/:workspaceId/projects", getProjectsByWorkspace);
router.post("/workspaces/:workspaceId/projects", createProject);

router.get("/projects/:projectId", getProjectById);
router.patch("/projects/:projectId", updateProject);
router.delete("/projects/:projectId", deleteProject);

module.exports = router;