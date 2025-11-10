 
// Database seeding utilities for initial data population
// Provides core functionality for the task management system
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Priority = require("../models/Priority");
const User = require("../models/User");
const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");
const Task = require("../models/Task");
const TaskAllocation = require("../models/TaskAllocation");

// Priority mapping function to convert seed data priorities to model enum values
const mapPriority = (priority) => {
  const priorityMap = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
  };
  return priorityMap[priority?.toLowerCase()] || 'Medium';
};

// Load seed data from JSON file
const loadSeedData = () => {
  try {
    const seedDataPath = path.join(__dirname, "devSeed.json");
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));
    return seedData;
  } catch (error) {
    console.error("Failed to load seed data:", error.message);
    throw error;
  }
};

const seedPriorities = async () => {
  try {
    const priorities = [
      {
        name: "Low",
        level: 1,
        description:
          "Low priority tasks that can be completed when time permits",
      },
      {
        name: "Medium",
        level: 2,
        description: "Medium priority tasks that should be completed soon",
      },
      {
        name: "High",
        level: 3,
        description: "High priority tasks that need immediate attention",
      },
      {
        name: "Urgent",
        level: 4,
        description: "Urgent tasks that must be completed as soon as possible",
      },
    ];

    const existingPriorities = await Priority.find();
    if (existingPriorities.length === 0) {
      await Priority.insertMany(priorities);
      console.log("Priorities seeded successfully");
    } else {
      console.log("Priorities already exist");
    }
  } catch (error) {
    console.error("Error seeding priorities:", error);
  }
};

const seedUsers = async () => {
  try {
    console.log("Starting user seeding process...");
    const seedData = loadSeedData();
    const users = seedData.users.map((user) => ({
      ...user,
      lastLogin: new Date(),
    }));

    const existingUsers = await User.find();
    // Allow seeding if there's only admin user (1 user) or no users (0 users)
    if (existingUsers.length <= 1) {
      console.log(`Seeding ${users.length} users...`);
      const createdUsers = [];

      // Create users individually to trigger pre-save hooks for password hashing
      for (const userData of users) {
        try {
          console.log(`Creating user: ${userData.name} (${userData.email})`);
          console.log(`  Original password: ${userData.password}`);

          const user = new User(userData);
          const savedUser = await user.save();
          createdUsers.push(savedUser);

          console.log(`  Password after hashing: ${savedUser.password.substring(0, 10)}...`);
          console.log(`✅ Successfully created user: ${savedUser.name}`);
        } catch (userError) {
          console.error(`❌ Failed to create user ${userData.name}:`, userError.message);
          if (userError.code === 11000) {
            console.error(`  Duplicate key error for ${userData.email}`);
          }
        }
      }

      console.log(`Successfully seeded ${createdUsers.length} out of ${users.length} users`);

      // Log user details summary
      createdUsers.forEach((user) => {
        console.log(
          `- Created user: ${user.name} (${user.email}) - Role: ${user.role}`,
        );
      });
    } else {
      console.log(
        `Users already exist (${existingUsers.length} found). Skipping user seeding.`,
      );
    }
  } catch (error) {
    console.error("Error seeding users:", error.message);
    if (error.code === 11000) {
      console.error(
        "Duplicate key error: User with this email or username already exists",
      );
    }
    throw error;
  }
};

const seedProjects = async () => {
  try {
    console.log("Starting project seeding process...");
    const seedData = loadSeedData();

    const existingProjects = await Project.find();
    if (existingProjects.length > 0) {
      console.log(
        `Projects already exist (${existingProjects.length} found). Skipping project seeding.`,
      );
      return;
    }

    console.log(`Seeding ${seedData.projects.length} projects...`);

    for (const projectData of seedData.projects) {
      try {
        // Find manager by email
        const manager = await User.findOne({ email: projectData.managerEmail });
        if (!manager) {
          console.error(
            `Manager not found for email: ${projectData.managerEmail}`,
          );
          continue;
        }

        // Find team members by email
        const teamMembers = await User.find({
          email: { $in: projectData.teamMemberEmails },
        });

        if (teamMembers.length !== projectData.teamMemberEmails.length) {
          console.warn(
            `Warning: Only found ${teamMembers.length} out of ${projectData.teamMemberEmails.length} team members for project: ${projectData.title}`,
          );
        }

        const project = new Project({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          status: projectData.status,
          manager: manager._id,
          teamMembers: teamMembers.map((member) => member._id),
          startDate: new Date(projectData.startDate),
          endDate: new Date(projectData.endDate),
          progress: projectData.progress,
          createdBy: manager._id,
        });

        const createdProject = await project.save();

        // Create ProjectMember entry for the manager
        const managerMember = new ProjectMember({
          project: createdProject._id,
          user: manager._id,
          role: 'manager'
        });
        await managerMember.save();

        // Create ProjectMember entries for all team members
        for (const teamMember of teamMembers) {
          const projectMember = new ProjectMember({
            project: createdProject._id,
            user: teamMember._id,
            role: 'member'
          });
          await projectMember.save();
        }

        console.log(
          `- Created project: ${createdProject.title} (Manager: ${manager.name})`,
        );
        console.log(
          `  Team members: ${teamMembers.map((m) => m.name).join(", ")}`,
        );
        console.log(
          `  Created ${teamMembers.length + 1} ProjectMember entries (1 manager + ${teamMembers.length} members)`
        );
      } catch (projectError) {
        console.error(
          `Failed to create project ${projectData.title}:`,
          projectError.message,
        );
      }
    }

    const totalProjects = await Project.countDocuments();
    console.log(
      `Successfully completed project seeding. Total projects: ${totalProjects}`,
    );
  } catch (error) {
    console.error("Error seeding projects:", error.message);
    throw error;
  }
};

const seedTasks = async () => {
  try {
    console.log("Starting task seeding process...");
    const seedData = loadSeedData();

    const existingTasks = await Task.find();
    if (existingTasks.length > 0) {
      console.log(
        `Tasks already exist (${existingTasks.length} found). Skipping task seeding.`,
      );
      return;
    }

    console.log(`Seeding ${seedData.tasks.length} tasks...`);
    let createdTasksCount = 0;

    for (const taskData of seedData.tasks) {
      try {
        // Find project by title
        const project = await Project.findOne({ title: taskData.projectTitle });
        if (!project) {
          console.error(
            `Project not found for title: ${taskData.projectTitle}`,
          );
          continue;
        }

        // Find assigned users by email
        const assignedUsers = await User.find({
          email: { $in: taskData.assignedToEmails },
        });

        if (assignedUsers.length === 0) {
          console.error(`No assigned users found for task: ${taskData.title}`);
          continue;
        }

        // Find the user who assigned the task
        const assignedBy = await User.findOne({
          email: taskData.assignedByEmail,
        });
        if (!assignedBy) {
          console.error(
            `Assigned by user not found for email: ${taskData.assignedByEmail}`,
          );
          continue;
        }

        const task = new Task({
          title: taskData.title,
          description: taskData.description,
          project: project._id,
          assignedTo: assignedUsers.map((user) => user._id),
          assignedBy: assignedBy._id,
          status: taskData.status,
          priority: taskData.priority,
          category: taskData.category,
          subCategory: taskData.subCategory,
          deadline: new Date(taskData.deadline),
          estimatedEffort: taskData.estimatedEffort,
          actualEffort: taskData.actualEffort,
        });

        // Set completedAt if task is done
        if (taskData.status === "done") {
          task.completedAt = new Date();
        }

        const createdTask = await task.save();
        createdTasksCount++;

        // Create TaskAllocation records for each assigned user
        const taskAllocations = assignedUsers.map(user => ({
          task: createdTask._id,
          teamMember: user._id,
          project: project._id,
          status: 'assigned',
          priority: mapPriority(taskData.priority),
          deadline: new Date(taskData.deadline)
        }));

        await TaskAllocation.insertMany(taskAllocations);

        console.log(
          `- Created task: ${createdTask.title} (${createdTask.status})`,
        );
        console.log(`  Project: ${project.title}`);
        console.log(
          `  Assigned to: ${assignedUsers.map((u) => u.name).join(", ")}`,
        );
        console.log(
          `  Priority: ${createdTask.priority}, Deadline: ${createdTask.deadline.toDateString()}`,
        );
        console.log(
          `  Created ${taskAllocations.length} TaskAllocation records`
        );
      } catch (taskError) {
        console.error(
          `Failed to create task ${taskData.title}:`,
          taskError.message,
        );
      }
    }

    console.log(
      `Successfully completed task seeding. Created ${createdTasksCount} tasks.`,
    );
  } catch (error) {
    console.error("Error seeding tasks:", error.message);
    throw error;
  }
};

const seedTaskAllocations = async () => {
  try {
    console.log("Starting TaskAllocation seeding process...");

    const existingAllocations = await TaskAllocation.find();
    if (existingAllocations.length > 0) {
      console.log(
        `TaskAllocations already exist (${existingAllocations.length} found). Skipping TaskAllocation seeding.`,
      );
      return;
    }

    // Get all tasks with their assigned users
    const tasks = await Task.find().populate('project').populate('assignedTo');
    if (tasks.length === 0) {
      console.log("No tasks found. Cannot create task allocations.");
      return;
    }

    console.log(`Creating TaskAllocations for ${tasks.length} tasks...`);
    let totalAllocations = 0;

    for (const task of tasks) {
      if (task.assignedTo && task.assignedTo.length > 0) {
        const taskAllocations = task.assignedTo.map(user => ({
          task: task._id,
          teamMember: user._id,
          project: task.project._id,
          status: 'assigned',
          priority: mapPriority(task.priority),
          deadline: task.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
        }));

        await TaskAllocation.insertMany(taskAllocations);
        totalAllocations += taskAllocations.length;

        console.log(
          `- Created ${taskAllocations.length} allocations for task: ${task.title}`
        );
      }
    }

    console.log(
      `Successfully completed TaskAllocation seeding. Created ${totalAllocations} allocations.`,
    );
  } catch (error) {
    console.error("Error seeding TaskAllocations:", error.message);
    throw error;
  }
};

module.exports = {
  seedPriorities,
  seedUsers,
  seedProjects,
  seedTasks,
  seedTaskAllocations,
};
