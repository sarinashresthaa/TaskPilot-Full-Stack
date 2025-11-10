 
// Task management controller for task lifecycle and assignment operations
// Provides core functionality for the task management system
const Task = require("../models/Task");
const ProjectMember = require("../models/ProjectMember");
const TaskAllocation = require("../models/TaskAllocation");
const Notification = require("../models/Notification");

// Priority mapping function to convert seed data priorities to model enum values
const mapPriority = (priority) => {
  const priorityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return priorityMap[priority?.toLowerCase()] || "Medium";
};

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      priority,
      category,
      subCategory,
      deadline,
      estimatedEffort,
      assignedTo,
      dependencies,
    } = req.body;

    const isManager = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
      role: "manager",
    });

    const isMember = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!isMember && !isManager) {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      priority: priority || "medium",
      category: category || "development",
      subCategory: subCategory || "other",
      deadline,
      estimatedEffort: estimatedEffort || 0,
      assignedTo: assignedTo || [],
      assignedBy: req.user._id,
      dependencies: dependencies || [],
    });

    await task.save();

    // Create TaskAllocation records for each assigned user
    if (assignedTo && assignedTo.length > 0) {
      const taskAllocations = assignedTo.map((userId) => ({
        task: task._id,
        teamMember: userId,
        project: projectId,
        status: "assigned",
        priority: mapPriority(priority || "medium"),
        deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      }));

      await TaskAllocation.insertMany(taskAllocations);

      // Send notifications to assigned users
      for (const userId of assignedTo) {
        const notification = new Notification({
          recipient: userId,
          message: `You have been assigned a new task: ${task.title}`,
          type: "task_assigned",
          relatedTask: task._id,
        });
        await notification.save();
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email username")
      .populate("assignedBy", "name email username")
      .populate("project", "title");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
      allocationsCreated: assignedTo?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params; // task ID
    const {
      title,
      description,
      priority,
      category,
      subCategory,
      deadline,
      estimatedEffort,
      assignedTo,
      dependencies,
      status,
    } = req.body;

    // Fetch existing task
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user has access (manager or project member)
    const isManager = await ProjectMember.findOne({
      project: existingTask.project,
      user: req.user._id,
      role: "manager",
    });

    const isMember = await ProjectMember.findOne({
      project: existingTask.project,
      user: req.user._id,
    });

    if (!isManager && !isMember && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update task fields (only provided ones)
    if (title) existingTask.title = title;
    if (description) existingTask.description = description;
    if (priority) existingTask.priority = priority;
    if (category) existingTask.category = category;
    if (subCategory) existingTask.subCategory = subCategory;
    if (deadline) existingTask.deadline = deadline;
    if (estimatedEffort !== undefined)
      existingTask.estimatedEffort = estimatedEffort;
    if (dependencies) existingTask.dependencies = dependencies;
    if (status) existingTask.status = status;
    if (assignedTo) existingTask.assignedTo = assignedTo;

    await existingTask.save();

    // Handle TaskAllocation updates if assignedTo changed
    if (assignedTo && Array.isArray(assignedTo)) {
      // Remove old allocations
      await TaskAllocation.deleteMany({ task: existingTask._id });

      // Create new allocations
      const taskAllocations = assignedTo.map((userId) => ({
        task: existingTask._id,
        teamMember: userId,
        project: existingTask.project,
        status: "assigned",
        priority: mapPriority(priority || "medium"),
        deadline: deadline || existingTask.deadline,
      }));

      await TaskAllocation.insertMany(taskAllocations);

      // Notify all newly assigned members
      for (const userId of assignedTo) {
        const notification = new Notification({
          recipient: userId,
          message: `Task "${existingTask.title}" has been updated and assigned to you.`,
          type: "task_updated",
          relatedTask: existingTask._id,
        });
        await notification.save();
      }
    }

    const updatedTask = await Task.findById(existingTask._id)
      .populate("assignedTo", "name email username")
      .populate("assignedBy", "name email username")
      .populate("project", "title");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const isMember = await ProjectMember.findOne({
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email username")
      .populate("assignedBy", "name email username")
      .populate("dependencies", "title status")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { userIds } = req.body;
    const taskId = req.params.taskId;

    // console.log("🎯 assignTask - Task ID:", taskId, "User IDs:", userIds);

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user can assign tasks
    const isManager = await ProjectMember.findOne({
      project: task.project._id,
      user: req.user._id,
      role: "manager",
    });

    if (!isManager && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only managers can assign tasks" });
    }

    // Check for existing allocations
    const existingAllocations = await TaskAllocation.find({
      task: taskId,
      teamMember: { $in: userIds },
    });

    const existingUserIds = existingAllocations.map((alloc) =>
      alloc.teamMember.toString()
    );
    const newAssignees = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );

    if (newAssignees.length === 0) {
      return res
        .status(400)
        .json({ message: "All users are already assigned to this task" });
    }

    // Priority mapping function
    const mapPriority = (priority) => {
      const priorityMap = {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      };
      return priorityMap[priority?.toLowerCase()] || "Medium";
    };

    // Create task allocations
    const taskAllocations = newAssignees.map((userId) => ({
      task: taskId,
      teamMember: userId,
      project: task.project._id,
      status: "assigned",
      priority: mapPriority(task.priority) || "Medium",
      deadline: task.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    }));

    await TaskAllocation.insertMany(taskAllocations);

    // Send notifications
    for (const userId of newAssignees) {
      const notification = new Notification({
        user: userId,
        message: `You have been assigned a new task: ${task.title}`,
        type: "task_assigned",
        relatedTask: taskId,
      });
      await notification.save();
    }

    // console.log("🎯 assignTask - Created allocations for", newAssignees.length, "users");

    res.json({
      message: "Task assigned successfully",
      assignedUsers: newAssignees.length,
      task: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.taskId;

    // console.log("📝 updateTaskStatus - Task:", taskId, "Status:", status, "User:", req.user._id);

    const validStatuses = ["todo", "in-progress", "done", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Valid statuses: assigned, accepted, rejected, in-progress, completed",
      });
    }

    // Check if user has a task allocation for this task
    const taskAllocation = await TaskAllocation.findOne({
      task: taskId,
      teamMember: req.user._id,
    }).populate("task");

    if (!taskAllocation) {
      // Check if user is a manager or admin
      const task = await Task.findById(taskId).populate("project");
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      console.log(task);

      const isManager = await ProjectMember.findOne({
        project: task.project._id,
        user: req.user._id,
        role: "manager",
      });

      if (!isManager && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this task" });
      }
    }

    // Update the task allocation status
    if (taskAllocation) {
      taskAllocation.status = status;

      // Set completedAt timestamp when status changes to completed
      if (status === "completed") {
        taskAllocation.completedAt = new Date();
      } else {
        taskAllocation.completedAt = null;
      }

      await taskAllocation.save();

      // console.log("📝 updateTaskStatus - Updated allocation status for user");

      // Populate task data for response
      const populatedAllocation = await TaskAllocation.findById(
        taskAllocation._id
      ).populate({
        path: "task",
        populate: [
          { path: "assignedBy", select: "name email username" },
          { path: "project", select: "title" },
          { path: "dependencies", select: "title status" },
        ],
      });

      res.json({
        message: "Task status updated successfully",
        allocation: {
          task: populatedAllocation.task,
          status: populatedAllocation.status,
          priority: populatedAllocation.priority,
          deadline: populatedAllocation.deadline,
          completedAt: populatedAllocation.completedAt,
          hoursSpent: populatedAllocation.hoursSpent,
          notes: populatedAllocation.notes,
        },
      });
    }

    // If no allocation exists, this means a manager/admin is updating the general task
    const task = await Task.findById(taskId);
    task.status = status;

    // Set completedAt timestamp when status changes to completed
    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    // console.log("📝 updateTaskStatus - Updated general task status");

    res.json({
      message: "Task status updated successfully",
      task: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    let query = {};

    // 🧩 Role-based filtering
    if (req.user.role === "admin") {
      // Admin can view all tasks
      query = {};
    } else if (req.user.role === "project_manager") {
      // Project manager: tasks assigned by them
      const managedProjects = await ProjectMember.find({
        user: req.user._id,
        role: "manager",
      }).distinct("project");

      query = { project: { $in: managedProjects } };
    } else {
      // Regular member: only their assigned allocations
      query = { teamMember: req.user._id };
    }

    // 🗂️ Fetch allocations with populated task details
    const taskAllocations = await TaskAllocation.find(query)
      .populate({
        path: "task",
        populate: [
          { path: "assignedBy", select: "name email username" },
          { path: "project", select: "title" },
          { path: "dependencies", select: "title status" },
        ],
      })
      .sort({ createdAt: -1 });

    // 🧠 Filter out allocations with missing or deleted tasks
    const validAllocations = taskAllocations.filter(
      (alloc) => alloc.task !== null
    );

    // 🧩 Merge allocation + task data
    let tasks = validAllocations.map((alloc) => {
      const task = alloc.task.toObject();

      return {
        ...task,
        allocation: {
          allocationId: alloc._id,
          status: alloc.status,
          priority: alloc.priority,
          deadline: alloc.deadline,
          hoursSpent: alloc.hoursSpent,
          notes: alloc.notes || null,
        },
      };
    });

    tasks = tasks.filter(
      (task, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === task._id.toString())
    );

    // 🧾 Send clean JSON response
    res.status(200).json({
      success: true,
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("❌ Error in getUserTasks:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email username role")
      .populate("assignedBy", "name email username")
      .populate("project", "title")
      .populate("dependencies", "title status")
      .populate("comments.user", "name username");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned = task.assignedTo.some(
      (user) => user._id.toString() === req.user._id.toString()
    );
    const isCreator =
      task.assignedBy._id.toString() === req.user._id.toString();

    const isMember = await ProjectMember.findOne({
      project: task.project._id,
      user: req.user._id,
    });

    if (req.user.role === "project_manager") {
      return res.json({ task });
    }

    if (!isAssigned && !isCreator && !isMember && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTaskComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    const isCreator = task.assignedBy.toString() === req.user._id.toString();

    const isMember = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!isAssigned && !isCreator && !isMember && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You cannot comment on this task" });
    }

    task.comments.push({
      user: req.user._id,
      text: text,
      createdAt: new Date(),
    });

    await task.save();

    const updatedTask = await Task.findById(taskId).populate(
      "comments.user",
      "name username"
    );

    res.json({
      message: "Comment added successfully",
      comments: updatedTask.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
