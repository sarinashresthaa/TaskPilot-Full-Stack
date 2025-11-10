 
// User data model with authentication and role management capabilities
// Provides core functionality for the task management system
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      default: "password123",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "project_manager", "team_member"],
      default: "team_member",
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.getPermissions = function () {
  const permissions = {
    admin: {
      canManageUsers: true,
      canViewAllProjects: true,
      canCreateProjects: true,
      canEditAllProjects: true,
      canDeleteProjects: true,
      canAssignRoles: true,
      canViewActivityLogs: true,
      canManageSystem: true,
    },
    project_manager: {
      canManageUsers: false,
      canViewAllProjects: false,
      canCreateProjects: true,
      canEditOwnProjects: true,
      canDeleteOwnProjects: true,
      canAssignTasks: true,
      canManageTeamMembers: true,
      canViewProjectReports: true,
    },
    team_member: {
      canManageUsers: false,
      canViewAssignedProjects: true,
      canUpdateAssignedTasks: true,
      canCommentOnTasks: true,
      canViewProjectDashboard: true,
      canCollaborate: true,
    },
  };

  return permissions[this.role] || permissions.team_member;
};

module.exports = mongoose.model("User", userSchema);
