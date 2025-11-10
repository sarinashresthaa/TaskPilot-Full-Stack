 
// Authentication controller handling user registration, login, profile management
// Provides core functionality for the task management system
 

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const checkUserExists = async (email, username) => {
  return await User.findOne({
    $or: [{ email }, { username }],
  });
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createUserData = async (body, requester = null) => {
  const { username, email, password, name, role, phone, department } = body;

  const userData = {
    username,
    email,
    password: password || "password123",
    name,
    role: role || "team_member",
    phone,
    department,
  };

  const userCount = await User.countDocuments();
  if (userCount > 0 && requester && requester.role !== "admin") {
    userData.role = "team_member";
  }

  if (requester) {
    userData.createdBy = requester._id;
  }

  return userData;
};

const logActivity = async (user, action, description, req) => {
  await ActivityLog.logActivity({
    user: user._id,
    action,
    targetType: "User",
    targetId: user._id,
    description,
    ipAddress: req.ip,
    userAgent: req.get("User-Agent"),
  });
};

const formatUserResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    profilePicture: user.profilePicture,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdBy: user.createdBy,
    createdAt: user.createdAt,
    permissions: user.getPermissions(),
  };
};

exports.register = async (req, res) => {
  try {
    const { username, email } = req.body;

    console.log(req.body);

    const existingUser = await checkUserExists(email, username);
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    const userData = await createUserData(req.body, req.user);
    const user = new User(userData);
    await user.save();

    if (req.user) {
      await logActivity(
        user,
        "user_created",
        `Created user: ${user.username} with role: ${user.role}`,
        req
      );
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.getPermissions(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    // console.log("🔥 Backend - Login request received");
    // console.log("🔥 Backend - Request headers:", req.headers);
    // console.log("🔥 Backend - Request body:", req.body);
    // console.log("🔥 Backend - Content-Type:", req.get('Content-Type'));

    const { email, password } = req.body;
    // console.log("🔥 Backend - Extracted email:", email);
    // console.log("🔥 Backend - Extracted password:", password ? "[PRESENT]" : "[MISSING]");

    if (!email || !password) {
      // console.log("❌ Backend - Missing email or password");
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      // console.log("❌ Backend - User not found for email:", email)
      return res.status(403).json({
        message: "Invalid credentials or account is deactivated",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // console.log("❌ Backend - Password mismatch for user:", email);
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }

    // console.log("✅ Backend - Password verified for user:", email);

    user.lastLogin = new Date();
    await user.save();

    await logActivity(
      user,
      "user_login",
      `User logged in: ${user.username}`,
      req
    );

    const token = generateToken(user._id);

    // console.log("✅ Backend - Login successful, sending response");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        lastLogin: user.lastLogin,
        permissions: user.getPermissions(),
      },
    });
  } catch (error) {
    // console.log("💥 Backend - Error in login:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // console.log("👤 getCurrentUser - req.user:", req.user ? {
    //     id: req.user._id,
    //     username: req.user.username,
    //     role: req.user.role
    // } : "UNDEFINED");
    // console.log("👤 getCurrentUser - req.userId:", req.userId);
    // console.log("👤 getCurrentUser - req.body:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("createdBy", "username name");

    // console.log("👤 getCurrentUser - Found user:", user ? user.username : "NOT_FOUND");

    res.json({
      user: formatUserResponse(user),
    });
  } catch (error) {
    // console.log("💥 getCurrentUser - Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateUserFields = (user, fields) => {
  const { name, email, phone, department } = fields;
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (department) user.department = department;
};

const updatePassword = async (user, currentPassword, newPassword) => {
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }
  user.password = newPassword;
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, department, currentPassword, newPassword } =
      req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    updateUserFields(user, { name, email, phone, department });

    if (newPassword && currentPassword) {
      try {
        await updatePassword(user, currentPassword, newPassword);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    await user.save();
    await logActivity(
      user,
      "user_updated",
      `User updated profile: ${user.username}`,
      req
    );

    res.json({
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await logActivity(
      req.user,
      "user_logout",
      `User logged out: ${req.user.username}`,
      req
    );
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
