const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
  getUserWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} = require("../controllers/workspaceController");

const router = express.Router();

router.use(requireAuth);

router.get("/", getUserWorkspaces);
router.post("/", createWorkspace);
router.get("/:workspaceId", getWorkspaceById);
router.patch("/:workspaceId", updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

module.exports = router;