 
// Project route definitions for project CRUD and team management
// Provides core functionality for the task management system
const express = require("express");
const projectController = require("../controllers/projectController");

const auth = require("../middleware/auth");
const {
  requireProjectManager,
  requireTeamMemberOrAbove,
} = require("../middleware/rbac");

const router = express.Router();

// Apply auth to all routes
router.use(auth);

// GET routes - accessible to team members and above
router.get("/", requireTeamMemberOrAbove, projectController.getUserProjects);
router.get("/:id", requireTeamMemberOrAbove, projectController.getProjectById);

// POST routes - require project manager or admin
router.post("/", requireProjectManager, projectController.createProject);
router.post(
  "/:id/members",
  requireProjectManager,
  projectController.addProjectMember
);

router.put("/:id", requireProjectManager, projectController.updateProject);

module.exports = router;
