 
// Project management controller for CRUD operations and team assignments
// Provides core functionality for the task management system
const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, teamMembers } =
      req.body;

    const project = new Project({
      title,
      description,
      category: category || "development",
      startDate: startDate || new Date(),
      endDate,
      manager: req.user._id,
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
    });

    await project.save();

    const projectMember = new ProjectMember({
      project: project._id,
      user: req.user._id,
      role: "manager",
    });
    await projectMember.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params; // project id from URL
    const { title, description, category, startDate, endDate, teamMembers } =
      req.body;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (teamMembers) project.teamMembers = teamMembers;

    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("💥 updateProject - Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    console.log(
      "📋 getUserProjects - req.user:",
      req.user
        ? {
            id: req.user._id,
            username: req.user.username,
            role: req.user.role,
          }
        : "UNDEFINED"
    );

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const query = req.user.role === "admin" ? {} : { user: req.user._id };

    const projectMembers = await ProjectMember.find(query).populate("project");

    console.log(
      "📋 getUserProjects - Found project members:",
      projectMembers.length
    );

    // Extract projects
    let projects = projectMembers.map((pm) => pm.project);

    // Deduplicate by _id
    projects = projects.filter(
      (proj, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === proj._id.toString())
    );

    console.log("📋 getUserProjects - Returning projects:", projects.length);

    res.json({ projects });
  } catch (error) {
    console.log("💥 getUserProjects - Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("manager", "name email username")
      .populate("teamMembers", "name email username role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role === "admin") {
      return res.json({ project });
    }

    const isMember = await ProjectMember.findOne({
      project: project._id,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProjectMember = async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;

    const isManager = await ProjectMember.findOne({
      project: req.params.id,
      user: req.user._id,
      role: "manager",
    });

    if (!isManager) {
      return res.status(403).json({ message: "Only managers can add members" });
    }

    const existingMember = await ProjectMember.findOne({
      project: req.params.id,
      user: userId,
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    const projectMember = new ProjectMember({
      project: req.params.id,
      user: userId,
      role,
    });

    await projectMember.save();
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
