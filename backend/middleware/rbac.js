 
// Role-based access control middleware for permission management
// Provides core functionality for the task management system

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        error: "NO_USER",
      });
    }

    const userRole = req.user.role;

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(userRole)) {
      console.log("Reporting forbidden access tried.");
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
        error: "INSUFFICIENT_PERMISSIONS",
        userRole: userRole,
        requiredRoles: roles,
      });
    }

    next();
  };
};

const requireAdmin = requireRole("admin");

const requireProjectManager = requireRole(["admin", "project_manager"]);

const requireTeamMemberOrAbove = requireRole([
  "admin",
  "project_manager",
  "team_member",
]);


const canManageProject = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const projectId =
      req.params.id || req.params.projectId || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role === "admin") {
      req.project = project;
      return next();
    }

    if (
      req.user.role === "project_manager" &&
      project.isManager(req.user._id)
    ) {
      req.project = project;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You can only manage your own projects.",
      error: "PROJECT_ACCESS_DENIED",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const canAccessProject = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const projectId =
      req.params.id || req.params.projectId || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role === "admin") {
      req.project = project;
      return next();
    }

    if (
      req.user.role === "project_manager" &&
      project.isManager(req.user._id)
    ) {
      req.project = project;
      return next();
    }

    if (project.isTeamMember(req.user._id)) {
      req.project = project;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You are not a member of this project.",
      error: "PROJECT_ACCESS_DENIED",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const canManageTask = async (req, res, next) => {
  try {
    const Task = require("../models/Task");
    const Project = require("../models/Project");
    const taskId = req.params.taskId || req.params.id;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "admin") {
      req.task = task;
      return next();
    }

    if (
      req.user.role === "project_manager" &&
      task.project.isManager(req.user._id)
    ) {
      req.task = task;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You can only manage tasks in your projects.",
      error: "TASK_MANAGEMENT_DENIED",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const canUpdateTaskStatus = async (req, res, next) => {
  try {
    const Task = require("../models/Task");
    const taskId = req.params.taskId || req.params.id;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "admin") {
      req.task = task;
      return next();
    }

    if (
      req.user.role === "project_manager" &&
      task.project.isManager(req.user._id)
    ) {
      req.task = task;
      return next();
    }

    if (task.isAssignedTo(req.user._id)) {
      req.task = task;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You can only update tasks assigned to you.",
      error: "TASK_UPDATE_DENIED",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requireRole,
  requireAdmin,
  requireProjectManager,
  requireTeamMemberOrAbove,
  canManageProject,
  canAccessProject,
  canManageTask,
  canUpdateTaskStatus,
};
